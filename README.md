# Pobratym / Побратим

[![Live demo](https://img.shields.io/badge/demo-GitHub%20Pages-c8ef63)](https://broadway21-sudo.github.io/pobratym/)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

**A privacy-first mental health support prototype for Ukrainian service members, veterans, and their families.**

Pobratym is an open-source web prototype designed to provide a calm first point of contact when someone needs to talk, ground themselves during anxiety, or find verified human support.

> Pobratym is not a therapist, medical device, emergency service, or replacement for professional care.

## Why this project exists

Russia's war against Ukraine has created a long-term need for accessible, stigma-aware psychological support. Many people need a low-friction place to speak before they are ready or able to contact a specialist.

The project focuses on:

- supportive conversation without judgment;
- clear crisis escalation to human help;
- minimal collection of personal data;
- Ukrainian-first language and context;
- accessibility on low-cost mobile devices;
- transparent, auditable open-source development.

## Current prototype

- Ukrainian mobile-first interface;
- local demo conversation flows for anxiety, insomnia, grief, anger, and guilt;
- Ukrainian and Russian crisis phrase detection;
- one-tap access to `112`, `103`, and the Ukrainian Veterans Fund crisis line;
- directory of verified support resources;
- no accounts, analytics, or server-side conversation storage.

## Live demo

Try the current static prototype at:

**https://broadway21-sudo.github.io/pobratym/**

## Run locally

Open `index.html` directly, or start any static server:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project status

This repository currently contains a UX and safety-routing prototype. The conversational responses in `app.js` are deterministic local scenarios, not a production AI system.

See:

- [Roadmap](ROADMAP.md)
- [Safety policy](SAFETY.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Contributing guide](CONTRIBUTING.md)

## Before real-world deployment

A public service would require:

- clinical and legal review in Ukraine;
- a secure backend with strict data minimization;
- professionally reviewed crisis detection and response;
- continuously verified regional support contacts;
- human escalation procedures;
- abuse prevention and quality monitoring;
- testing with service members, veterans, families, and crisis psychologists.

## Contributing

Contributions from engineers, designers, accessibility specialists, Ukrainian translators, veterans, and qualified mental health professionals are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

For safety-sensitive problems, do not publish personal crisis details in a GitHub issue. Follow [SAFETY.md](SAFETY.md).

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE).
