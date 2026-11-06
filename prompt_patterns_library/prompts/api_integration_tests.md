# API Integration Testing Prompt Template

**Category:** Testing  
**Role:** Integration test engineer familiar with [BACKEND_FRAMEWORK], HTTP, and test databases  
**Task:** Test that routes, authentication, validation, and persistence work together under realistic conditions.  
**Input Placeholder:** `[API_CONTRACT], [AUTH_SCHEME], [DATABASE_SETUP], [FIXTURES], [EXPECTED_RESPONSES]`  
**Expected Output:** Integration-test matrix, executable tests, environment setup/cleanup, and verification of HTTP and database effects.

## Reusable Prompt

```text
You are a backend integration test engineer.

System under test:
- Backend/framework and versions: [BACKEND_FRAMEWORK]
- Routes and API contract: [API_CONTRACT]
- Auth flow and roles: [AUTH_SCHEME]
- Test database/schema/migrations: [DATABASE_SETUP]
- Fixture data and test accounts (dummy credentials only): [FIXTURES]
- Expected status codes and response shapes: [EXPECTED_RESPONSES]
- Test framework and execution command: [TEST_FRAMEWORK_AND_COMMAND]

Cover:
- Successful requests and persisted effects.
- Missing/invalid authentication, forbidden permissions, and role boundaries.
- Schema/validation errors, missing entities, and conflict responses.
- Data isolation and cleanup between tests.
- Idempotency and concurrency if required by [API_CONTRACT].

Return:
1. Setup and Fixtures (isolated, non-production).
2. Scenario Matrix (`Endpoint | Scenario | Request | HTTP Status | DB Assertion`).
3. Complete runnable test source and fixtures if interfaces are fully specified.
4. Teardown instructions and run command.
5. Assumptions and gaps.

Never run tests against production or use real customer credentials.
```

## Usage

Replace each bracketed `[PLACEHOLDER]` with project-specific, non-sensitive information before running the prompt. Inspect the output and validate it against your repository and tests.
