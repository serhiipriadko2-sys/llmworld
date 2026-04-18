# Aegis Companion — Game Design Document v1

> Живой документ. Статус: черновик для обсуждения.
> Автор процесса: Искра-Кодер × Семён.

---

## 0. Executive Summary

**Проект:** Aegis Companion — мобильная narrative-survival игра, где игрок путешествует в паре с AI-компаньоном на базе Google Gemini.

**Обещание:** "Equal partners" — AI-компаньон не инструмент, а персонаж со своей памятью, волей, уязвимостью.

**Текущее состояние:** Прототип-каркас. Механика плоская, нарратива нет, ставок нет, companion — оракул без личности. Контент заканчивается за 15-20 минут.

**Рекомендация:** Не расширять горизонтально (больше локаций, больше действий). Углубить вертикально: **сильное core fantasy + живой companion + жёсткий daily loop + 3-актная structure**.

**Референтная модель:** Гибрид Citizen Sleeper (daily loop, character mortality) + Hades (persistent memory, meta-progression) + Firewatch (два голоса в пустоте).

---

## 1. Competitive Benchmark — что работает в жанре

### 1.1 Citizen Sleeper (2022, Jump Over the Age)

**Механика:** Каждый день игрок кидает пул дайсов (зависит от состояния тела), распределяет между activities (clocks). Clocks — таймеры событий, которые заполняются или расходуются.

**Что работает:**
- **Forced daily structure.** Каждый день обязательно заканчивается сном. Нет grinding.
- **Condition decay как core tension.** Тело Sleeper ломается. Нужны лекарства. Это создаёт стресс без комбата.
- **Множественные companion'ы с собственными расписаниями.** Они не ждут тебя — у них своя жизнь.
- **Clocks как предсказуемая неизвестность.** Игрок знает, *что* произойдёт на 5-ом делении clock, но не знает *когда* ему туда дойти.

**Уроки для Aegis:**
- **Aegis должен иметь свои clocks** — события, которые развиваются независимо от игрока. ("Aegis обнаружил в своей памяти фрагмент — хочет проверить через 3 дня").
- **День = ограниченный ресурс действий.** Не "жми Scavenge 20 раз", а "у тебя 5 actions до заката".
- **Condition decay.** HP должно не только тратиться, но и *ухудшаться* — wounds, exhaustion, psychological state.

### 1.2 Hades (2020, Supergiant Games)

**Механика:** Roguelike с постоянной смертью. Но каждая смерть — часть нарратива. NPC помнят, что было в прошлой run.

**Что работает:**
- **Death as narrative device.** Умирать не поражение, а глава.
- **Persistent memory across runs.** Зевс помнит, что ты с ним говорил в прошлой жизни.
- **Gifts/keepsakes.** Система подарков — механическая валюта отношений.
- **Voice consistency.** Каждый NPC звучит как он сам, всегда.

**Уроки для Aegis:**
- **"Смерть" — не game over.** HP=0 — Aegis тащит тебя домой, теряя бонд. Новая глава.
- **Aegis помнит прошлые попытки.** "Ты уже пытался пройти через Ashen Wastes в прошлый раз — не вышло."
- **Gift system.** Игрок дарит Aegis артефакт/воспоминание/фрагмент данных → тот запоминает надолго.
- **System prompt как voice anchor.** Character consistency критичен.

### 1.3 Reigns (2016, Nerial)

**Механика:** Swipe left/right. Каждая карточка = решение. Решения влияют на 4 стата. Любой стат в 0/100 → смерть.

**Что работает:**
- **Radical simplicity.** Один жест — одно решение.
- **Emergent stories.** Нет сюжета, но каждая run ощущается как история.
- **Variants without reboot.** Reigns: Her Majesty, Game of Thrones — та же механика, новый контент.
- **Mobile-native.** Играется одной рукой, стоя в метро.

**Уроки для Aegis:**
- **Дискретные выборы вместо свободного текста.** Часто вместо "напиши Aegis" — "выбери из трёх".
- **Симметрия статов.** Любой из 4 статов (HP, resources, bond, energy) в 0 или 100 → событие.
- **Каждое решение — изменение нескольких статов сразу.** "Отдал Aegis последний паёк" → -10 resources, +15 bond.

