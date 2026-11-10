# Data Model - Pathway AI MVP

PostgreSQL. Six entities.

## Entity relationship diagram

```mermaid
erDiagram
    USER ||--|| STUDENT_PROFILE : has
    USER ||--o{ SHORTLIST_ENTRY : saves
    UNIVERSITY ||--o{ PROGRAMME : offers
    PROGRAMME ||--o{ SHORTLIST_ENTRY : "is saved in"
    STUDENT_PROFILE ||--o{ AI_EXPLANATION : receives
    PROGRAMME ||--o{ AI_EXPLANATION : "is explained in"

    USER {
        uuid id PK
        string email UK
        string password_hash
        timestamp created_at
    }
    STUDENT_PROFILE {
        uuid id PK
        uuid user_id FK
        string degree_level
        string field_of_study
        decimal gpa
        decimal gpa_scale
        string language_test
        decimal language_score
        int max_budget_eur
        string preferred_countries
        boolean is_eu_citizen
        timestamp updated_at
    }
    UNIVERSITY {
        uuid id PK
        string name
        string country
        string city
        string website_url
    }
    PROGRAMME {
        uuid id PK
        uuid university_id FK
        string name
        string degree_type
        string field
        string language_of_instruction
        int duration_months
        int tuition_eu_eur
        int tuition_non_eu_eur
        decimal min_gpa_percent
        string min_language_test
        decimal min_language_score
        date application_deadline
        string source_url
        date last_verified_at
    }
    SHORTLIST_ENTRY {
        uuid id PK
        uuid user_id FK
        uuid programme_id FK
        timestamp added_at
    }
    AI_EXPLANATION {
        uuid id PK
        uuid profile_id FK
        uuid programme_id FK
        text content
        string model
        timestamp created_at
    }
```

## Entities

### User
Account for authentication. Holds only an email and a password hash.

### StudentProfile
Academic profile and preferences used for filtering and explanations. One per user. Deleted with the user.

### University
Institution reference data: name, country, city, website.

### Programme
A master's programme offered by a university. Requirement and tuition fields are nullable; **null means "unknown"**, never zero. `source_url` and `last_verified_at` are required so users can verify facts.

### ShortlistEntry
Join between a user and a programme. Unique on `(user_id, programme_id)`.

### AIExplanation
A saved suitability explanation for a profile and programme pair, with the model name and timestamp, so it can be shown again without another LLM call.

## Relationships

- User 1 - 1 StudentProfile.
- University 1 - N Programme.
- User N - M Programme through ShortlistEntry.
- StudentProfile N - M Programme through AIExplanation.

## Constraints and indexes

- `User.email` unique; `ShortlistEntry(user_id, programme_id)` unique.
- Indexes on `Programme(degree_type, tuition_non_eu_eur)` and `University(country)` for filtering.
- Foreign keys use `ON DELETE CASCADE` for user-owned data so account deletion removes the profile, shortlist, and explanations.
- GPA values are normalised to a percentage for comparison against `min_gpa_percent`.
