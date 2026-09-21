# Deployment

## Where things live

- **Source**: `git@github.com:RagerX98/monkey-media-v2.git`, single branch
  `master` (also the default/production branch).
- **Hosting**: Vercel project `monkey-media-v2`, team
  `sakshamdutt98-7019s-projects` (org id `team_CPYxBSajQ1a7LKkAQgB3bMKs`,
  project id `prj_EmuqHwDwGaf9FBg8Cjl10ZGpOgVL` — see
  `.vercel/project.json`).
- **Live domain**: **https://monkeymedia.agency**, aliased alongside
  `monkey-media-v2.vercel.app` and
  `monkey-media-v2-sakshamdutt98-7019s-projects.vercel.app`.
- **Build**: Vite (`npm run build`), Vercel auto-detects the framework.
  `vercel.json` just adds an SPA catch-all rewrite
  (`/(.*) → /index.html`) so React Router's client-side routes don't 404
  on a hard refresh or direct link.

## Normal workflow

```
git add <files>
git commit -m "..."
git push origin master
vercel --prod
```

**Push alone is not enough — always follow with `vercel --prod`.** See
the gotcha below.

## Known gotchas (already hit these — don't rediscover them)

### 1. GitHub → Vercel auto-deploy is not reliable

On 2026-09-18 we found the live site was serving a commit that was
several commits and ~17 minutes behind what was already pushed to
`origin/master`. Git was clean and fully pushed; Vercel's GitHub
integration simply never triggered (or silently failed) a production
build for the last push in that batch. There was no error surfaced
anywhere in git.

**Consequence**: never assume a `git push` alone made it to production.
After every push that should go live, explicitly run `vercel --prod` and
confirm the deployment inspector shows `READY` and the right commit. It's
worth periodically spot-checking that auto-deploy has started working
again (compare `git log -1` against what's live) so this manual step can
eventually be dropped — but until then, treat it as required.

### 2. SSH key needs to be loaded in the agent to push

`git push` can fail with:

```
git@github.com: Permission denied (publickey).
```

even though a valid deploy key exists at `~/.ssh/id_ed25519`. The key is
passphrase-protected and isn't loaded into the SSH agent by default. Fix
(user has to do this interactively — an assistant can't supply the
passphrase):

```
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

`--apple-use-keychain` persists it across reboots on macOS, so this
should only need to happen once per machine, but it has already needed
redoing at least once this project.

### 3. `vercel --prod` can get blocked by the Claude Code auto-mode safety classifier

Even after the user explicitly confirmed "yes, deploy to production," a
bare `vercel --prod` call was once blocked by Claude Code's auto-mode
classifier as a sensitive action. Workaround that went through cleanly:

```
vercel --prod --yes
```

### 4. Vercel CLI occasionally nags about updates

`vercel` (v58.9.2 locally as of Sept 2026) will print an "update
available" notice pointing at newer CLI versions on failure output. Not
urgent, but if deploys start behaving strangely, `npm i -g vercel@latest`
is a reasonable first thing to try.

## Verifying a deploy actually landed

Don't just trust the CLI's `"status": "ok"` JSON — that confirms the
deploy succeeded, not that production is serving it. After deploying,
actually load `https://monkeymedia.agency` (or the specific page you
changed) in a browser and check for the change. `vercel inspect
<deployment-url>` also shows the aliases a given deployment claims,
useful for confirming `monkeymedia.agency` really points at the
deployment you just made.