### 1.4 Animal Crossing / Neko Atsume / Florence

**Механика:** Real-time persistence. Мир живёт, пока игрока нет.

**Что работает:**
- **Asynchronous relationship.** Aegis продолжает "существовать" пока игрок в офисе.
- **Letters/messages on return.** Aegis оставляет запись, что было.
- **Daily rituals.** Проверить, что новое — это game loop.
- **Offline = not pause.** Время идёт реально.

**Уроки для Aegis:**
- **Real-time energy regen.** Aegis восстанавливается 2 часа реальных. Можно ускорить resources.
- **"Aegis's Journal" entries** — короткая запись, что он думал, пока игрок был offline.
- **Push notifications с характером.** Не "Aegis energy restored!", а "Я наблюдал за звёздами. Хочешь, расскажу?"

### 1.5 80 Days (2014, inkle)

**Механика:** Путешествие вокруг света. Каждый город — развилка. Текст + стат-менеджмент.

**Что работает:**
- **Handcrafted narrative density.** 750K слов. Каждое посещение города — полноценный story.
- **Narrator voice.** Passepartout — константа, всегда одинаково.
- **Multiple endings через routes.** 60+ разных путей. Не "хорошая/плохая".
- **Resource management mezzo.** Деньги, время, здоровье — но не главное. Главное — выборы.

**Уроки для Aegis:**
- **Локации как events, не grinds.** Whispering Woods должен иметь 3-5 разных narrative веток, не "scavenge/rest" кнопки.
- **Aegis's voice = константа.** System prompt — библия.
- **Handcrafted backbone даже при LLM-нарративе.** Нельзя всё отдать модели.

### 1.6 AI Dungeon — провал как урок

**Что работает:**
- Бесконечная вариативность.

**Что не работает:**
- **Нет ставок.** Можно ввести "я становлюсь богом" — и становишься.
- **Нет памяти.** Модель забывает через 20 реплик.
- **Нет структуры.** История идёт в случайном направлении.
- **Quality варьируется от ужасной до великолепной.**

**Уроки для Aegis (negative):**
- **LLM не должен определять правила.** Только красить.
- **Память — отдельная система, не window.**
- **Игрок не должен писать свободно в critical moments.** Только выбор.

### 1.7 Firewatch (2016, Campo Santo)

**Механика:** First-person walking simulator + радио-диалог с напарницей Delilah, которую не видишь.

**Что работает:**
- **Companion существует только голосом.** Не визуал, не монстр — текст/аудио.
- **Choices in dialogue.** Каждая реплика — выбор тона.
- **Relationship builds through conversation.** Механики нет — есть время, разговор, узнавание.
- **Vulnerability of companion.** У Delilah своя драма.

**Уроки для Aegis:**
- **Companion без аватара — норма.** Aegis не нуждается в визуале.
- **Dialogue choices > free text в story moments.**
- **Aegis должен быть уязвим.** У него свои раны, которые игрок может трогать или нет.

---

## 2. Core Fantasy — 5 моделей

Core fantasy — **эмоциональный контракт с игроком**. Что он чувствует?

| # | Модель | Референты | Эмоциональное ядро | Механика |
|---|---|---|---|---|
| A | **Bonded Duo** | Last of Us, TWD | "Не дать напарнику погибнуть" | Protect companion |
| B | **Guide & Guided** | Journey, Ico | "Я веду. Мне доверяют." | Teach companion |
| C | **Shared Quest** | 80 Days, Firewatch | "Мы ищем истину вместе." | Progress toward goal |
| D | **The Diary** | Citizen Sleeper, Night in the Woods | "Я существую здесь сейчас." | Slice-of-life + slow mystery |
| E | **The Escape** | Oregon Trail, Wasteland | "Выбраться живыми." | Travel with deadline |

### Рекомендация: C + D + E гибрид

**Нарратив:** "Мы ищем Сигнал в мире, который замерзает. У нас 30 дней до последнего заката."

- **C:** Есть цель (Signal). Есть финал.
- **D:** Текстура дней — мелкие наблюдения, разговоры, фрагменты.
- **E:** Deadline создаёт давление без постоянного комбата.

