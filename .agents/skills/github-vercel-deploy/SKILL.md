---
name: github-vercel-deploy
description: "Trigger: subir a GitHub, push, deploy, auto-deploy, Vercel, producción, rama default, GitHub API. Push al repo y verifica el auto-deploy de Vercel sin re-descubrir tokens ni endpoints (documentados en Engram)."
license: Apache-2.0
metadata:
  author: "eduardomendozavillar"
  version: "1.0"
---

# GitHub + Vercel Deploy

## Activation Contract

Load when the user asks to push work to GitHub, deploy, check the production site, or manage repo branches/Vercel integration for this project. Also load when a session needs to verify the repo state before continuing.

## Hard Rules

- The GitHub→Vercel integration is COMPLETE: `productionBranch=master`, auto-deploy on push works. Do NOT re-link, re-configure, or re-discover it.
- Tokens and the hidden Vercel endpoint are in Engram (see References). Never hardcode them here; retrieve via `mem_search` when needed.
- Default branch is `master` (the old orphan `main` was deleted). Never create branches named `main`.
- The fine-grained GitHub PAT CANNOT change the default branch (403 "Resource not accessible" — needs `Administration: write`). Do NOT retry that PATCH; only repo owner can do it in Settings.
- Push needs no manual token: GCM has cached credentials. PowerShell reports git stderr as an "error" — `a558822..<hash> master -> master` is SUCCESS, not failure.
- Never commit secrets; keep conventional commits; no AI attribution lines.

## Decision Gates

| Situation | Action |
|-----------|--------|
| Local ahead of origin/master | Commit in work units, push, expect auto-deploy |
| Working tree dirty but unrelated | Do not commit unrelated files |
| User asks about production | GET production URL + `GET /v6/deployments` (see References) |
| Need to delete a branch | Allowed for any branch EXCEPT the current default |

## Execution Steps

1. Check repo state: `git status`, `git log --oneline -5`, `git rev-parse HEAD origin/master`.
2. If work is complete and valid (tests/lint/build green), stage only intended files and commit with a conventional message.
3. Push: `git push origin master`. Treat `master -> master` output lines as success.
4. Wait ~15s, then check the newest deployment via Vercel API (token + project/team IDs from Engram) until `readyState=READY`.
5. Verify production: GET the live URL (200) and confirm expected content markers.
6. Save non-obvious outcomes to Engram (`mem_save`) before replying.

## Output Contract

Return: repo state (ahead/behind), commit hash pushed, newest deployment state, production HTTP status, and any Engram observation IDs saved. If a deploy fails, report the deployment error URL — never fabricate READY.

## References

- Engram topic keys (mem_search, project `portafolio`): `deploy/integracion-vercel-git-completada` (#38), `deploy/repo-github-limpio-master-unica-rama` (#45), `deploy/followups-v2-cerrados-pusheado` (#44), `deploy/integracion-vercel-git-completada` (#33).
- `C:\Users\eduar\.config\opencode\skills\work-unit-commits\SKILL.md` — commit splitting guidance.
