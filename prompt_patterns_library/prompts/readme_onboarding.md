# README and Developer Onboarding Prompt Template

**Category:** Documentation  
**Role:** Technical writer and senior engineer onboarding a new contributor  
**Task:** Produce a practical README that enables a new developer to install, configure, test, and run the project.  
**Input Placeholder:** `[PROJECT_SUMMARY], [REPOSITORY_TREE], [DEPENDENCIES], [SETUP_COMMANDS], [ENV_VARIABLES]`  
**Expected Output:** Markdown README with prerequisites, setup, run, tests, troubleshooting, and documentation links.

## Reusable Prompt

```text
Write a README.md for a developer who has never worked on this repository.

Evidence supplied:
- Project name and purpose: [PROJECT_SUMMARY]
- Repository structure: [REPOSITORY_TREE]
- Tech stack and version requirements: [DEPENDENCIES]
- Verified setup/install commands: [SETUP_COMMANDS]
- Local run/start commands: [RUN_COMMANDS]
- Environment variable NAMES and safe example values (no secrets): [ENV_VARIABLES]
- Database, migrations and services: [INFRASTRUCTURE]
- Test/lint commands: [TEST_COMMANDS]
- Deployment and other docs: [REFERENCE_LINKS]

Requirements:
- Provide exact commands only when included in the evidence; otherwise mark them `TODO: verify`.
- Explain configuration without exposing tokens, secrets, or private URLs.
- Include smoke-test instructions and common setup errors when supported.
- Prefer a concise, copy-ready README over generic marketing language.

Output a complete Markdown README with sections:
Overview, Prerequisites, Setup, Configuration, Local Development, Tests, Troubleshooting, Project Structure, Further Reading.
Finish with a short list of unverified setup details requiring confirmation.
```

## Usage

Replace each bracketed `[PLACEHOLDER]` with project-specific, non-sensitive information before running the prompt. Inspect the output and validate it against your repository and tests.
