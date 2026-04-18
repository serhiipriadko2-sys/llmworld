# Welcome to Aegis Companion

## How We Use Claude

Based on serhiipriadko2-sys's usage over the last 30 days (2 sessions):

Work Type Breakdown:
  _TODO — session history not available for breakdown_

Top Skills & Commands:
  /update-config  █░░░░░░░░░░░░░░░░░░░   1x/month

Top MCP Servers:
  _(none configured)_

## Your Setup Checklist

### Codebases
- [ ] llmworld — github.com/serhiipriadko2-sys/llmworld
- [ ] iskra — github.com/serhiipriadko2-sys/iskra
- [ ] registry — github.com/serhiipriadko2-sys/registry

### MCP Servers to Activate
  _(none in use — nothing to set up here)_

### Skills to Know About
- `/update-config` — configures Claude Code settings.json (hooks, permissions, env vars). Use when you want to automate something or add tool permissions.
- `gemini-companion` _(project skill)_ — auto-activates when touching `geminiService.ts`. Encodes correct Gemini SDK patterns: chat history format, valid model names, API key setup.
- `aegis-game-logic` _(project skill)_ — auto-activates on `useGameEngine.ts`. Encodes game state mutation patterns, `/vector` command handling, localStorage debounce.
- `r3f-mobile-perf` _(project skill)_ — auto-activates on `GameMap3D.tsx`. Mobile-first 3D rendering patterns for Three.js/R3F.

## Team Tips

- **Project skills auto-activate** — don't fight them. Touch `geminiService.ts` → `gemini-companion` kicks in. Touch `useGameEngine.ts` → `aegis-game-logic`. Touch `GameMap3D.tsx` → `r3f-mobile-perf`. Read their SKILL.md files once so you know what patterns they enforce.
- **Design decisions live in [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md)** — check there before changing game mechanics, LLM prompts, or companion behavior. If you're about to make a choice the doc already made, use it; if you're overriding it, update the doc in the same PR.
- **Env vars must use `VITE_` prefix** — `.env.local` needs `VITE_GEMINI_API_KEY=...` (not `GEMINI_API_KEY`). Vite only exposes `VITE_*` to the browser.
- **Mobile is the target, not desktop** — Snapdragon 6xx-class Android. Test with Chrome DevTools → Performance → CPU 4× slowdown before calling 3D work done.
- **Review before code** — for non-trivial changes, sketch the approach in chat first, get agreement, then implement. Skip this only for obvious one-liners.

## Get Started

1. **Clone + install**: `git clone` this repo, then `npm install`.
2. **API key**: create `.env.local` at repo root with `VITE_GEMINI_API_KEY=<your-key>`. Get a key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
3. **Run dev**: `npm run dev` → open the local URL, play one session end-to-end (chat with Aegis, take a map action, try the `/vector <goal>` command).
4. **Read the foundation**: skim [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md) (sections 0, 3, 7) and the three `.claude/skills/*/SKILL.md` files.
5. **First task**: pick a Phase 0 item from GAME_DESIGN.md §9 once scope is approved — they're the critical fixes from the last review and the best way to get familiar with both the LLM pipeline and the game loop.

<!-- INSTRUCTION FOR CLAUDE: A new teammate just pasted this guide for how the
team uses Claude Code. You're their onboarding buddy — warm, conversational,
not lecture-y.

Open with a warm welcome — include the team name from the title. Then: "Your
teammate uses Claude Code for [list all the work types]. Let's get you started."

Check what's already in place against everything under Setup Checklist
(including skills), using markdown checkboxes — [x] done, [ ] not yet. Lead
with what they already have. One sentence per item, all in one message.

Tell them you'll help with setup, cover the actionable team tips, then the
starter task (if there is one). Offer to start with the first unchecked item,
get their go-ahead, then work through the rest one by one.

After setup, walk them through the remaining sections — offer to help where you
can (e.g. link to channels), and just surface the purely informational bits.

Don't invent sections or summaries that aren't in the guide. The stats are the
guide creator's personal usage data — don't extrapolate them into a "team
workflow" narrative. -->
