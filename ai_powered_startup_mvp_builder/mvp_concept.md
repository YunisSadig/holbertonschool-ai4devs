# MVP Concept - Pathway AI

**Pathway AI** helps students find suitable European master's programmes based on their academic profile, preferences, and financial constraints.

## Problem Statement

International students who want a master's degree in Europe face a fragmented, time-consuming research process:

- **Scattered information.** Programme details live on hundreds of separate university websites, each with its own structure, terminology, and language. There is no single place to compare programmes side by side.
- **Hard-to-compare admission requirements.** Requirements for GPA, prerequisite credits, language tests (IELTS/TOEFL), and required documents differ per programme and are often buried in PDFs or ambiguous wording ("strong background in a related field").
- **Unclear affordability.** Tuition differs sharply between countries, and between EU and non-EU applicants. Living costs, application fees, and funding options are rarely shown next to the programme, so students find out late that a programme is out of reach.
- **Uncertain eligibility.** Students cannot easily tell whether their degree, grades, and language level match a programme before spending time and money on an application.
- **Information overload.** Spreadsheets, bookmarks, and forum threads become unmanageable, and students often default to a few well-known universities and miss programmes that fit them better.

The result is wasted effort, missed deadlines, and applications to programmes that were never realistic.

## Target Users

1. **International students seeking master's degrees in Europe.** Students outside the EU/EEA who must compare tuition rules, language requirements, and country-specific conditions.
2. **Recent graduates comparing postgraduate opportunities.** Bachelor's graduates who are choosing between countries and specialisations and want a structured way to narrow options.
3. **Students with limited budgets or specific academic requirements.** Applicants who need low or no tuition, or who must match specific constraints such as a particular field, language of instruction, or minimum grade threshold.

## Core Features

The MVP contains five features. Each is deliberately small.

1. **Student profile creation.** The student enters their degree, field of study, GPA (with the grading scale), language test scores, budget range, and preferred countries. The profile is stored so it can drive filtering and explanations.
2. **University and programme discovery.** A browsable, searchable list of programmes from a limited curated dataset, with a detail page showing degree, field, country, tuition, language, duration, deadline, and a link to the official source.
3. **Filtering by country, tuition, degree, and eligibility requirements.** Filters for country, maximum tuition, degree type, and language of instruction, plus an eligibility filter that compares the student's profile with each programme's stated minimum requirements and shows "meets", "may not meet", or "unknown".
4. **Programme comparison and shortlisting.** Students can save programmes to a shortlist and compare up to three side by side on tuition, requirements, deadlines, and duration.
5. **AI-assisted explanation of programme suitability.** For a chosen programme, an LLM explains in plain language how the student's profile matches or falls short of the stated requirements. The explanation is grounded only in the programme data and the student's profile, and it states what is unknown.

### In the MVP vs. postponed

| In the MVP | Postponed (post-MVP) |
|---|---|
| Profile, discovery, filters, comparison, shortlist, AI explanation | Application tracking and deadline reminders |
| Small curated dataset with source links | Automated scraping or large-scale data ingestion |
| Email/password or simple auth | Social login and social features |
| Web app (responsive) | Native mobile apps |
| English UI | Multi-language UI |
| Estimated cost fields | Scholarship matching and visa guidance |
| | Document review (SOP/CV feedback) |
| | Any payment, subscriptions, or agent/consultant marketplace |

## Constraints

- **Limited initial dataset.** The MVP launches with a small, manually curated set of programmes (on the order of tens, not thousands) in a few countries. Every record must carry a source URL and a "last verified" date. Coverage will be stated honestly in the product.
- **Realistic development scope.** The MVP is built as a short lean sprint by a small team using AI-assisted development. Only the five features above are in scope; anything else goes to the backlog.
- **No payment functionality.** No billing, subscriptions, or application-fee handling. The MVP is free to use.
- **Limited external integrations.** Only one LLM provider API (called from the server) and the hosting platform. No integrations with university application portals, payment providers, or third-party data feeds.
- **Privacy and security requirements.**
  - Collect only the data needed for matching; no government IDs, passports, or documents.
  - Store profile data securely, hash passwords, and use HTTPS everywhere.
  - Keep API keys server-side and out of the repository.
  - Do not send personally identifying details to the LLM; send only the relevant academic fields.
  - Let users edit and delete their profile and data.
- **Free-tier deployment where feasible.** Host the frontend and backend on free tiers (for example Vercel and Render) with a free-tier PostgreSQL database, accepting cold starts and limited capacity.
- **No fabricated or unverified admission guarantees.** Pathway AI never promises admission or predicts acceptance probability. Eligibility results compare only against published requirements, say "unknown" when data is missing, and carry a notice that the final decision belongs to the university. The AI explanation must not invent requirements, costs, or deadlines.
