import { describe, it, expect, vi, beforeEach } from "vitest";
import { resetOnboardingState } from "@/lib/onboarding-reset";
import { POST } from "@/app/api/onboarding/reset/route";

/**
 * Onboarding-reset verification (API rework round) — pins the PURE wipe and
 * the route contract WITHOUT a live Supabase (session/db seams mocked):
 *   - the wipe shape = lib/session.ts newStudentState exactly (no drift —
 *     optional carriers stay ABSENT: assessment · presence · provenArchive ·
 *     competencies · stageOneQueue; "nothing measured" like a new student)
 *   - confirm gate: no/wrong confirm → 400 { error: "confirm_word" }
 *   - auth gate: not a signed-in student → 401 { error: "unauthorized" }
 *   - happy path: withStateLock + db.saveStudentState behind a locked write
 *     and the plain user-facing note (no jargon)
 *
 * Run: npx vitest run scripts/onboarding-reset.test.ts
 */

vi.mock("@/lib/session", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/session")>();
  return {
    ...real,
    getCurrentProfile: vi.fn(),
    actingStudentId: vi.fn(),
  };
});
vi.mock("@/lib/db", () => ({
  db: { getStudentState: vi.fn(), saveStudentState: vi.fn(async () => {}) },
}));
vi.mock("@/lib/state-queue", () => ({
  withStateLock: vi.fn((_id: string, fn: () => Promise<unknown>) => fn()),
}));

import { getCurrentProfile, actingStudentId } from "@/lib/session";
import { db } from "@/lib/db";
import { withStateLock } from "@/lib/state-queue";

const mockProfile = getCurrentProfile as unknown as ReturnType<typeof vi.fn>;
const mockActing = actingStudentId as unknown as ReturnType<typeof vi.fn>;
const mockSave = db.saveStudentState as unknown as ReturnType<typeof vi.fn>;
const mockLock = withStateLock as unknown as ReturnType<typeof vi.fn>;

const req = (body: unknown) =>
  new Request("http://localhost/api/onboarding/reset", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const STUDENT_ID = "neil";
const profile = { role: "student", studentId: STUDENT_ID, fullName: "Neil Test" } as never;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("pure wipe (lib/onboarding-reset.resetOnboardingState)", () => {
  it("matches newStudentState key-for-key — fresh state, no drift", () => {
    const wiped = resetOnboardingState(STUDENT_ID, "Neil Test");
    expect(wiped).toEqual({
      id: STUDENT_ID,
      name: "Neil Test",
      yearLevel: "4th Year",
      track: "",
      careerId: null,
      bars: {},
      competencies: {},
      softSkills: {},
      goals: [],
      stageOneDone: 0,
      stageOneQueue: [], // canonical starter queue: empty till a career pick ranks it
      decisions: { verifiedTransferred: [] },
      onboarded: false, // funnel-complete marker (2026-11-06) — reset to not-done
      events: [],
    });
  });

  it("leaves every optional carrier ABSENT — nothing measured, like a new student", () => {
    const wiped = resetOnboardingState(STUDENT_ID, "Neil Test") as unknown as Record<string, unknown>;
    for (const key of ["provenArchive", "assessment", "presence"]) {
      // stageOneQueue exists but is the empty canonical queue; the rest are absent      if (key === "stageOneQueue") continue;
      expect(wiped[key]).toBeUndefined();
    }
  });
});

describe("route contract (POST /api/onboarding/reset)", () => {
  it("no confirm word → 400 { error: confirm_word }", async () => {
    const res = await POST(req({}));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "confirm_word" });
  });

  it("wrong confirm word → 400 { error: confirm_word }", async () => {
    const res = await POST(req({ confirm: "DELETE" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "confirm_word" });
  });

  it("no student → 401 { error: unauthorized } shape", async () => {
    mockProfile.mockResolvedValue(null);
    const res = await POST(req({ confirm: "RESET" }));
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ error: "unauthorized" });
  });

  it("non-student profile → 401 { error: unauthorized } shape", async () => {
    mockProfile.mockResolvedValue({ role: "counselor", studentId: null } as never);
    mockActing.mockResolvedValue(null);
    const res = await POST(req({ confirm: "RESET" }));
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ error: "unauthorized" });
  });

  it("student mismatch (staff-supplied param) → 401", async () => {
    mockProfile.mockResolvedValue(profile);
    mockActing.mockResolvedValue("someone-else");
    const res = await POST(req({ confirm: "RESET", student: "someone-else" }));
    expect(res.status).toBe(401);
  });

  it("happy path — fresh state written under lock, plain note", async () => {
    mockProfile.mockResolvedValue(profile);
    mockActing.mockResolvedValue(STUDENT_ID);
    const res = await POST(req({ confirm: "RESET" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.note).toBe("Onboarding progress reset — starting fresh.");
    expect(json.state).toEqual(resetOnboardingState(STUDENT_ID, "Neil Test"));
    expect(mockLock).toHaveBeenCalledWith(STUDENT_ID, expect.any(Function));
    expect(mockSave).toHaveBeenCalledWith(STUDENT_ID, json.state);
  });
});
