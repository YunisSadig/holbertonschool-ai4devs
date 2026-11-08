User Stories — Pathway AI
Product: Pathway AI — a transparent, privacy-aware discovery and planning platform for international master's applicants.

Priority tags: MVP = essential for the first release; High = important next iteration; Medium = useful enhancement; Low = optional enhancement.
Discovery and Personalization
User Story 1 — Browse Master's Programmes
As a prospective international master's student, I want to browse available master's programmes so that I can discover study options without searching university websites one by one.

Acceptance Criteria:
- The catalogue displays each programme's university, title, country, and teaching language when available.
- Selecting a programme opens a detail view with its published information.
- When no programmes are available, the interface displays a clear empty-state message instead of a blank page.
Priority: MVP
User Story 2 — Apply Constraint-Based Filters
As a budget-conscious applicant, I want to filter programmes by field, country, annual tuition ceiling, duration, and teaching language so that I can focus on options meeting my requirements.

Acceptance Criteria:
- Users can set and modify all five filter criteria, and results update to reflect the active selections.
- A programme with a confirmed value that violates an active requirement is excluded from matching results.
- A programme whose required field is unknown is not presented as a confirmed match; the interface labels its information as needing verification.
Priority: MVP
User Story 3 — Maintain an Applicant Profile
As a prospective master's applicant, I want to enter and edit my academic background and preferences so that programme requirements can be compared with my circumstances.

Acceptance Criteria:
- The profile form accepts study field, qualification details, language qualifications, and relevant preferences without requiring unrelated personal information.
- Users can update their information, and subsequent comparisons use the updated values.
- Missing profile information is marked as unknown rather than being treated as satisfying an admission requirement.
Priority: MVP
Evidence and Programme Evaluation
User Story 4 — Verify Information Against Official Sources
As a careful applicant, I want to see an official university source and a last-checked date for programme facts so that I can verify information before making decisions.

Acceptance Criteria:
- Each programme detail page provides source links for published tuition, duration, language, and admission requirements where available.
- Information displays its last-verified date or a visible "Not verified" status when no verification date exists.
- Missing or outdated source information is explicitly flagged instead of being presented as current verified fact.
Priority: MVP
User Story 5 — Assess Published Entry Requirements
As a student with an uncertain academic profile, I want to compare published entry requirements with my profile so that I can identify requirements I meet and questions I must verify.

Acceptance Criteria:
- Each evaluated requirement is labelled Matches, Does not match, or Needs verification.
- The interface explains the evidence or missing information behind each label.
- The system does not claim to guarantee admission or calculate unsupported acceptance probabilities.
Priority: MVP
User Story 6 — Compare Programmes Side by Side
As a prospective international student, I want to compare selected programmes in one view so that I can assess their trade-offs efficiently.

Acceptance Criteria:
- Users can select at least two programmes for comparison.
- The comparison displays the same fields for each programme: tuition, duration, teaching language, country, and published requirements.
- Unknown values are displayed as "Not available" or "Needs verification" rather than guessed.
Priority: MVP
User Story 7 — Read Source-Backed AI Explanations
As a student unfamiliar with admissions terminology, I want plain-language explanations of published requirements so that I can understand them without losing the underlying evidence.

Acceptance Criteria:
- The system generates a concise explanation from available programme-source material.
- The explanation links to the official sources supporting its factual claims.
- If source material is insufficient, the system states that the requirement cannot be verified instead of inventing an answer.
Priority: MVP
User Story 8 — Understand Why a Programme Is Recommended
As a budget-conscious student, I want to know why a programme appears in my results so that I can trust and review the matching logic.

Acceptance Criteria:
- Each recommended programme shows the profile preferences or filters responsible for the match.
- The explanation distinguishes confirmed matching conditions from unknown or unverified information.
- Users can change a relevant preference and see the matching explanation update accordingly.
Priority: High
Application Planning and Privacy
User Story 9 — Save a Programme Shortlist
As a student researching several universities, I want to save and remove programmes from a shortlist so that I can revisit my preferred options later.

Acceptance Criteria:
- Users can add or remove a programme from their shortlist from its catalogue or detail page.
- The shortlist shows the saved programmes without duplicate entries.
- Saved selections remain available when the user returns to their saved workspace.
Priority: MVP
User Story 10 — Track Application Deadlines
As a student preparing applications, I want to record deadlines and application progress so that I can plan each university application.

Acceptance Criteria:
- Users can add or edit an application deadline for a shortlisted programme.
- Each application can be assigned a status such as Researching, Preparing, Submitted, or Completed.
- Deadlines entered by the user are clearly distinguished from dates verified against official university sources.
Priority: High
User Story 11 — Manage Required Document Checklists
As a master's applicant, I want a document checklist for each application so that I can track what I still need to prepare.

Acceptance Criteria:
- Users can add, rename, complete, and remove document checklist items for an application.
- Checklist status is maintained separately for each shortlisted programme.
- The interface distinguishes user-added items from documents explicitly required by an official source.
Priority: Medium
User Story 12 — Control and Delete Saved Profile Data
As a privacy-conscious applicant, I want to control my stored profile and shortlist information so that I can limit unnecessary retention of personal data.

Acceptance Criteria:
- Users can view the profile fields and saved application information stored in their account.
- Users can delete their saved profile and shortlist data through an explicit, confirmed action.
- After deletion is confirmed and processed, the removed information is no longer displayed in the user's workspace.
Priority: High
Scope Notes
- MVP focuses on verified programme discovery, filtering, profile-based requirement comparison, side-by-side comparisons, source-backed explanations, and shortlists.
- High/Medium stories describe enhancements planned beyond the initial release unless reprioritized.
- Pathway AI does not automate university applications, guarantee admissions, or generate unverified admission probabilities.
- All programme names, fees, deadlines, and eligibility requirements shown in the product must be drawn from real, attributable source data rather than invented examples presented as facts.
