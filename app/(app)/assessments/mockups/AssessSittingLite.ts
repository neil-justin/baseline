/**
 * AssessSittingLite.ts — the engine-true facts the hub page hands the
 * sitting mockup realm (the careers realm's rule: re-pass the shipped
 * page's compute props — the mockup never paints a value it wasn't given).
 */
export interface SittingLiteRow {
  name: string;
  state: "verified" | "checked" | "claimed" | "open";
  banked: boolean;
}

export interface SittingLite {
  es: number;
  esVerified: number;
  takenAt: string | null;
  careerName: string | null;
  proven: number;
  total: number;
  claimed: number;
  bankedClaimed: number;
  rows: SittingLiteRow[];
}
