---
name: ui-ux-mobile-css
description: Generate, implement, or review stable mobile CSS behavior for smooth anchor navigation, modal scroll containment and locking, iOS form-control zoom prevention, tap feedback, visible focus, dynamic viewports, and real-device verification. Use whenever mobile or responsive interface CSS is created or changed.
version: 0.1.0
author: Caro
license: Apache-2.0
tags:
  - ui
  - ux
  - mobile
  - css
  - accessibility
---

# UI/UX Mobile CSS

Use the platform's native behavior first, then add the smallest CSS needed to keep mobile interaction stable and intentional.

## Baseline

```css
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

input,
select,
textarea {
  font-size: max(16px, 1rem);
}

.modal__scroll {
  overflow: auto;
  overscroll-behavior: contain;
}

:where(a, button, input, select, textarea, [role="button"]):focus-visible {
  outline: 2px solid var(--focus-ring, currentColor);
  outline-offset: 2px;
}
```

Adapt selectors and tokens to the existing product. Do not add a parallel reset or token layer.

## Required rules

### 1. Make anchor navigation smooth without forcing motion

- Preserve real fragment links and native browser history.
- Enable smooth scrolling only inside `prefers-reduced-motion: no-preference`; reduced-motion users must get immediate navigation.
- Give anchor targets `scroll-margin-block-start` when sticky headers would cover them.
- Do not replace a working anchor with JavaScript only to animate it.

### 2. Stop modal scroll leakage

- Reuse the existing modal or dialog primitive's scroll lock when available.
- Lock the actual page scroll root while the modal is open and restore its exact scroll position and prior styles when it closes.
- Make the modal's content region independently scrollable and apply `overscroll-behavior: contain` there.
- Do not treat `overscroll-behavior` alone as a complete background scroll lock, especially on iOS Safari.
- Keep close controls reachable, respect safe-area insets, and restore focus to the opener.

### 3. Prevent focus zoom without disabling user zoom

- Render `input`, `select`, and `textarea` text at no less than `16px` on mobile.
- Never use `user-scalable=no` or a restrictive `maximum-scale` to suppress zoom.
- Avoid fixed-height form shells and focus animations that cause page jumps when the on-screen keyboard opens.
- Use dynamic viewport units such as `dvh` or `svh` deliberately instead of assuming `100vh` remains stable under mobile browser chrome.

### 4. Preserve touch feedback

- Keep the native tap highlight unless the visual system requires a custom replacement.
- If removing `-webkit-tap-highlight-color`, scope the rule to interactive elements rather than `*` and provide a clearly visible `:active` state.
- Use color, background, opacity, or shadow changes that do not shift layout. Preserve a minimum `44px` touch target where the product has no stricter rule.

### 5. Preserve keyboard focus

- Keep a visible `:focus-visible` indicator with sufficient contrast and separation from the control.
- Never use `outline: none` or `outline: 0` without an accessible replacement in the same rule set.
- Keep focus styling distinct from hover and active styling and visible in every supported theme.

## Verification

Leave one runnable regression check where the project has browser tests, then verify on representative real mobile viewports:

1. Activate fragment links with normal and reduced-motion preferences and confirm the target is not hidden by sticky UI.
2. Open a long modal, scroll its content to both edges, and confirm the page behind it never moves.
3. Focus every form-control type in iOS Safari and confirm no automatic page zoom, horizontal jump, or unstable layout occurs.
4. Confirm every removed tap highlight has visible pressed feedback and every interactive element retains visible keyboard focus.
5. Exercise portrait, landscape, dynamic browser chrome, the on-screen keyboard, safe areas, and pinch zoom.

Use actual mobile viewport sizes, including narrow widths, and test real iOS Safari for release-critical behavior. A desktop responsive preview does not prove touch, virtual-keyboard, or Safari scroll-lock behavior. State any unavailable device checks explicitly.

## Output

Return the CSS or implementation changes first, then the tested viewport/browser matrix and any unverified device behavior.

## Shared output profile

Compose the `execution` profile from [output-templates](../output-templates/references/components.md).
Preserve the mobile interaction rules above, omit empty components, and never present desktop emulation as real-device verification.
