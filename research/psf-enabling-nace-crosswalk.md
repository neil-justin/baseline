# PSF Enabling Skills and Competencies ↔ NACE cross-walk (created 2026-10-29)

Purpose: evidence base for mapping the **Philippine Skills Framework "Enabling Skills and Competencies" (ESCs)** — the PSF's generic, cross-cutting (non-sector, non-functional) skills — onto the seven NACE Career Readiness Competencies the product instrument uses (`research/nace-competency-definitions-2026.md`). Companion to `.scratch/career-readiness-platform/research/ph-competency-frameworks.md` §1.2/§1.8/§2 (layering decision in `docs/adr/0001-ph-anchored-competency-framework.md`).

## 1. Source block (what was actually fetched, 2026-10-29)

| Doc | Recent version evidence | Host I fetched | Result |
|---|---|---|---|
| **Philippine Skills Framework for Contact Center and Business Process Management (PSF-CCB), Version 1.0** | §Introduction (printed p. 6): "the PSF-CCB Version 1.0 was created, approved, and finally launched in April 2024." | **DepEd** recorded URL `https://www.deped.gov.ph/wp-content/uploads/Philippine-Skills-Framework-for-Contact-Center-and-Business-Process-Management.pdf` — **fetch FAILED**: repeated `HTTP/1.1 502 Bad Gateway` (Microsoft-Azure-Application-Gateway/v2; response body is DepEd's maintenance-image page). | **Substitute host used: TESDA catalog** (`https://www.tesda.gov.ph/About/TESDA/27898`), which lists the same document at `https://www.tesda.gov.ph/Uploads/File/Philippine%20Skills%20Framework/ICT/Philippine%20Skills%20Framework%20for%20Contact%20Center%20and%20Business%20Process%20Management.pdf` — fetched successfully (HTTP 200, 320 pp., PDF producer metadata creation date 2024-08-12). |
| **Philippine Skills Framework on Human Capital Development (PSF-HCD), Version 1.0** | §About the PSF–HCD (printed p. 5): "the PSF-HCD Version 1.0 was created, approved, and finally launched on May 6, 2022." | **HREAP** recorded URL `https://hreap.org/wp-content/uploads/2023/02/Philippines-Skills-Framework-on-Human-Capital-Development-Version-1.0.pdf` — fetched successfully (HTTP 200, 242 pp., PDF 1.6, creationDate 2022-05-06, matching the stated launch date). | No substitution needed. |

Other fetch notes: `webfetch` internally refused both `application/pdf` responses (`Unsupported fetched file content type: application/pdf`); substitution was `curl` to local copies extracted with PyMuPDF. The archived-DepEd fallback (web.archive.org) was not needed and returned `HTTP 000` (curl timeout) on the one attempt made.

Fetched copies retained locally during this session: `/tmp/opencode/psf-ccb.pdf` (TESDA copy), `/tmp/opencode/psf-hcd.pdf` (HREAP copy).

## 2. Verbatim enabling-skills list (as printed in the PDFs)

Both documents carry the **identical 16 ESC titles** (PSF wording is borrowed from the Singapore SkillsFramework methodology both documents describe). Wording is quoted per document because spelling variants differ (CCB uses British spellings and some OCR-visible typos — quoted as printed). Coded ESC blocks: Basic / Intermediate / Advanced proficiency descriptions, specimen codes `ESC-<cluster>-<lvl>##-1` (HCD) and `GSC-<abbr>-<lvl>###-1` (CCB).

### 2.1 Structure and clusters (what an ESC block contains, as printed)

Each ESC block in both documents consists of: an italic one-sentence skill description (the sentence quoted in §2.2 — this is the skill's operative statement the Skills Maps reference by ESC code), an "ESC Proficiency Description" table with **BASIC / INTERMEDIATE / ADVANCED** level descriptors, "Underpinning Knowledge" bullets, and "Skills Application" bullets. The ESC list is cluster-organized.

Clusters as printed in **both** documents (PSF-HCD §"Enabling Skills and Competencies (ESC)", divider printed p. 192 = PDF p. 194: header "SKILLS TO BUILD SKILLS" with the three cluster labels):

**Interacting with Others**

- Building Inclusivity
- Collaboration
- Communication
- Customer Orientation
- Developing People
- Influence

**Staying Relevant**

- Adaptability
- Digital Fluency
- Global Perspective
- Learning Agility
- Self Management

**Thinking Critically**

- Creative Thinking
- Decision Making
- Problem Solving
- Sense Making
- Transdisciplinary Thinking

### 2.2 Exact descriptions quoted (one per document's ESC section so wording is traceable to a specific page/spread)

From **PSF-HCD (HREAP copy), §Enabling Skills and Competencies (ESC), printed pp. 193–208; PDF pp. 195–210 of the fetched copy:**

- Building Inclusivity — "Collaborate with stakeholders from different backgrounds or with different abilities, including diversity dimensions such as race, ethnicity, religion, gender orientation, age, physical, and learning ability, education, socio-economic status, and political belief, to understand the interests of diverse groups and build an inclusive work environment" (printed p. 193; ESC-IWO-B001-…)
- Collaboration — "Manage relationships and work collaboratively and effectively with others to achieve goals" (printed p. 194)
- Communication — "Convey and exchange thoughts, ideas, and information effectively through various mediums and approaches" (printed p. 195)
- Customer Orientation — "Identify the needs of customers, both internal and external, to deliver an effective customer experience" (printed p. 196)
- Developing People — "Empower others to learn and develop their capabilities to enhance their performance and achieve personal or professional goals" (printed p. 197)
- Influence — "Influence behaviors, beliefs, or attitudes in order to achieve desired outcomes and solutions" (printed p. 198)
- Adaptability — "Exercise flexibility in behaviors or approaches to respond to changes and evolving contexts" (printed p. 199)
- Digital Fluency — "Leverage digital technology tools, systems, and software across work processes and activities to solve problems, drive efficiency, and facilitate information sharing" (printed p. 200)
- Global Perspective — "Operate in cross-cultural environments, demonstrating an awareness of the wider global context, and markets to identify potential opportunities and risks" (printed p. 201)
- Learning Agility — "Deploy different learning approaches that enable continuous learning across different contexts to drive self development and the achievement of long-term career goals" (printed p. 202)
- Self Management — "Take ownership of managing one's personal effectiveness, personal brand, and holistic physical, mental, emotional and social well-being" (printed p. 203)
- Creative Thinking — "Adopt diverse perspectives in combining ideas or information, and making connections between different fields to create different ideas, improvements, and solutions" (printed p. 204)
- Decision Making — "Choose a course of action from several alternatives developed through a structured process in order to achieve intended goals" (printed p. 205)
- Problem Solving — "Generate effective and efficient solutions to solve problems and capitalize on new opportunities" (printed p. 206)
- Sense Making — "Leverage sources of qualitative and quantitative information and data to recognize patterns, spot opportunities, infer insights, and inform decisions" (printed p. 207)
- Transdisciplinary Thinking — "Apply concepts from multiple disciplines, and synthesize different areas of knowledge and insights to guide decisions, foster cooperation, and drive continuous improvement" (printed p. 208)

From **PSF-CCB (TESDA copy), §Enabling Skills and Competencies (ESC), printed pp. 598–613; PDF pp. 301–308 of the fetched copy** (British spellings, as printed; the same 16 titles):

- Building Inclusivity — "Collaborate with stakeholders from different backgrounds or with different abilities, including diversity dimensions such as race, ethnicity, religion, gender orientation, age, physical and learning ability, education, socio-economic status and political belief, to understand the interests of diverse groups and build an inclusive work environment" (p. 598–599; codes GSC-BDI-…)
- Adaptability — "Exercise flexibility in behaviours or approaches to respond to changes and evolving contexts" (p. 598–599; GSC-ADT-…)
- Communication — "Convey and exchange thoughts, ideas and information effectively through various mediums and approaches" (p. 600–601; GSC-CMC-…)
- Collaboration — "Manage relationships and work collaboratively and effectively with others to achieve goals" (p. 600–601; GSC-CLB-…)
- Customer Orientation — "Identify the needs of customers, both internal and external, to deliver an effective customer experience" (p. 602–603; GSC-CUO-…)
- Creative Thinking — "Adopt diverse perspectives in combining ideas or information and making connections between different fields to create different ideas, improvements and solutions" (p. 602–603; GSC-CTH-…)
- Developing People — "Empower others to learn and develop their capabilities to enhance their performance and achieve personal or professional goals" (p. 604–605; GSC-DVP-…)
- Decision Making — "Choose a course of action from several alternatives developed through a structured process in order to achieve intended goals" (p. 604–605; GSC-DCM-…)
- Global Perspective — "Operate in cross-cultural environments, demonstrating an awareness of the wider global context and markets to identify potential opportunities and risks" (p. 606–607; GSC-GBP-…)
- Digital Fluency — "Leverage digital technology tools, systems, and software across work processes and activities to solve problems, drive efficiency and facilitate information sharing" (p. 606–607; GSC-DGF-…)
- Learning Agility — "Deploy different learning approaches which enable continuous learning across different contexts to drive self development and the achievement of long-term career goals" (p. 608–609; GSC-LGA-…)
- Influence — "Influence behaviours, beliefs or attitudes in order to achieve desired outcomes and solutions" (p. 608–609; GSC-IFL-…)
- Self Management — "Take ownership of managing one's personal effectiveness, personal brand and holistic physical, mental, emotional and social well-being" (p. 610–611; GSC-SMT-…)
- Problem Solving — "Generate effective and efficient solutions to solve problems and capitalise on new opportunities" (p. 610–611; GSC-PRS-…)
- Sense Making — "Leverage sources of qualitative and quantitative information and data to recognise patterns, spot opportunities, infer insights and inform decisions" (p. 612–613; GSC-SMG-…)
- Transdisciplinary Thinking — "Apply concepts from multiple disciplines, and synthesise different areas of knowledge and insights to guide decisions, foster cooperation and drive continuous improvement" (p. 612–613; GSC-TRA-…)

What ESCs are for, in the PSF's own words: PSF-CCB §Technical Guide (printed p. 616): "Enabling Skills and Competencies (ESCs), and the required levels of competence, are then defined to address the leadership and interpersonal skills." PSF-HCD §Technical Guide (printed p. 227): "Functional Skills and Competencies (FSCs) are more technical in nature while Enabling Skills and Competencies (ESCs) are usually the core, critical, essential, or soft skills, or what we call as Skills to Build Skills."

## 3. Cross-walk table

Rule applied: a match must follow from operative words of the NACE definition (as quoted in `research/nace-competency-definitions-2026.md`), with the PSF ESC's Basic/Intermediate/Advanced descriptors held to entry-competency standard; where the evidence is weaker than near-verbatim overlap, the row says so. **No cell is stretched.** NACE definitions quoted on disk 2026-10-29.

| PSF enabling skill (verbatim, short cite) | NACE match (primary / secondary) | Justification (operative words) |
|---|---|---|
| Adaptability (HCD p. 199; CCB p. 598–599) | — no match among the seven | NACE's seven have no competency for flexibility under change; nearest neighbor Professionalism ("effective work habits") addresses regulated/unregulated work settings, not responsiveness to evolving contexts. Left blank deliberately. |
| Building Inclusivity (HCD p. 193; CCB p. 598–599) | — no match among the seven; declared E&I unmatchable | The ESC's own vocabulary is diversity/inclusion ("diversity dimensions such as race, ethnicity, religion…build an inclusive work environment") — this is NACE's Equity & Inclusion, which the instrument excludes by design. Nearest seven-competency neighbor is Teamwork's "appreciating diverse viewpoints", but that clause does not cover inclusive-environment building; flagged as a partial, not load-bearing. |
| Collaboration (HCD p. 194; CCB p. 600–601) | **Teamwork** | Near-verbatim: PSF "Manage relationships and work collaboratively and effectively with others to achieve goals" ↔ NACE "Build and maintain collaborative relationships to work effectively toward common goals, while appreciating diverse viewpoints and shared responsibilities". |
| Communication (HCD p. 195; CCB p. 600–601) | **Communication** | Near-verbatim: PSF "Convey and exchange thoughts, ideas and information effectively…" ↔ NACE "Clearly and effectively exchange information, ideas, facts, and perspectives…". |
| Creative Thinking (HCD p. 204; CCB p. 602–603) | — no direct match; Critical Thinking secondary at best | NACE Critical Thinking covers "analysis of relevant information" for "needs", not ideation ("combining ideas or information…to create different ideas, improvements, and solutions"). Listed as secondary only because NACE's decision requirement ("respond to needs") is the consumer of ideation outputs; not a strong anchor. |
| Customer Orientation (HCD p. 196; CCB p. 602–603) | — no match among the seven | None of the seven NACE competencies names customer/internal-customer service; Professionalism's "act in the interest of the larger community and workplace" is community/workplace, not customer-need anticipation. Blank. |
| Decision Making (HCD p. 205; CCB p. 604–605) | **Critical Thinking** | PSF "Choose a course of action from several alternatives developed through a structured process…" ↔ NACE "Identify and respond to needs based upon an understanding of situational context and logical analysis of relevant information" — both bind course-of-action choice to structured analysis. |
| Developing People (HCD p. 197; CCB p. 604–605) | **Leadership** (weak primary) | PSF "Empower others to learn and develop their capabilities to enhance their performance…" vs NACE Leadership "Recognize and capitalize on personal and team strengths to achieve organizational goals" — common core is building on others' strengths toward performance, but NACE's leadership definition is narrower than the PSF's capability-building intent; flagged weak. |
| Digital Fluency (HCD p. 200; CCB p. 606–607) | **Technology** | Near-verbatim: PSF "Leverage digital technology tools, systems, and software…to solve problems, drive efficiency and facilitate information sharing" ↔ NACE "Understand and leverage technologies ethically to enhance efficiencies, complete tasks, and accomplish goals". |
| Global Perspective (HCD p. 201; CCB p. 606–607) | — no match among the seven | No NACE competency among the seven covers global/cross-cultural operation. Blank. |
| Influence (HCD p. 198; CCB p. 608–609) | **Leadership** (weak primary) | PSF "Influence behaviours, beliefs or attitudes in order to achieve desired outcomes and solutions" ↔ NACE Leadership's "capitalize on personal and team strengths to achieve organizational goals" — overlap limited to goal-achievement through others; NACE does not name persuasion/influence. Weak, flagged. |
| Learning Agility (HCD p. 202; CCB p. 608–609) | **Career & Self-Development** | Near-verbatim: PSF "…enable continuous learning across different contexts to drive self development and the achievement of long-term career goals" ↔ NACE "Proactively develop oneself and one's career through continual personal and professional learning…". |
| Problem Solving (HCD p. 206; CCB p. 610–611) | **Critical Thinking** | PSF "Generate effective and efficient solutions to solve problems…" ↔ NACE "Identify and respond to needs…through…logical analysis of relevant information"; solution-generation is the response-to-needs endpoint. |
| Sense Making (HCD p. 207; CCB p. 612–613) | **Critical Thinking** | Near-verbatim at the analysis stage: PSF "Leverage sources of qualitative and quantitative information and data to recognise patterns…inform decisions" ↔ NACE "…logical analysis of relevant information". |
| Self Management (HCD p. 203; CCB p. 610–611) | **Professionalism** (weak primary) | PSF "managing one's personal effectiveness…physical, mental, emotional and social well-being" ↔ NACE Professionalism "demonstrate effective work habits"; core overlap is personal effectiveness/self-regulation at work. NACE's second clause ("act in the interest of the larger community and workplace") and the PSF's well-being/brand clauses do not map; flagged weak. |
| Transdisciplinary Thinking (HCD p. 208; CCB p. 612–613) | **Critical Thinking** (primary) / **Teamwork** (secondary) | Primary: PSF "…synthesize different areas of knowledge and insights to guide decisions" ↔ NACE "logical analysis of relevant information…" as a decision input; also structurally supported by PSF's own cluster placement (both documents group it under the "Thinking Critically" ESC cluster, HCD p. 192 / CCB §ESC). Secondary: PSF "foster cooperation…" ↔ NACE Teamwork "Build and maintain collaborative relationships to work effectively toward common goals". |

Match counts among the seven instrument competencies (strong anchors only, i.e., at least one near-verbatim row): **Communication ✓, Critical Thinking ✓ (Decision Making, Problem Solving, Sense Making; Transdisciplinary Thinking not load-bearing), Teamwork ✓ (Collaboration), Technology ✓ (Digital Fluency), Career & Self-Development ✓ (Learning Agility), Leadership ~ (Developing People / Influence — both explicitly flagged weak), Professionalism ~ (Self Management — explicitly flagged weak).**

## 4. Coverage note (said plainly)

- **Technology is NOT an uncovered cell** — this prediction from the task brief is wrong on the evidence. The PSF's own `Digital Fluency` ESC ("Leverage digital technology tools, systems, and software across work processes and activities…") is a near-verbatim anchor for NACE Technology, present in both PSF-CCB §ESC (p. 606–607) and PSF-HCD §ESC (p. 200).
- **Career & Self-Development also has an anchor** (contrary to the "possibly none" expectation): `Learning Agility` ("continuous learning across different contexts to drive self development and the achievement of long-term career goals", HCD p. 202; CCB p. 608–609).
- **The actual never-matches among NACE's seven, from PSF ESC evidence:** Adaptability, Building Inclusivity (natural NACE home = E&I, excluded from instrument), Creative Thinking (only weak/partially Critical Thinking), Customer Orientation, Global Perspective — **5 of 16 ESCs have no NACE anchor, and the seven NACE competencies receive no PSF-ESC anchor for those five**. Conversely, **Leadership and Professionalism are the only two instrument competencies with only weak/partial PSF anchored rows** (Developing People, Influence, Self Management) — if the panel probes those two, hold the justification at "weak primary," do not upgrade to strong.
- Nothing is forced into a cell above; blanks are an explicit finding, not an omission.

## 5. How to cite

- PSF-CCB v1.0: *Philippine Skills Framework for Contact Center and Business Process Management, Version 1.0* (DICT–CCAP et al., launched April 2024), §Enabling Skills and Competencies (ESC), pp. 598–613 — stable URL as fetched 2026-10-29: TESDA `https://www.tesda.gov.ph/Uploads/File/Philippine%20Skills%20Framework/ICT/Philippine%20Skills%20Framework%20for%20Contact%20Center%20and%20Business%20Process%20Management.pdf` (the DepEd-hosted copy, the preferential long-term citation, was 502 on 2026-10-29; recheck DepEd before final citation and confirm page numbers match before relying on the TESDA copy in print).
- PSF-HCD v1.0: *Philippine Skills Framework on Human Capital Development, Version 1.0* (PTTC/TESDA/DOLE et al., launched May 6, 2022), §Enabling Skills and Competencies (ESC), pp. 192–208 — stable URL as fetched 2026-10-29: HREAP `https://hreap.org/wp-content/uploads/2023/02/Philippines-Skills-Framework-on-Human-Capital-Development-Version-1.0.pdf`.
- NACE operative definitions: from `research/nace-competency-definitions-2026.md` (verbatim from naceweb.org, web-verified 2026-10-29; archival PDF per §1.8 of the scratch notes).