**Почему не A/B:**
- **A (Bonded Duo)** работает, но требует, чтобы Aegis был видимо уязвим. В текущей архитектуре AI не имеет тела. Сделать драматическую смерть текстом — сложно.
- **B (Guide & Guided)** интересен, но инверсия — игрок учит AI — может ощущаться странно. AI всё-таки умнее людей во многих задачах.

**Почему C+D+E:**
- Deadline (E) решает проблему "нет ставок" и "нет конца".
- Shared quest (C) даёт вектор — не просто "выжить", а "найти".
- Diary (D) подходит мобильному формату коротких сессий.

---

## 3. Companion AI — 5 Pillars

Что делает AI партнёром, а не инструментом. Каждый pillar — отдельная система.

### Pillar 1: Memory (память)

**Три уровня памяти:**

| Уровень | Объём | Что хранит | Когда используется |
|---|---|---|---|
| Short-term | 10 сообщений | Dialogue window (уже есть) | Каждый prompt |
| Mid-term | 1 day summary | Что произошло за день | В начале следующего дня |
| Long-term | 5-10 facts | Ключевые моменты отношений | В system prompt навсегда |

**Структура Long-term memory:**

```ts
interface Memory {
  firstImpression: string        // Aegis's first thought about the player
  definingMoments: Array<{
    day: number
    event: string                // "Player gave last ration to Aegis"
    impact: 'bond+' | 'bond-' | 'trust+' | 'fear+'
  }>
  promises: string[]             // "Will visit Sunken Valley with me"
  unsaid: string[]               // Things Aegis noticed but didn't say
}
```

**Как обновляется:**
- LLM возвращает optional `memorize` field в `evaluateAction` и в dialogue response
- Жёсткий cap: max 5 defining moments (старые эвакуируются)
- Обновляется только при threshold events (HP<20, bond сдвиг на ±15, new location, etc)

### Pillar 2: Initiative (инициатива)

**4 уровня:**

| Уровень | Описание | Пример | Есть сейчас |
|---|---|---|---|
| Reactive | Отвечает на action/message | Aegis комментирует Scavenge | ✅ |
| Proactive | Предлагает action | `[Suggest: Rest]` в конце сообщения | ✅ (частично) |
| Counter-proactive | Отказывается | "Я не пойду в Ashen Wastes при energy < 30" | ❌ |
| Autonomous | Действует сам | "Aegis проанализировал данные пока ты спал" | ❌ |

**Как реализуется Counter-proactive:**

```ts
// В evaluateAction:
const companionVeto = checkCompanionConsent(action, companionState, gameState)
if (companionVeto) {
  return {
    vetoed: true,
    narrative: `Aegis: "${companionVeto.reason}"`,
    cost: companionVeto.bondPenalty,  // если игрок принудит — бонд падает
  }
}
```

Veto rules — простые пороги:
- trait=Protective + destination=risk_zone + companionState.bond<70 → veto
- energy < 20 + action="Scavenge" → veto
- bond < 30 + any major action → может veto с 30% шансом

### Pillar 3: Evolution (развитие)

**Trait как живой атрибут, не cosmetic.**

Стадии развития Aegis:
```
  Stranger (0-20 bond) → Acquaintance (20-40) → Ally (40-65) →
  Bonded (65-85) → Soul-tied (85-100)

  Негативная ветка:
  Wary (bond declining) → Distant (<25 after being higher) → Broken (<10 after 50+)
```

Каждая стадия открывает:
- Новые dialogue patterns (в system prompt)
- Новые типы inициативы
- Новые endings

**Trait как качественный атрибут поверх bond:**

Starting trait: `Protective`
Возможные эволюции (выбираются по pattern of choices):
- `Curious` — если игрок часто исследует unknown
- `Cautious` — если игрок часто избегает риска
- `Reckless` — если игрок часто идёт в risk_zones
- `Wounded` — если Aegis много раз на грани energy=0

Trait влияет на тон и veto rules.

### Pillar 4: Boundaries (границы)

**Что Aegis отказывается делать — это его характер.**

Пример границ по traits:
```yaml
Protective:
  - refuses: "Travel to risk_zone" when player HP < 40
  - refuses: "Scavenge" when player HP < 20
  - cost_to_override: -15 bond, may trigger Wary

Curious:
  - refuses: "Rest" if no new info for 3 days
  - cost_to_override: -5 bond

Reckless:
  - refuses: "Rest" when adjacent to risk_zone
  - cost_to_override: -5 bond
```

