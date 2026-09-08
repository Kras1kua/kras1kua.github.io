# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A beginner's learning project (Russian-language). There is no build system, package manager, or test suite — it's plain static HTML plus one standalone Node.js script. Do not suggest adding a bundler/framework/tests unless the user asks.

## Running things

- **View the site**: open [index.html](index.html) directly in a browser (double-click, or a `file://` path). No server or build step needed.
- **Run the OpenRouter script**: `node ask-openrouter.js` (requires Node with global `fetch`, available in Node 18+; the dev machine runs Node 24).

## Architecture

- [index.html](index.html) — single self-contained page (inline `<style>`, no external assets/JS). A centered "card" showing a placeholder avatar, name, short bio, and a `mailto:` button. The CSS comments themselves document how to swap the placeholder `<div class="photo">` for a real `<img>`.
- [about-me.txt](about-me.txt) — plain-text bio (three sentences), a content source independent of the HTML.
- [ask-openrouter.js](ask-openrouter.js) — a standalone Node script, unrelated to the HTML page. It reads `OPENROUTER_API_KEY` out of `.env` by regex (no `dotenv` dependency), POSTs a single chat message to the OpenRouter API (`minimax/minimax-m3:free` model), and prints both the extracted reply and the raw JSON response.

## Secrets

`.env` holds `OPENROUTER_API_KEY` and is listed in [.gitignore](.gitignore) — never remove that entry, and never print, commit, or otherwise expose the key's value.
