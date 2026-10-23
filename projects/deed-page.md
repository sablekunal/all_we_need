---
title: "deed.page"
link: "https://deed.page"
description: "Static hosting for AI agents and scripts: one HTTP PUT or an MCP call publishes HTML to a permanent https://<slug>.deed.page URL. Free plan, no signup."
tags: ["hosting", "static-sites", "deployment", "ai", "free"]
date: "2026-10-24"
---

deed.page hosts static sites for coding agents and scripts. One HTTP PUT (or POST) with an HTML file, or a folder via a manifest upload, returns a live HTTPS URL at a slug the caller picks. The URL does not expire.

## Features

- Publish with a single `curl -T index.html` request; no account, email code or claim link
- Remote MCP server (`https://deed.page/mcp`, Streamable HTTP) with tools such as `publish_site`, `update_site`, `list_versions` and `restore_version`; listed in the official MCP Registry as `page.deed/deed-page`
- The first publish returns a bearer token for that site, used to update, roll back or delete it later
- Version history with restore, custom domains, per-site analytics and webhooks
- Open-source (MIT) agent skill for Claude Code, Codex, Cursor and other agents: https://github.com/f-o-x11/deed-page-skill

## Free tier

25 sites, 25 MB per site, 4 MB per request, 10 retained versions and 1 custom domain, with no signup. Paid plans add more. Docs: https://deed.page/docs
