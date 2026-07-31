# WAI-ARIA APG pattern routing matrix

Source inventory: [W3C WAI-ARIA APG Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/), verified 2026-07-30 against the 30 published pattern pages and W3C source commit `7e4034b262bc0d25332e330d8a582aaf`.

This modified routing matrix condenses, reorganizes, and supplements W3C
material. Copyright © 2026 World Wide Web Consortium. See
[THIRD_PARTY_NOTICES.md](../../../../THIRD_PARTY_NOTICES.md) for the source,
change notice, and W3C Software and Document License.

Use this file to find every applicable pattern. Before making a finding, open the linked current page and evaluate all required keyboard interactions, roles, states, properties, notes, and warnings. The summaries below route the review; they do not replace the source.

| Pattern | Apply to | Review emphasis |
|---|---|---|
| [Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) | Stacked headings that expand or collapse panels | Heading/button structure, `aria-expanded`, `aria-controls`, Enter/Space, Tab order, and optional header navigation |
| [Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) | Brief important messages that do not interrupt work | `alert` semantics, announcement timing, and no forced focus |
| [Alert and Message Dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/) | Modal interruption that requires a response | `alertdialog`, modal behavior, name, description, initial focus, containment, dismissal, and return focus; also review Dialog |
| [Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/) | Hierarchical parent-page trail | Named navigation landmark, link semantics, and `aria-current="page"` |
| [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) | Controls that trigger actions | Native button first, accessible name, Enter/Space, focus after activation, disabled state, and `aria-pressed` for toggles |
| [Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) | Rotating slides or item sets | Rotation control and stop conditions, control order, slide naming, live-region state, and Button or Tabs dependencies |
| [Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) | Two- or three-state choices | Native checkbox first, Space, name, group description, and checked `true`, `false`, or `mixed` |
| [Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) | Input or selector with a listbox, grid, tree, or dialog popup | One page tab stop, expanded and popup relationships, autocomplete, active descendant, editing keys, popup navigation, Enter, and Escape |
| [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Modal window over page content | `dialog`, name, justified description, `aria-modal`, inert background, initial focus, Tab containment, Escape, and return focus |
| [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | A control that shows or hides content | Button semantics, `aria-expanded`, optional `aria-controls`, and Enter/Space |
| [Feed](https://www.w3.org/WAI/ARIA/apg/patterns/feed/) | Dynamically loaded stream of articles | `feed` and `article` structure, names, positions and set size, `aria-busy`, Page Up/Down, Control+Home/End, and focus-safe loading |
| [Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) | Interactive tabular data or a composite layout | Grid/row/cell hierarchy, one composite tab stop, directional and boundary navigation, edit mode, selection, sorting, and virtual row/column metadata |
| [Landmarks](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/) | Major page regions | Native `header`, `nav`, `main`, `aside`, `footer`, `form`, and `section` semantics; unique labels for repeated banner, complementary, contentinfo, form, main, navigation, region, and search landmarks |
| [Link](https://www.w3.org/WAI/ARIA/apg/patterns/link/) | Navigation to a resource | Native anchor with `href`, accessible name, Enter activation, focus behavior, and no action-button misuse |
| [Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) | Single- or multi-select option list | Listbox/option hierarchy, name, one tab stop, arrows, Home/End, type-ahead, selection versus focus, and the chosen multi-select model |
| [Menu and Menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) | Application-style command menus | Do not use for ordinary site navigation; verify menu item roles, roving focus, arrows, Home/End, type-ahead, activation, Escape, popup state, disabled focusability, and checked items |
| [Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) | Button that opens a menu | Button and menu semantics, `aria-haspopup`, `aria-expanded`, optional `aria-controls`, Enter/Space and optional arrow opening; also review Menu |
| [Meter](https://www.w3.org/WAI/ARIA/apg/patterns/meter/) | Read-only bounded measurement | Native `meter` first, name, current/min/max/text values, and no interactive behavior |
| [Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) | Mutually exclusive choices | Native radios first, group name and description, one tab stop, Space, wrapping arrow selection, checked state, and toolbar variant |
| [Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) | Single adjustable value in a range | Native range input first, focusability, arrows, Home/End, optional Page keys, label, orientation, current/min/max/text values, and touch assistive-technology support |
| [Slider (Multi-Thumb)](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/) | Two or more values on one range | Apply Slider to every thumb; stable Tab order, distinct labels, constrained values, updated min/max relationships, and touch assistive-technology support |
| [Spinbutton](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/) | Editable discrete or ranged value | Native number input first, text editing, Up/Down, optional Page/Home/End, label, current/min/max/text values, and invalid state |
| [Switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) | On/off setting | Stable label, `switch` and `aria-checked`, Space, optional Enter, and group naming or description |
| [Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/) | Static tabular content | Native table first, table/row/header/cell hierarchy, name and description, spans, sorting, virtual row/column metadata, and normal Tab order only for interactive descendants |
| [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) | One visible panel selected from layered sections | Tablist/tab/tabpanel relationships, labels, selected state, one tab stop, orientation-aware arrows, Home/End, manual versus latency-safe automatic activation, optional deletion, and focus recovery |
| [Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) | Group of related controls | Named toolbar, one tab stop, orientation-aware arrows, optional Home/End, disabled-control focus policy, and key conflicts in nested widgets |
| [Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) | Non-interactive description on hover or focus | Trigger retains focus, tooltip remains available while needed, Escape dismisses, `tooltip` role, and `aria-describedby`; use a different pattern for interactive popups |
| [Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) | Hierarchical list | Tree/group/treeitem hierarchy, expanded state only on parents, one tab stop, directional open/close navigation, Home/End, type-ahead, selection model, set metadata, and focus/selection distinction |
| [Treegrid](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/) | Hierarchical interactive data grid | Treegrid/row/header/cell hierarchy, row expansion, directional and boundary navigation, edit mode, selection, sorting, and virtual row/column metadata |
| [Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) | Focusable separator that resizes panes | `separator`, label and controlled pane, current/min/max values, orientation arrows, Enter collapse/restore, and optional Home/End/F6; disclose that APG still marks this pattern as not fully reviewed and has no completed example |

## Shared review rules

- Review composed widgets against every dependency pattern, not only the outer container.
- Test every required key in every reachable state. Preserve standard text-editing keys inside editable controls.
- Verify focus and selection separately unless the pattern explicitly allows selection to follow focus.
- Verify visual state and exposed accessibility state remain synchronized after mouse, touch, keyboard, async, and programmatic changes.
- Check accessible names in the computed accessibility tree; visible text or an ARIA attribute alone does not prove the computed result.
- Check virtualized composites for accurate position, set size, row count, column count, and busy state.
- Treat warnings about touch assistive technologies, modal behavior, and incomplete APG patterns as review limitations, not footnotes to omit.
