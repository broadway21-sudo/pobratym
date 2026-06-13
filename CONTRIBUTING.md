# Contributing to Pobratym

Thank you for helping build safer, more accessible support for Ukrainians affected by war.

## Ways to contribute

- improve accessibility and mobile performance;
- review Ukrainian language and trauma-aware wording;
- verify public support resources;
- write tests and documentation;
- report privacy or safety concerns;
- contribute product research with appropriate consent.

## Before opening an issue

Search existing issues first. Use a GitHub issue for public, non-sensitive project work only.

Never post:

- a real person's crisis conversation;
- names, phone numbers, unit details, locations, or medical records;
- operational or military information;
- credentials, access tokens, or private partner contacts.

Use fictional examples when describing conversation behavior.

## Development

The current prototype has no build step.

1. Clone the repository.
2. Start a static server with `python -m http.server 8000`.
3. Open `http://localhost:8000`.
4. Test desktop and narrow mobile layouts.

Before committing:

```powershell
node --check app.js
git diff --check
```

## Pull requests

Keep each pull request focused and explain:

- the user problem;
- the proposed behavior;
- safety and privacy implications;
- how the change was tested;
- any remaining uncertainty.

Changes to crisis detection, emergency contacts, or generated support language require review from a qualified domain specialist before production use.

## Content principles

Supportive copy should:

- avoid diagnosis and certainty about a person's condition;
- avoid guilt, pressure, or forced optimism;
- acknowledge distress without amplifying it;
- offer small choices instead of commands where possible;
- prioritize immediate human help when safety is uncertain.

## Commit style

Use short imperative commit messages that describe one meaningful change, for example:

- `Add keyboard focus styles`
- `Document crisis escalation flow`
- `Test mixed-language crisis phrases`

## Code of conduct

Be respectful, trauma-aware, and careful with personal stories. Harassment, dehumanizing language, victim blaming, or requests for sensitive military information are not acceptable.
