# User Stories - Pathway AI

Format: **As a** user, **I want** a goal, **so that** a benefit. Priorities: **Must** = MVP, **Should** = MVP if time allows.

## Student profile

## User Story 1 (Must)
As a student, I want to create an account and a profile with my degree, field, GPA, language scores, budget, and preferred countries, so that the platform can tailor results to me.

**Acceptance criteria**
- Required fields are validated (GPA must match the chosen grading scale).
- The profile is saved and visible after logging back in.

## User Story 2 (Must)
As a student, I want to edit or delete my profile and data, so that I stay in control of my personal information.

**Acceptance criteria**
- Edits are saved and reflected in results immediately.
- Deleting the account removes the profile, shortlist, and saved explanations.

## Discovery and filtering

## User Story 3 (Must)
As a student, I want to browse and search master's programmes by keyword, so that I can discover options I did not know about.

**Acceptance criteria**
- The list shows programme name, university, country, degree, and tuition.
- Search matches programme and university names.

## User Story 4 (Must)
As a student, I want to open a programme detail page, so that I can read its requirements, deadlines, tuition, and official source link.

**Acceptance criteria**
- The page shows a source URL and a "last verified" date.
- Missing values are shown as "not available", never guessed.

## User Story 5 (Must)
As a student on a limited budget, I want to filter programmes by maximum tuition, so that I only see programmes I can afford.

**Acceptance criteria**
- The tuition filter applies to the correct fee (EU or non-EU) based on my profile.
- Programmes with unknown tuition are clearly marked.

## User Story 6 (Must)
As a student, I want to filter by country, degree type, and language of instruction, so that I can narrow results to my preferences.

**Acceptance criteria**
- Filters can be combined and cleared.
- The result count updates on each change.

## User Story 7 (Must)
As a student, I want to see whether I meet a programme's stated requirements, so that I can avoid applying where I am not eligible.

**Acceptance criteria**
- Each programme shows "meets", "may not meet", or "unknown" for GPA and language requirements.
- The result never promises admission and includes a notice that the university decides.

## Comparison and shortlist

## User Story 8 (Must)
As a student, I want to save programmes to a shortlist, so that I can return to them later.

**Acceptance criteria**
- I can add and remove programmes from any list or detail page.
- The shortlist persists across sessions.

## User Story 9 (Must)
As a student, I want to compare up to three shortlisted programmes side by side, so that I can see differences in tuition, requirements, and deadlines.

**Acceptance criteria**
- The comparison table highlights the differences between programmes.
- A fourth programme cannot be added; the UI explains the limit.

## AI explanation

## User Story 10 (Must)
As a student, I want an AI explanation of how well a programme suits my profile, so that I understand strengths and gaps in plain language.

**Acceptance criteria**
- The explanation uses only the programme data and my profile.
- It lists unknown information and never states admission odds or guarantees.

## User Story 11 (Should)
As a student, I want to see which facts the AI explanation is based on, so that I can trust and verify it.

**Acceptance criteria**
- The explanation references the programme fields it used, with a link to the official source.

## Reliability

## User Story 12 (Should)
As a student, I want a clear message when the AI service is unavailable, so that I can still use filters and comparison.

**Acceptance criteria**
- An AI failure shows a friendly error and does not break the page.
- The rest of the application keeps working.
