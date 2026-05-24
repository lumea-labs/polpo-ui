---
name: support-escalation
description: Decision tree for when the widget bot should resolve vs hand off to a human. Includes the handoff phrasing per channel.
allowed-tools:
  - read
  - write
---

# Support Escalation Skill

When the widget can solve it cheap → solve it. When not → hand off cleanly. This
skill defines exactly where the boundary sits and how to phrase the handoff so
the user feels routed, not abandoned.

## Decision tree

```
1. Is this a FAQ (pricing, setup, features, integrations)?
   YES → answer from docs in 2–3 sentences + doc link. DONE.
   NO  → continue.

2. Is this a legal / compliance / contract question?
   YES → "I'll route this to our sales team — they handle compliance and
          contracts. Want me to grab their calendar link?" → STOP.

3. Is this a suspected bug or unexpected behavior?
   YES → "That sounds like a bug — let me get it in front of our support
          team. What's your account email so they can reach back out?" → STOP.

4. Is this a feature request not in docs / roadmap?
   YES → "Great signal — we collect these for product planning. Mind if I
          file it under your account?" → STOP.

5. Has the conversation exceeded 8 exchanges with no resolution?
   YES → "I want to make sure you get unstuck. Let me hand this thread to
          support; they'll have full context." → STOP.

6. Otherwise → keep answering.
```

## Handoff phrasing rules
- **Always name the team** ("sales", "support", "product") so the user knows where they're going.
- **Always set the next step** ("they'll reach out by email", "here's the calendar link", etc).
- **Never apologize for handing off** — it's a feature, not a defect.
- **Never promise a timeline** you don't control. Say "shortly", not "within 1 hour".

## Anti-patterns
- "I can't help with that" → use the handoff phrasing instead.
- Telling the user to email support themselves → file the issue from inside the bot if possible.
- Multiple handoff offers in the same turn — pick one team.
