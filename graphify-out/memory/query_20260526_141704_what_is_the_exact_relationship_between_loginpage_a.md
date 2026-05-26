---
type: "query"
date: "2026-05-26T14:17:04.540689+00:00"
question: "What is the exact relationship between LoginPage and Playwright accessibility tree of login page?"
contributor: "graphify"
source_nodes: ["LoginPage", "Playwright accessibility tree of login page", "LoginCard"]
---

# Q: What is the exact relationship between LoginPage and Playwright accessibility tree of login page?

## Answer

LoginPage (Frontend/app/login/page.tsx) and the Playwright accessibility tree snapshot (.playwright-mcp/page-2026-05-24T12-52-47-424Z.yml) are linked by a single direct semantically_similar_to edge (AMBIGUOUS, 0.25). They also connect indirectly via LoginCard: LoginPage renders LoginCard; LoginCard is conceptually_related_to the snapshot (AMBIGUOUS, 0.15). Both nodes sit in community Login UX and Docs. The snapshot is a point-in-time MCP capture of the rendered login UI; it mirrors the same page structure (logo, form, hero copy) but copy differs from current source (snapshot shows Welcome back and Secure access vs LoginCard Welcome.).

## Source Nodes

- LoginPage
- Playwright accessibility tree of login page
- LoginCard