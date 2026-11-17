Pathway AI — User Stories
Project: AI-Enhanced Team Hackathon
Status: Proposed MVP requirements; implementation and team approval must be verified separately.
Scope: A 24-hour hackathon demonstration of a student-focused university and programme discovery tool.
Product goal
Help prospective international students discover relevant university programmes, compare important facts, and save a shortlist. Programme facts must be presented with a source and verification date where available; the system must not imply that admission is guaranteed.
User stories and acceptance criteria
US-01 — Browse available programmes (Must have)
As a prospective student, I want to browse programmes without signing in, so that I can explore possible study options quickly.

Acceptance criteria
- A visitor can open a programme list without an account.
- Each list item shows at least the programme name, university, country, and known tuition amount or an explicit “Not available” label.
- Selecting a programme opens its details page.
- An empty dataset is handled with a helpful message rather than an error.
US-02 — Filter the catalogue (Must have)
As a prospective student, I want to filter programmes by country, tuition limit, and degree level, so that I can find relevant options.

Acceptance criteria
- Filters can be combined without contradictory results.
- Clearing filters restores the full catalogue.
- Unknown tuition is not silently treated as free or zero.
- The result count and empty state reflect the current filters.
US-03 — Inspect programme details (Must have)
As a prospective student, I want to view a programme's admission-related facts and source link, so that I can decide whether to investigate further.

Acceptance criteria
- A details page shows the programme name, institution, degree level, location, and all available tuition and language details.
- Missing fields are identified as unknown, not guessed.
- An external official source URL is shown when one has been verified.
- Information is presented as guidance, not a binding admissions decision.
US-04 — Compare programmes (Must have)
As a prospective student, I want to compare selected programmes side by side, so that I can understand their differences.

Acceptance criteria
- A user can add at least two programmes to a comparison view.
- The comparison includes country, degree, tuition, and language of instruction when known.
- Missing values are explicitly labeled.
- The user can remove a programme from the comparison.
US-05 — Create a student profile (Should have)
As a registered student, I want to record my degree interests, budget, and preferred countries, so that the interface can tailor my exploration.

Acceptance criteria
- The form validates required fields and prevents invalid negative budgets.
- An authenticated user can create and edit their own profile.
- A successful save is reflected after a page refresh.
- Another user's profile cannot be accessed through the API.
US-06 — Save a shortlist (Should have)
As a registered student, I want to save programmes to a shortlist, so that I can revisit them later.

Acceptance criteria
- An authenticated user can save and remove programmes.
- Duplicate saves do not create duplicate shortlist entries.
- Saved items survive a page refresh and a new session.
- Visitors are invited to sign in instead of losing their selection without explanation.
US-07 — Receive suitability guidance (Should have; optional AI enhancement)
As a student, I want an understandable explanation of how a programme matches my preferences, so that I can prioritize further research.

Acceptance criteria
- Guidance cites the relevant profile inputs and catalogue facts.
- The interface clearly distinguishes deterministic matching from real AI-generated explanations.
- If an AI provider is not configured, the interface uses a labeled rules-based explanation or disables the AI feature; it never presents scripted output as live AI.
- The system avoids guaranteeing admission or inventing requirements.
US-08 — Handle unavailable results (Must have)
As a prospective student, I want clear feedback when nothing matches my filters, so that I can adjust my search.

Acceptance criteria
- No-result searches display a friendly message and a clear-filters action.
- Loading and network errors are visibly distinguishable from empty results.
- Invalid links to programmes show a useful not-found state.
US-09 — Use the application on mobile (Must have)
As a student using a phone, I want an accessible responsive interface, so that I can browse and compare programmes on smaller screens.

Acceptance criteria
- Primary actions are usable at a narrow mobile viewport.
- The programme list, filters, and comparison layout do not require horizontal page scrolling.
- Forms have labels; buttons and links can be reached by keyboard.
- Visible focus indicators and readable contrast are retained.
US-10 — Inspect data provenance (Should have)
As a student, I want to see where programme facts came from and when they were checked, so that I can judge their reliability.

Acceptance criteria
- Records can expose a source URL and last-verified timestamp.
- Outdated or unverified information is not falsely presented as current.
- An unavailable external source is reported as such rather than silently replaced with an unrelated link.
Priority and demo sequence
Core 24-hour demo: US-01, US-02, US-03, US-04, US-08, US-09.
If time and existing code allow: US-05, US-06, US-10.
Stretch goal: US-07 with a real, verified AI integration; otherwise demonstrate honestly labeled rules-based guidance.

Suggested demonstration: Open the catalogue → filter by budget and country → inspect programme details and source → compare two programmes → optionally sign in and save a shortlist.
Definition of done
A story is done only after the implemented UI/API behavior has been tested. A written story, mockup, grader score, or placeholder data alone does not establish a working feature. Capture test results and any known limitations in the hackathon report.
