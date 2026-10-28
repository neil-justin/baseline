# Career Path Readiness

An AI-assisted career readiness platform for graduating college students seeking entry-level corporate (white-collar, office-based) roles in the Philippines. Diagnostic and preparation only — never placement.

## Language

### Population & intake

**Discipline Track**:
One of the broad office-based groupings (from the study scope's "office-based discipline tracks") that organizes the career catalog and the student's intake. Students pick a track, then a major within it.
_Avoid_: strand, SHS strand (retired with the old scope)

**Major**:
The specific baccalaureate degree program a student is completing, within a discipline track (e.g., BS Information Technology under Computer & IT).
_Avoid_: course (collides with learning courses — Coursera-style recommendations are a different concept)

**Target Role**:
The specific entry-level corporate occupation a student is preparing to enter. Every diagnostic, gap, and recommendation is computed against one target role at a time.
_Avoid_: dream job, career goal (a goal is a stated intention; the target role is the working assumption the system scores against)

### Competency & evidence

**Career Readiness**:
A graduating student's demonstrated foundation of competencies for workplace success — the NACE college-graduate construct, PH-contextualized. A foundation, not a hiring prediction.
_Avoid_: employability (vaguer), job-readiness (implies an outcome promise)

**Competency Framework**:
The layered, citable source of truth for what skills each role requires. Layers: PSOC (occupational anchor) → PSF (role-level skills, covered sectors) → TESDA office qualifications + O*NET/ESCO (declared gap-fillers where PSF has no sector) → PSF Enabling Skills + NACE (cross-cutting competencies) → CHED CMOs (academic anchor) → DOLE-BLE forecast (demand-side justification for role selection).
_Avoid_: skillset framework, skills taxonomy (panel shorthand, not a defined term)

**Skills Gap**:
The difference between the skills the target role requires (per the Competency Framework) and the student's currently evidenced skills. Gaps are tiered and drive the learning pathway.
_Avoid_: weakness, deficiency

**AI-Assisted**:
The system's AI division of labor: deterministic engines compute all scores, rankings, and gaps; the LLM writes only the explanatory layer (suggestion framing, step rationale, plan narrative), with template fallback when unavailable.
_Avoid_: "AI recommends/decides" phrasing (implies the AI picks outcomes)

**Labor Market Insights**:
Curated reference content per role — occupational definition (PSOC), demand outlook (DOLE-BLE forecast), PH salary context (JobStreet) — grounding why the catalog's roles and their skills matter.
_Avoid_: job market trends, salary guide

**Readiness Channels**:
The five measured dimensions of the index: Employability Skills (ES), Skill Progress (SP), Application & Interview Readiness (AIR), Training & Experience Progress (TP), and Career Clarity (CC). Each channel is a distinct question about the student that the others cannot substitute for.
_Avoid_: rubric criteria (the rubric is the formula; the channels are what it measures)

**Career Readiness Index**:
The composite diagnostic score (0–100): a formative sum of the five weighted Readiness Channels, signifying measured distance-to-role. Not a grade, not a hiring probability.
_Avoid_: readiness percentage (implies mastery), career score

**Diagnostic Tool**:
The system's scope boundary: it assesses, explains, and prepares. It never matches students to employers, processes applications, or guarantees employment, internship, or hiring outcomes.
_Avoid_: recommendation engine language that implies determinism ("the AI says you should be X")

### Application materials

**ATS-friendly**:
Formatting practices that keep a resume machine-readable — text-based content, standard section titles, no content-in-images/text-boxes. A property of formatting, verified by parseability; never a claim about outcomes.
_Avoid_: "ATS pass", "ATS-proof" (outcome claims — the system never guarantees a specific employer's system accepts anything)

### Roles & accounts

**Student**:
The signed-in person the system diagnoses and prepares — a graduating college student pursuing entry-level corporate roles. All app surfaces render the signed-in Student's own data.
_Avoid_: user (ambiguous — could mean any role), learner

**Counselor**:
The staff role — an academic adviser or guidance counselor who signs into the Admin surface to monitor a graduating cohort and audit declared Credentials. "Admin" names the surface, not a person; the person is always a Counselor. A Counselor's view is jurisdiction-scoped: they see only Students in the Sections/Blocks assigned to them, and one Counselor may hold many Sections.
_Avoid_: admin (as a person — collides with System Admin), superuser

**Year Level**:
The student's standing in the program (1st–4th year). The college-scope replacement for grade level; cohort groupings build on it.
_Avoid_: grade level (retired SHS vocabulary)

**Campus**:
The institution (school campus) whose data space a Student or Counselor belongs to. The intended unit of data isolation for multi-campus deployment — each campus's students, counselors, and sections are isolated from every other's.
_Avoid_: school (vague), university (presumes size)

**System Admin**:
The site-operator role held by the study team — manages accounts, seeds demo data, and maintains site health. Distinct from the Counselor; invisible to students.
_Avoid_: admin (unqualified), developer account

**Credential**:
An externally earned, evidence-carrying entry a Student declares (Profile → Credentials): a certification, an internship/job, or a personal project/org role. Entries declare skills from the framework vocabulary across all four discipline tracks; with evidence attached, a Credential is auditable by a Counselor, and once verified it counts as a verified skill and closes gaps like a platform completion does.
_Avoid_: achievement, qualification, badge (gamified connotation)
