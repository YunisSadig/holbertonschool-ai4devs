# Setup Notes — Copilot Productivity Sprint (Task 0)

## 1. Purpose
The productivity sprint compares doing small coding tasks manually against doing them with an AI coding assistant. This file documents the IDE, tools and assistant prepared for that experiment, and how to switch AI assistance on and off between runs.

## 2. Operating system and IDE
| Item | Observed |
|---|---|
| OS | Microsoft Windows 11 Pro, version 10.0.26300 |
| IDE | Visual Studio Code 1.145.2 (x64) |
| Second editor (installed, not used for the sprint) | Cursor 2.2.43 |

## 3. Verified versions
Collected with the commands in section 5 on 2026-11-09.

| Tool | Version |
|---|---|
| VS Code | 1.145.2 |
| Claude Code (CLI) | 2.1.319 |
| Claude Code VS Code extension (`anthropic.claude-code`) | 2.1.319 |
| Git | 2.51.1.windows.1 |
| Node.js | v24.18.0 |
| npm | 11.16.0 |

VS Code extensions installed by the user (`code --list-extensions --show-versions`):
`anthropic.claude-code@2.1.319`, `ms-azuretools.vscode-containers@2.5.3`, `ms-vscode-remote.remote-containers@0.469.0`, `ritwickdey.liveserver@5.7.10`, `sidthesloth.html5-boilerplate@1.1.1`.

GitHub Copilot: VS Code includes a built-in Copilot Chat extension (`copilot-chat` 0.73.0, found in the VS Code install folder). I did **not** verify that Copilot is signed in or usable, so it is **not** the assistant used for this sprint.

## 4. AI assistant used and configuration
**Claude Code** (Anthropic's coding assistant), used as the "other coding assistant" the task allows. It is available both as the `claude` command in the terminal and as the VS Code extension `anthropic.claude-code`. It was already installed and authenticated on this machine; no API key is stored in this repository or in these notes.

## 5. Setup steps and verification commands
1. Install VS Code (https://code.visualstudio.com/). Check: `code --version`
2. Install Claude Code and the VS Code extension. Check: `claude --version` and `code --list-extensions --show-versions`
3. Install Git and Node.js. Check: `git --version`, `node -v`, `npm -v`
4. Sign in to Claude Code once (`claude`, then follow the prompts). Credentials stay on the machine and are never committed.
5. Optional: sign in to GitHub Copilot Free from the VS Code status bar if Copilot should also be compared.

## 6. How the assistant was tested
A small, harmless test in a temporary folder outside the repository:
- Claude Code wrote `slugify.js` (a function turning `"  Hello, World!  "` into `"hello-world"`) and `slugify.test.js` with two tests.
- Ran `node --test slugify.test.js`. Result: **2 tests, 2 passed, 0 failed**.

This shows Claude Code can read the task, write code and run it in this environment. It does not measure productivity.

## 7. Enabling and disabling AI assistance
For the manual-versus-AI experiment:
- **Manual run (AI off):** do not start `claude`; close the Claude Code panel in VS Code; to be strict, run `code --disable-extension anthropic.claude-code` (or Disable in the Extensions view). If Copilot is signed in, also disable it in the Extensions view.
- **AI run (AI on):** re-enable the extension in the Extensions view (or restart VS Code without the flag), then open Claude Code from the editor or run `claude` in the project folder.
- Use the same task description, a fresh copy of the starter files, and a timer for both runs.

## 8. Issues and solutions
- Copilot sign-in could not be verified from the terminal, so Copilot was not used. Solution: use Claude Code, which the assignment allows, and state this plainly.
- Windows PowerShell may block `npm`; use `npm.cmd` if needed.

## 9. Conclusion
Operational and verified: VS Code 1.145.2, Claude Code CLI and extension 2.1.319, Git 2.51.1, Node.js v24.18.0 and npm 11.16.0, and a passing assistant test (2/2). Not verified: GitHub Copilot sign-in and usage.