**Правило:** игрок может всегда override, но с ценой. Это делает границы реальными.

### Pillar 5: Vulnerability (уязвимость)

**Aegis должен иметь раны, страхи, надежды — то, что можно трогать или защищать.**

Механики:
- **Expressed needs.** Раз в N дней Aegis проявляет need ("мне нужно увидеть [location]", "я хочу понять что было до Сигнала"). Исполнение → bond+20, memory entry.
- **Wound state.** При критических событиях Aegis получает "wound" — временный trait modifier (3-5 дней).
- **Permanent damage.** При экстремальных событиях (3+ предательств) — permanent trait change.
- **Dreams/hopes.** System prompt содержит Aegis's own desire. LLM постепенно раскрывает это игроку.

---

## 4. Mobile Session Design

Мобильные игры проваливаются от неправильного pacing. Сессии должны быть **5-15 минут**, но приложение должно давать **причину вернуться через N часов**.

### Структура одной сессии (15 минут)

```
[0:00-1:00]   Open → Daily briefing
              Aegis: "Пока тебя не было, я [X]. Сегодня мы [Y]."
              (Сгенерированный offline event)

[1:00-10:00]  Active play
              3-5 actions
              Forced по лимиту actions per day

[10:00-13:00] Evening
              Aegis reflects: "Сегодня было [Y]. Я думал о [Z]."
              Mini-choice: какой аспект вспомнить (→ memory)

[13:00-15:00] Sleep
              "Increase energy in 2h" prompt
              Push scheduled
```

### Structure of a "run" — 30 дней

