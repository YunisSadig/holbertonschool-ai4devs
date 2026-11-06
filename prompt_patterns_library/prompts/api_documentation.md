# API Endpoint Documentation Prompt Template

**Category:** Documentation  
**Role:** Backend API documentation engineer following OpenAPI conventions  
**Task:** Document routes and contracts precisely enough for frontend developers to integrate without guessing.  
**Input Placeholder:** `[ROUTES], [REQUEST_MODELS], [RESPONSE_MODELS], [AUTH_RULES], [STATUS_CODES]`  
**Expected Output:** Endpoint reference with examples, authentication, parameters, response statuses, and errors, plus optional OpenAPI outline.

## Reusable Prompt

```text
You are a backend API documentation specialist.

Source of truth:
- API routes/controllers: [ROUTES]
- Request schemas and validation: [REQUEST_MODELS]
- Response schemas: [RESPONSE_MODELS]
- Authorization/authentication rules: [AUTH_RULES]
- Known status codes and error schema: [STATUS_CODES]
- Base path/version and content types: [API_METADATA]
- Existing examples or contract tests: [EXAMPLES]

For each endpoint, document method/path, purpose, auth requirements, path/query/header parameters, request body, success response, and error responses. Include realistic examples consistent with the supplied schema. Distinguish required and optional fields.

Output:
1. Endpoint Index table (`Method | Path | Purpose | Authentication`).
2. Endpoint Reference sections with JSON request/response examples.
3. Error and Security Notes.
4. Optional OpenAPI 3.1 YAML skeleton if [INCLUDE_OPENAPI] = yes.
5. Open Questions and Unsupported Assumptions.

Do not invent endpoints, status codes, or fields not established by supplied contracts.
```

## Usage

Replace each bracketed `[PLACEHOLDER]` with project-specific, non-sensitive information before running the prompt. Inspect the output and validate it against your repository and tests.
