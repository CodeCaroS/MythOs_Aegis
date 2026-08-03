---
name: ui-ux-loading-states
description: Generate, implement, or review loading feedback chosen by expected wait time, known content structure, and measurable progress. Use whenever UI work adds or changes skeletons, spinners, progress bars, pending actions, slow-operation messaging, timeouts, retries, or loading accessibility.
version: 0.1.0
author: Caro
license: Apache-2.0
tags:
  - ui
  - ux
  - loading
  - progress
  - accessibility
---

# UI/UX Loading States

Choose loading feedback from observed or credibly expected wait time, final-layout knowledge, and measurable progress.

## Selection matrix

| Situation | Feedback |
| --- | --- |
| Result is nearly instant | Show no loader; avoid a flash that makes the interaction feel slower. |
| Reliably under about 3 seconds and final layout is known | Show a layout-accurate skeleton. |
| Short, indeterminate action with no useful layout preview | Show a labelled spinner near the affected action or region. |
| Progress is measurable or the operation takes more than a few seconds | Show progress plus the current operation. |
| Wait is long or unpredictable | Show the operation, credible duration or completed steps, and cancel or retry when supported. |

Prefer observed product timings over guesses. Keep existing content visible when it remains useful and stale data is safer than an empty screen.

## Skeleton rules

- Use a skeleton only when the final structure, dimensions, and hierarchy are known and the expected wait is reliably under about 3 seconds.
- Treat the skeleton as a layout promise. Reserve final text lines, media aspect ratios, spacing, and container sizes so replacement causes no unexpected movement or resizing.
- Match the actual content instead of drawing generic gray rectangles.
- Use a subtle, slow, steady shimmer from left to right. Avoid fast motion, pulsing fades, and high-contrast flashes.
- Stop the shimmer for `prefers-reduced-motion`. Keep a clear non-animated placeholder and text status rather than forcing motion.
- Hide decorative skeleton shapes from the accessibility tree. Mark the loading region busy and expose one concise status instead of announcing every placeholder.

Do not use a skeleton for long, unknown, or structurally unpredictable work. It communicates layout, not remaining time.

## Other indicators

### Spinner

- Use a spinner for a short indeterminate action when previewing the final layout adds no value.
- Label the pending action, keep the indicator local to the affected region, and prevent duplicate activation.
- Avoid flashing a spinner for near-instant results. Reuse the product's established display delay when one exists.

### Progress

- Use determinate progress only when real completion can be measured. Never invent percentages or move backward without explaining why.
- When exact progress is unavailable but the wait is long, show an indeterminate progress state plus the current operation or completed steps.
- Provide a credible estimate only when the system can support it. Prefer honest stages over a fake countdown.
- Offer cancel, safe retry, background continuation, or navigation away when the operation permits it.

## Slow, adaptive, and failed states

- Never leave a skeleton or spinner running indefinitely. Define a slow state, timeout, retry, error, or alternative progress message.
- Preserve completed work and entered data across failure and retry.
- Transition from a skeleton to more informative feedback only when the application can detect the delay reliably and already supports the extra state complexity.
- Keep focus stable during transitions. Use restrained live-region announcements for meaningful state changes, not animation frames.

## Verification

Leave one runnable loading-state check using controlled latency and failure responses. Verify:

1. Near-instant results do not flash an indicator.
2. A fast known-layout response uses an accurate skeleton and swaps with no load-induced layout shift.
3. A short action with unknown structure uses a labelled spinner.
4. Measurable or long work exposes honest progress, current work, and supported cancel or retry behavior.
5. Slow, offline, timeout, and server-failure paths never strand the user in an indefinite loading state.
6. Reduced-motion mode removes shimmer while retaining understandable status.
7. Assistive technology receives one useful busy or status update and can safely continue after success, cancellation, or failure.

Exercise durations around the product's real boundaries, including just below and above 3 seconds when skeleton selection depends on that threshold. If telemetry, runtime, layout-shift, or assistive-technology verification is unavailable, state that limitation explicitly.

## Output

Return the selected loading pattern and implementation first, then timing evidence, tested slow and failure states, and remaining runtime limits.

## Shared output profile

Compose the `execution` profile from [output-templates](../output-templates/references/components.md).
Preserve the selection and timeout rules above, omit empty components, and never present an indeterminate wait as measured progress.