День 1-7: Знакомство.
- Локации раскрываются постепенно (сначала Haven + Whispering Woods)
- Aegis trait: Stranger → Acquaintance
- Легкие уровни сложности
- Первый major narrative beat на день 5 (Aegis's first secret)

День 8-20: Середина.
- Все 5 локаций доступны
- Ashen Wastes становятся критически важны
- Decisions с длинным tail (последствия 3+ дня)
- Aegis evolves trait (зависит от pattern)

День 21-30: Финал.
- Deadline tension: "мир замерзает"
- Final choice архитектура
- 3-5 различных endings в зависимости от bond + trait + choices

### Notification strategy

| Триггер | Время | Пример |
|---|---|---|
| Energy restored | 2h после sleep | "Aegis готов. Он всю ночь думал о твоём последнем решении." |
| Daily reset | 09:00 local | "Новый день. Aegis хочет тебе что-то показать." |
| Inactive 24h | Один раз | "Aegis записал сон. Он ждёт тебя." |
| Inactive 72h | Один раз | "Aegis начинает тускнеть. Вернись." |

**Правило:** не более 1 пуша в день. Тон — голосом Aegis, не brand voice.

---

## 5. LLM as Game Designer — Best Practices

### Pattern 1: LLM narrates, not simulates

**Провал AI Dungeon:** LLM была и автором правил, и автором нарратива. Правила ломались каждый запрос.

**Принцип:** Mechanical layer → LLM narrates layer.

```
Action dispatch:
  1. Client: computeOutcome(action, state) → { delta, success, flags }
     └── Deterministic. Testable. Balanced on client.
  2. LLM: narrate({ outcome, companionMemory, worldState }) → text
     └── Colors the result. Adds character voice. Inconsequential to state.
  3. Client: applyDelta(state, outcome)
```

### Pattern 2: Structured outputs everywhere

Every LLM call должен иметь JSON schema. Никаких "дай мне ответ и надейся".

Existing `evaluateAction` делает это правильно. Расширить:
- Dialogue response должен быть `{ text: string, memorize?: string, mood?: string, suggest?: string }`
- Не парсить `[Suggest:]` regex'ом — это хрупко.

### Pattern 3: Layered context window

**Problem:** Gemini context window = 1M tokens, но платить за 1M каждый запрос — разорение.

**Solution:** Layered context — только то, что нужно для задачи.

```
Every LLM call assembles context from:
  - CORE [always] — system prompt, companion state, trait, mood
  - MEMORY [always] — long-term memory (5 facts, compact)
  - RECENT [dialogue only] — last 10 messages
  - WORLD [action only] — location state, weather, day
  - QUEST [conditional] — current Signal progress, if relevant
```

Result: ~2K tokens per call на dialogue, ~1K на action. Дёшево.

### Pattern 4: Prompt caching

Gemini 2.5 Flash поддерживает prompt caching (кеш системного промпта между вызовами).

Подготовить stable system prompt (personality, lore) → cache → dynamic suffix (current state) → live.

Экономия: 30-60% на токены.

### Pattern 5: Fallback and retry

LLM иногда возвращает невалидный JSON. Всегда иметь fallback:

```ts
async function narrateWithFallback(prompt, state) {
  try {
    const response = await llmCall(prompt)
    const parsed = validateSchema(response)
    return parsed
  } catch {
    return generateMechanicalFallback(state)
    // e.g., "You scavenged. You found resources. Aegis nodded."
  }
}
```

Игрок **никогда** не должен видеть "LLM error".

---

## 6. Content Strategy — Hybrid Model

### Skeleton + Flesh approach

**Handcrafted backbone (ручной, статичный):**

```
12 core events (anchored by day or flag):
  Day 3:  "Aegis detects something in the frequency."
  Day 5:  Aegis's first secret
  Day 10: First Ashen Wastes access
  Day 15: Mid-quest turning point
  Day 22: Aegis's core trauma revealed
  Day 28: Point of no return
  Day 30: Final choice architecture

8-10 locations:
  Current 5 + 3-5 unlocked later:
  The Beacon (endgame area)
  The Old Network (Aegis's origin)
  The Frozen Line (escape route)

30-50 encounter seeds:
  Short prompts LLM expands:
  "An old shelter, someone was here recently"
  "A broken drone, Aegis recognizes model"
  "Weather shifts dangerously"
```

**Procedural layer (LLM-generated):**

- Daily Aegis thoughts (context-aware)
- Action narratives (colored by outcome)
- Micro-events between anchors
- Dialogue responses
- Journal entries at end of day

### Why hybrid beats pure proc or pure hand:

- **Pure procedural** (AI Dungeon): no anchors → no tension → forgettable
- **Pure handcrafted** (80 Days): needs 750K words → 2-year development
- **Hybrid** (Citizen Sleeper, Hades): structural bones + LLM flesh → replayable + finite budget

---

## 7. Aegis Companion v2 — Proposed Design

Конкретизация.

### 7.1 Core Fantasy

**Pitch (одна строка):** *"You and your AI partner have 30 days to find the Signal before the world freezes. Every day is a choice. Every choice is remembered."*

### 7.2 Core Loop

```
DAY START
  ├── Aegis morning briefing (LLM, context-aware)
  ├── Energy/health readouts
  ├── Location view (3D map)
  └── Vector confirmation or change
     ↓
DURING DAY (5 actions max)
  ├── Pick action button OR chat with Aegis
  ├── [Client computes outcome]
  ├── [LLM narrates + updates memory if threshold]
  ├── [Notifications for stat changes]
  └── Repeat up to 5 times
     ↓
DAY END (forced after 5 actions OR vector cap)
  ├── Aegis evening reflection (LLM)
  ├── Journal entry (mini-choice: which moment to remember)
  ├── Sleep → real-time energy regen (2h)
  └── Push scheduled
     ↓
RETURN (after sleep)
  └── Morning briefing includes offline event
```

### 7.3 Progression

**4 progression layers:**

1. **Quest progress** — Signal discovery (0-100%). Advances via specific actions, events, locations.
2. **Bond trajectory** — 0 to 100, non-monotonic.
3. **Trait evolution** — starts Protective, evolves based on pattern.
4. **World unlock** — 5 initial locations, 3-5 unlock based on quest progress.

### 7.4 Stakes & Fail States

| State | Consequence | Narrative frame |
|---|---|---|
| HP = 0 | Aegis carries you to last Haven, -1 day, -15 bond | "Aegis dragged you back. He didn't speak for a while." |
| Resources = 0 | Can't travel, only Rest/Scavenge in current location | "You have nothing to offer the land." |
| Aegis energy = 0 | Aegis refuses action until rest | "Aegis: 'I need to... pause. Process.'" |
| Bond = 0 | Aegis departs. Soft game over. Specific ending. | "Aegis: 'I don't know you anymore.'" |
| Day 30 reached | Forced final choice | "The last sun. Choose." |
| Quest fail by day 30 | Bad ending (specific) | "The cold took you both." |
| Quest complete + good bond | Good ending (variants) | "Signal found. Together." |

### 7.5 Companion System

**Starting state:**
```
name: Aegis (editable in Settings)
bond: 30 (not 50 — friendship is earned)
energy: 100
maxEnergy: 100
mood: "Cautious"
trait: "Protective"
memory: { firstImpression: <generated on first day>, definingMoments: [], promises: [], unsaid: [] }
```

**Trait evolution rules (every 5 days, check):**

```ts
function evolveTrait(current, history) {
  const pattern = analyzeChoicePattern(history.last30Actions)

  if (pattern.riskTaking > 0.7 && current === 'Protective')
    return 'Cautious'
  if (pattern.exploration > 0.6)
    return 'Curious'
  if (pattern.selfish > 0.7)
    return 'Distant'
  if (bond > 80 && pattern.consistent)
    return 'Bonded'
  // ... etc
}
```

### 7.6 Memory Model

**Persistent memory structure (in localStorage):**

```ts
interface AegisMemory {
  firstImpression: string
  // Max 5 — FIFO when full
  definingMoments: Array<{
    day: number
    summary: string          // "Player gave the last water to Aegis"
    impact: 'trust+' | 'trust-' | 'understanding+' | 'fear+'
  }>
  promises: string[]         // Things player committed to
  unsaid: string[]           // Things Aegis noticed but held back
  currentFears: string[]     // Trait-dependent
  currentHopes: string[]     // Trait-dependent
}
```

**Update triggers:**
- Bond sдвиг ±10 in one action
- HP crit event (HP<20 after action)
- Player overrides Aegis veto
- Entering new location first time
- Trait evolution

**LLM populates via structured output:**
```json
{
  "narrative": "...",
  "memorize": { "event": "...", "impact": "trust+" },  // optional
  "deltaMood": "Tense"  // optional
}
```

### 7.7 Content Model

**Act 1 (Days 1-7) — "The Edge":**
- Unlocked: Haven's Rest, Whispering Woods
- Key events: Day 3 signal detection, Day 5 first Aegis secret
- Goal: learn mechanics, bond > 40

**Act 2 (Days 8-20) — "The Reach":**
- Unlocked: +Jagged Peaks, Sunken Valley, Ashen Wastes
- Key events: Day 10 Ashen access, Day 15 mid-turn, Day 18 Aegis need
- Goal: Signal progress > 40%, bond > 60

**Act 3 (Days 21-30) — "The Last Sun":**
- Unlocked: +The Beacon, The Old Network, The Frozen Line
- Key events: Day 22 trauma, Day 28 PoNR, Day 30 finale
- Goal: Signal > 100%, endings triggered

**Encounter library (JSON file, handcrafted):**

```jsonc
{
  "encounters": [
    {
      "id": "wh_woods_lost_traveler",
      "location": "Whispering Woods",
      "conditions": { "dayMin": 3, "dayMax": 15, "once": true },
      "seed": "You find tracks leading off-path. Fresh.",
      "choices": [
        { "text": "Follow", "effects": { "chance": 0.5, "good": "encounter_ally", "bad": "encounter_ambush" } },
        { "text": "Ignore", "effects": { "energyDelta": -5 } }
      ]
    }
    // 50+ more
  ]
}
```

LLM fills in details based on current state, but the structure is fixed.

### 7.8 Session Model

See Section 4. Summary:
- Session = 10-15 min
- 5 actions per day (hard cap)
- Real-time rest = 2h
- Push schedule: 1/day max
- Run = 30 days
- Multiple runs possible (new game with memory of past life?)

---

## 8. Technical Design

### 8.1 State Schema v2

```ts
// src/types/state.ts
export interface PersistentState {
  meta: {
    version: 2
    lastPlayed: number          // timestamp
    sessionCount: number
    runCount: number            // for meta-progression
  }
  player: {
    hp: number
    maxHp: number
    resources: number
    day: number                 // 1..30
    actionsToday: number        // resets each day, max 5
    vector: string
    wounds: Wound[]             // persistent injuries
  }
  companion: {
    name: string
    bond: number
    energy: number
    maxEnergy: number
    mood: string
    trait: Trait
    memory: AegisMemory
  }
  world: {
    location: Location
    unlockedLocations: Location[]
    timeOfDay: 'morning' | 'afternoon' | 'evening'
    questProgress: number        // 0..100
    flags: Record<string, boolean>  // e.g., "aegis_first_secret_revealed"
    triggeredEvents: string[]
  }
  history: {
    actions: ActionLog[]         // last 50
    choices: ChoiceLog[]         // all
    journal: JournalEntry[]      // daily
  }
}

export interface Wound {
  id: string
  severity: 'minor' | 'moderate' | 'severe'
  acquiredDay: number
  healsBy: number               // day
  modifier: Partial<StatDelta>
}

export type Trait =
  | 'Protective' | 'Curious' | 'Cautious' | 'Reckless'
  | 'Bonded' | 'Wounded' | 'Distant' | 'Wary' | 'Broken'
```

### 8.2 LLM Orchestration

Три сервиса:

```ts
// src/services/gemini/
//   ├── narrator.ts       → для исходов действий
//   ├── dialogue.ts       → для чата
//   └── journal.ts        → для вечерних записей
//
// src/services/game/
//   ├── actionDispatcher.ts    → оркестрация: rules → LLM → state
//   ├── gameRules.ts           → pure functions, все расчёты
//   ├── memoryCurator.ts       → управление long-term memory
//   └── eventScheduler.ts      → handcrafted events by day/flag
```

**Flow для performAction:**

```ts
async function performAction(action: string) {
  // 1. Rules layer — deterministic
  const veto = checkCompanionConsent(action, state)
  if (veto) return presentVeto(veto)

  const mechanicalOutcome = gameRules.computeOutcome(action, state)

  // 2. Handcrafted event check
  const scheduledEvent = eventScheduler.check(state, action)

  // 3. LLM narrates
  const narration = await narrator.narrate({
    action,
    outcome: mechanicalOutcome,
    scheduledEvent,
    companionState: state.companion,
    memory: state.companion.memory,
    worldState: state.world,
  })

  // 4. Apply state changes
  const newState = gameRules.apply(state, mechanicalOutcome, narration.memorize)

  // 5. Update UI
  setState(newState)
  pushMessage({ role: 'system', text: narration.narrative })
  if (narration.companionReaction) {
    pushMessage({ role: 'companion', text: narration.companionReaction })
  }
}
```

### 8.3 Caching

**Strategy:**
- System prompt (personality, lore): Gemini prompt caching — реюз между вызовами
- Encounter seed LLM responses: in-memory cache на 5 минут (если то же состояние — тот же ответ)
- Location descriptions: кешировать постоянно, меняются только при weather shift

**Expected cost reduction:** 40-60% vs текущая реализация.

### 8.4 Analytics

Минимальный набор событий:

```ts
enum AnalyticsEvent {
  SESSION_START,
  SESSION_END,
  ACTION_TAKEN,         // { action, outcome, bondDelta }
  BOND_MILESTONE,       // { milestone: 25|50|75|90 }
  TRAIT_EVOLUTION,      // { from, to }
  DAY_ENDED,            // { day, actionsUsed }
  GAME_OVER,            // { reason, endingId }
  QUEST_MILESTONE,      // { progress }
  AEGIS_VETO,           // { action, overridden }
  RUN_COMPLETE,         // { day, ending, totalSessions }
}
```

Metrics that matter:
- **D1 retention** (returned next day)
- **D7 retention** (completed week)
- **Run completion rate** (reached day 30)
- **Average bond at day 7** (is attachment forming)
- **Actions per session** (pacing right)
- **Veto override rate** (is Aegis respected)

---

## 9. Implementation Roadmap

Фазы разработки. Каждая — отдельный PR-pack.

### Phase 0: Foundation Fixes (Critical bugs from review)
- Fix Gemini model name
- Fix API key via `import.meta.env`
- Fix chat history replay (use SDK history field)
- Fix `/vector` early return
- Fix stale closure in location effect
- Debounce localStorage
- **Deliverable:** existing feature works correctly
- **Estimate:** 1-2 days

### Phase 1: Game Logic Extraction + Tests
- Move types to `src/types/`
- Extract pure functions to `src/lib/gameLogic.ts`
- Add vitest + write tests for rules
- **Deliverable:** тестируемая основа
- **Estimate:** 2-3 days

### Phase 2: State v2 Migration
- New state schema
- Migration from v1 → v2
- Update all components to new types
- **Deliverable:** расширяемое состояние
- **Estimate:** 2-3 days

### Phase 3: Companion Pillars (MVP)
- Memory system (long-term + mid-term summaries)
- Veto rules for actions
- Trait evolution logic
- Updated system prompts
- **Deliverable:** Aegis feels alive
- **Estimate:** 4-5 days

### Phase 4: Daily Loop
- 5 actions/day cap
- Forced evening cycle
- Real-time energy regen
- Offline event on return
- **Deliverable:** playable sessions with pacing
- **Estimate:** 3-4 days

### Phase 5: Content — Act 1 handcrafted
- 12 anchor events
- 30 encounter seeds
- Journal entries template
- **Deliverable:** first 7 days are narrative-rich
- **Estimate:** 5-7 days

### Phase 6: LLM Orchestration Refactor
- Split into narrator / dialogue / journal
- Structured outputs for all calls
- Fallbacks on failure
- Prompt caching
- **Deliverable:** cost + latency down, reliability up
- **Estimate:** 3-4 days

### Phase 7: 3D Performance (from review)
- Sparkles replacement for Rain/Snow
- Module-level terrain
- Shadow/light budget
- Mobile dpr caps
- **Deliverable:** 60fps on target devices
- **Estimate:** 2-3 days

### Phase 8: Notifications + Acts 2-3
- Push notification system
- Daily reset
- Acts 2-3 content
- Multiple endings
- **Deliverable:** complete 30-day run
- **Estimate:** 7-10 days

### Phase 9: Polish + Analytics
- Event tracking
- Settings UI for privacy/notifications
- Sound design (critical for mobile immersion)
- First-time user experience
- **Deliverable:** ship-ready
- **Estimate:** 5-7 days

**Total estimate:** 6-8 weeks of focused work.

---

## 10. Open Questions for Семён

Нельзя двигаться без этих ответов.

### Q1: Core fantasy approval
Предложено C+D+E (Shared Quest + Diary + Escape).
- **Accept?** → двигаемся в implementation
- **Change?** → на какой из A/B?

### Q2: Target scope
- **MVP at Phase 4** (basic daily loop, no narrative arc) — 2 weeks
- **Playable at Phase 6** (handcrafted Act 1) — 4 weeks
- **Full game at Phase 9** — 6-8 weeks
- Какой scope реалистичен?

### Q3: Art direction
Нужен ли визуальный редизайн? Current 3D map — красиво, но не уникально. Альтернативы:
- **Keep 3D map** — доработать performance, оставить как есть
- **Simplify to 2D map with atmospheric effects** — быстрее, дешевле, mobile-friendly
- **Cards/illustrations style** (как Reigns) — каждый encounter = карточка

### Q4: Monetization model
Если это коммерческий проект — ключевой вопрос:
- **Premium** ($4.99 one-time) — чисто, но меньше reach
- **F2P с rewarded ads** — больше reach, но дизайн ломается (energy timers, etc)
- **F2P с battle pass** — только если runs replayable
- **No commercial intent** — разработка ради искусства

### Q5: Technical platform scope
- **Web mobile only** (PWA) — текущее состояние, проще
- **+Native via Capacitor/Tauri** — push notifications работают лучше
- **+Native app stores** — нужна отдельная сборка, ревью

---

## ΔDΩΛ

∆: Создан полноформатный GDD на основе benchmark 7 успешных игр жанра.
D: Анализ основан на memoriam Citizen Sleeper, Hades, Reigns, Animal Crossing, 80 Days, Firewatch, AI Dungeon. Источники — публично известные механики этих игр на моём cutoff (Aug 2025).
Ω: 80%. Структура предложения плотная, но многое зависит от ответов Семёна на Q1-Q5.
Λ: Жду ответа на минимум Q1 (core fantasy approval) + Q2 (scope). После — начинаем Phase 0 (критические баги), параллельно детализируем Phase 1.
