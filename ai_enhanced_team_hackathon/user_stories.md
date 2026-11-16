# User Stories – AI Meeting Notes Assistant

1. As a team member, I want to paste a meeting transcript so that I can get a summary without reading everything.
2. As a team member, I want to upload a .txt transcript file so that I don't have to copy-paste long text.
3. As a team lead, I want the AI to generate a short summary of the meeting so that absent colleagues can catch up in one minute.
4. As a team lead, I want the AI to extract action items with an owner and a due date so that nothing gets forgotten.
5. As a team member, I want to edit an extracted action item so that I can fix mistakes made by the AI.
6. As a team member, I want to mark an action item as done so that the team can track progress.
7. As a user, I want to export the summary and action items as Markdown so that I can paste them into Notion or Slack.
8. As a user, I want to see a list of my past meetings so that I can find earlier decisions.
9. As a user, I want to search my meetings by keyword so that I can quickly locate a specific topic.
10. As a user, I want to sign in with my email so that my meetings are private and saved to my account.
11. As a user, I want to see a loading state while the AI is processing so that I know the app is working.
12. As an admin, I want failed AI requests to be logged so that we can debug problems during the demo.

## Acceptance criteria (sample)
- Story 3: summary is ≤ 150 words and generated in under 10 seconds for a 5,000-word transcript.
- Story 4: every action item has `title`, `owner` (may be "Unassigned") and `due_date` (may be null).
- Story 7: exported Markdown opens correctly in GitHub and Notion.
