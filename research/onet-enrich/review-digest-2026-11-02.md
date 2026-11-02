# Stage A review digest — O*NET 31.0 enrich · USER RULING FORM (2026-11-02)

_Companion to diff-log.md; not a recommendation sheet. Both sides VERBATIM, resolved from lib/fixtures and research/onet-enrich/pulls (never the ellipsized log cells). Defaults are neutral starting points; override any row._

Pin: **O*NET DB 31.0 · api_version 2.0.0 · O*NET-SOC 2019** (captured from the API's /about/; ruled by user 2026-11-02).

## 1 · No ruling needed (state closed)
- **231 claim-spans MATCH** the served snapshot exactly — provenance healthy.
- **15 PH-anchored tracks** (PSF/TESDA/PSOC/NACE rows): NO-OUR-ROW by design (ADR 0005 layering).
- **fin (13-2051.00):** skills + work-activities serve `total: 0` API-side — recorded honourfully empty, nothing substituted (26 tasks / 27 tech categories did serve).
- Served `importance undefined` on some 31.0-era task rows — printed as served.

## 2 · The 14 DIFFERS claim-spans — RULE ROW BY ROW

| ID | track | fixture row (tag) | OURS (fixture print) | SERVED 31.0 (nearest match) | overlap | default |
|---|---|---|---|---|---|---|
| D1 | it | Software Testing (PSF) | Develop and execute software tests to identify software problems and their causes. | Identify, analyze, and document problems with program function, output, online screen, or content. | 30% | KEEP our printed span (row source is PSF — outside the O*NET pin) |
| D2 | it | Client-side coding (HTML/CSS/JS) (O*NET) | Write computer programming code. | Write supporting code for Web applications or Web sites. | 50% | ADOPT the served O*NET 31.0 wording verbatim (provenance follows the pin) |
| D3 | it | ↳ task-cluster sub-row: site life-operations (O*NET) | Update website content. | Design, build, or maintain Web sites, using authoring or scripting languages, content creation tools, management tools, and digital media. | 33% | ADOPT the served O*NET 31.0 wording verbatim (provenance follows the pin) |
| D4 | it | CMS administration (WordPress etc.) (O*NET) | Update website content. | Design, build, or maintain Web sites, using authoring or scripting languages, content creation tools, management tools, and digital media. | 33% | ADOPT the served O*NET 31.0 wording verbatim (provenance follows the pin) |
| D5 | it | Responsive/UI basics + accessibility (O*NET) | Design websites or web applications. | Write supporting code for Web applications or Web sites. | 60% | ADOPT the served O*NET 31.0 wording verbatim (provenance follows the pin) |
| D6 | it | Version control (git) (O*NET) | Recommend changes to improve computer or information systems. | Evaluate code to ensure that it is valid, is properly structured, meets industry standards, and is compatible with browsers, devices, or operating systems. | 38% | ADOPT the served O*NET 31.0 wording verbatim (provenance follows the pin) |
| D7 | it | Agile Software Development (when agency-run) (PSF) | Collaborate with others to resolve information technology issues. | Confer with management or development teams to prioritize needs, resolve conflicts, develop content criteria, or choose solutions. | 38% | KEEP our printed span (row source is PSF — outside the O*NET pin) |
| D8 | business | Event-records keeping (incl. financials) (O*NET) | Verify accuracy of records. | Maintain records of event aspects, including financial details. | 50% | ADOPT the served O*NET 31.0 wording verbatim (provenance follows the pin) |
| D9 | business | Bills review & payment approval (O*NET) | Authorize financial actions. | Maintain records of event aspects, including financial details. | 33% | ADOPT the served O*NET 31.0 wording verbatim (provenance follows the pin) |
| D10 | business | Administrative details & inquiries (O*NET) | Correspond with customers to answer questions or resolve complaints. | Consult with customers to determine objectives and requirements for events, such as meetings, conferences, and conventions. | 33% | ADOPT the served O*NET 31.0 wording verbatim (provenance follows the pin) |
| D11 | accounting | Employ financial models to develop solutions or assess the financial or capital impact o (O*NET) | Employ financial models to develop solutions or assess the financial or capital impact of transactions | Employ financial models to develop solutions to financial problems or to assess the financial or capital impact of transactions. | 100% | ADOPT the served O*NET 31.0 wording verbatim (provenance follows the pin) |
| D12 | accounting | Explain to customers the different types of loans and credit options (including terms) (O*NET) | Explain to customers the different types of loans and credit options (including terms) | Explain to customers the different types of loans and credit options that are available, as well as the terms of those services. | 92% | ADOPT the served O*NET 31.0 wording verbatim (provenance follows the pin) |
| D13 | accounting | Explain, promote, or sell banking products (O*NET) | Explain, promote, or sell banking products | Explain, promote, or sell products or services, such as travelers' checks, savings bonds, money orders, and cashier's checks, using computerized information about customers to tailor recommendations. | 83% | ADOPT the served O*NET 31.0 wording verbatim (provenance follows the pin) |
| D14 | office | Operating bookkeeping and calculating machines (PSOC) | Operate data entry device, such as keyboard or photo composing perforator. | Read source documents such as canceled checks, sales reports, or bills, and enter data in specific data fields or onto tapes or disks for subsequent entry, using keyboards or scanners. | 45% | KEEP our printed span (row source is PSOC — outside the O*NET pin) |

Reply pattern: `D3: adopt · D7: keep ours` — or `defaults + exceptions`.

## 3 · Track titles — DIFFERS by blessed design
**2 MATCH / 19 DIFFERS.** The DIFFERS set is the display-label layer (display-pairing ruling: the catalog prints the PH-familiar label; O*NET's formal title stays the citation anchor). Default: **NO ACTION**.

| # | track | catalog display | O*NET 31.0 formal |
|---|---|---|---|
| 1 | it | Software QA Analyst | Software Quality Assurance Analysts and Testers |
| 2 | it | SOC Analyst | Information Security Analysts |
| 3 | business | Operations Analyst | Management Analysts |
| 4 | business | Purchasing Officer | Purchasing Agents, Except Wholesale, Retail, and Farm Products |
| 5 | business | Events / Conference Coordinator | Meeting, Convention, and Event Planners |
| 6 | accounting | Bookkeeper | Bookkeeping, Accounting, and Auditing Clerks |
| 7 | accounting | Accounting Clerk | Bookkeeping, Accounting, and Auditing Clerks |
| 8 | accounting | Payroll Assistant | Payroll and Timekeeping Clerks |
| 9 | accounting | Finance & Accounting Associate | Bookkeeping, Accounting, and Auditing Clerks |
| 10 | accounting | Financial Analyst | Financial and Investment Analysts |
| 11 | accounting | Treasury Assistant | Tellers |
| 12 | accounting | Bill & Account Collector | Bill and Account Collectors |
| 13 | accounting | Credit Analyst | Loan Officers |
| 14 | accounting | Bank Teller | Tellers |
| 15 | accounting | Audit Associate | Accountants and Auditors |
| 16 | office | Administrative Associate | Secretaries and Administrative Assistants, Except Legal, Medical, and Executive |
| 17 | office | Data Encoder | Data Entry Keyers |
| 18 | office | Executive Secretary | Executive Secretaries and Executive Administrative Assistants |
| 19 | office | Records Clerk | Receptionists and Information Clerks |

## 4 · audit Row-11 tech-names row — the headline bless
The awaited pin is resolved as evidence: **O*NET 31.0 serves 37 technology categories for 13-2011.00 (Accountants and Auditors)** with served example tools per category — full verbatim served table recorded in diff-log.md §30. Shape options:

- **4A** — Row-11 carries the served categories + served example tools, cited `O*NET 31.0 · Technology Skills · 13-2011.00` (the API's Software-Skills source row there: Employer Job Postings, 2026).
- **4B** — curated subset (you pick categories) for a lighter row.
- **4C** — defer Row-11 to post-defense.

## 5 · The other 20 PRESENT-ONLY-IN-ONET tech blocks
Every anchor-bearing track's served category list is recorded in its diff-log section (qa 68 · webdev 52 · soc 59 · opsanalyst 59 · purch 20 · events 21 · book 28 · acctclerk 28 · fas 28 · pay 15 · fin 27 · treasury 10 · coll 18 · credit 18 · teller 10 · audit 37 · adminassoc 48 · clerk 24 · encode 13 · execsec 32 · records 18). Default: **audit Row-11 only now (§4); the other 20 post-defense** unless you bless a subset today.

## 6 · After your rulings
Stage B = a code agent applies ONLY blessed deltas, then regenerates + gates (tsc / build / verify:fixtures / e2e), then ONE commit. Un-blessed things stay printed as-is; nothing moves silently.
