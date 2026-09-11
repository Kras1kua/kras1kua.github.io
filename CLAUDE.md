# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A beginner's learning project (Russian-language). There is no build system, package manager, or test suite — it's plain static HTML plus one standalone Node.js script. Do not suggest adding a bundler/framework/tests unless the user asks.

## Running things

- **View the site**: open [index.html](index.html) directly in a browser (double-click, or a `file://` path). The lead form needs `server.js` running to actually submit (`node server.js`); opened via `file://` it will just fail to send.
- **Run the OpenRouter script**: `node ask-openrouter.js` (requires Node with global `fetch`, available in Node 18+; the dev machine runs Node 24).

## Architecture

- [index.html](index.html) — the main page: a dark, single-page landing ("Anton Saprykin — коммерческий директор") with a lead-capture form that POSTs to `/api/lead` (see `server.js`). Formerly at `landing.html`; that path was swapped to become the home page.
- [about-me.html](about-me.html) — the original simple "about me" card (placeholder avatar, short bio, `mailto:` button). Formerly `index.html`, moved aside when the landing page became the home page.
- [about-me.txt](about-me.txt) — plain-text bio (three sentences), a content source independent of the HTML.
- [ask-openrouter.js](ask-openrouter.js) — a standalone Node script, unrelated to the HTML page. It reads `OPENROUTER_API_KEY` out of `.env` by regex (no `dotenv` dependency), POSTs a single chat message to the OpenRouter API (`minimax/minimax-m3:free` model), and prints both the extracted reply and the raw JSON response.

## Secrets

`.env` holds `OPENROUTER_API_KEY` and is listed in [.gitignore](.gitignore) — never remove that entry, and never print, commit, or otherwise expose the key's value.
