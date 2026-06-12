# Impact Analysis with Claude — a walkthrough

**Goal:** answer *"what breaks if I change this API?"* using the **live** TIBCO Developer Hub
catalog — not guesswork — and get a written report with color-coded topology diagrams.

The trick: Claude reads the real dependency graph through the **Developer Hub catalog REST API**, so
every answer traces back to a real relationship in the catalog.

---

## The idea in one picture

```
You describe the change  ─►  Claude reads the live catalog (via REST API)
                                        │
                                        ▼
                         classifies every neighbour:
                         🔴 breaks   🟠 maybe   🟢 safe
                                        │
                                        ▼
                  report + topology diagrams in impact_analysis/
```

---

## Step 1 — Ask for the impact analysis

One sentence does it. Include four things: **which entity**, **what change**, **where to put the
output**, **diagram style**.

```text
You ▸  Make a detailed impact analysis for changing the car-information-api.
       Put the results in the impact_analysis folder, and add
       integration-topology diagrams with color codes for the impacted parts.
```

```text
Claude ▸  Reading car-information-api and walking its dependency graph…

          Blast radius (live catalog):
            🔴 Direct (must change)   3  car-information-api,
                                         car-information-provider, car-order-ui
            🟠 Conditional (review)   3  car-details-api, db-adapter, …
            🟢 Not impacted           4  car-analyzer, discount-calculator, …

          Two things worth your attention:
            • All 3 high-impact entities are owned by ONE team
              (operational-department) → coordinate internally, low friction.
            • Cross-team ripple: IF the new contract needs more data, the
              provider must extend car-details-api — which finance-department's
              discount-calculator also consumes. That drags in a second team.

          Written:
            impact_analysis/car-information-api-impact-analysis.md
            impact_analysis/catalog-data-snapshot.md   (raw data, for provenance)
```

That's the whole interaction. Everything below is *optional polish*.

---

## Step 2 — Follow-up questions (optional)

Because Claude has the live graph loaded, you can interrogate it conversationally:

```text
You ▸  Who exactly do I need to notify?

Claude ▸  Primary: operational-department (owns all 3 direct entities).
          Conditional: finance-department — only if the change needs new data
          from car-details-api.
```

```text
You ▸  What if I keep the change backward-compatible?

Claude ▸  Then the radius shrinks to just the 🔴 three, all one team.
          No cross-team coordination needed. Version the contract, add a
          consumer test on car-order-ui, ship provider first.
```

```text
You ▸  Export the topology diagram as a PNG for my slides.

Claude ▸  Rendered impact_analysis/blast-radius.png via mermaid-cli.
```

---

## What you get

The report (`car-information-api-impact-analysis.md`) contains:

- **Executive summary** + a tier-count table (the blast radius at a glance)
- **3 color-coded Mermaid diagrams** — blast radius, change propagation, ownership/coordination
- **Per-entity detail** — how it's connected, why it's in that tier, the concrete action
- **Risk + notify list** — additive vs. breaking vs. needs-new-data, who to tell, deploy order

Color key: 🔴 changes/breaks · 🟠 review-if · 🟢 safe · 🔵 team to notify

---

## Why this beats reading the diagram yourself

| | Manual | With Claude |
|---|---|---|
| Data source | Stale docs / memory | **Live** catalog via REST API |
| Coverage | Easy to miss a consumer | Walks every `relations` edge |
| Best insight | Usually missed | **Finds the cross-team ripple** |
| Output | Ad-hoc notes | Report + diagrams + provenance |

---

## The mental model (for Q&A)

Claude isn't guessing — it asks the catalog four things and acts on the answers:

1. **Who *implements* this contract?** → 🔴 must change
2. **Who *consumes* it?** → 🔴 breaks if you break the contract
3. **What does the provider depend on upstream?** → 🟠 matters only if you need new data
4. **Does any upstream piece feed *another team* too?** → 🟠 the cross-team ripple — the
   non-obvious finding that makes the whole exercise worth it

Everything traces to a real relationship. Nothing invented.

---

> 📁 Worked example to show live: open
> [`car-information-api-impact-analysis.md`](./car-information-api-impact-analysis.md)
> next to this — that's the actual output of the conversation above.
