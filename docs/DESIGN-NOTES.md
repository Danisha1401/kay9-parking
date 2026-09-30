# Kay9 Hydro Tech Parking — landing page notes

Static site. No build step, no dependencies. Open `index.html` or serve the folder.

```
index.html            all markup, including the inline SVG scene and the spec dialogs
css/style.css         tokens, layout, responsive rules
js/nav.js             header, dropdown, mobile menu, dialogs, enquiry form + file upload
js/hero.js            the looping hero illustration
js/services.js        the "Services we offer" scroller
assets/               logo SVGs, brochure PDF
assets/img/           photographs and drawings taken from KAY9.pdf
```

## Design system

All colours are CSS custom properties at the top of `css/style.css`. Every rule uses the
tokens, so light and dark mode differ only in the token blocks.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#faf9f5` warm paper | `#111110` | page background |
| `--bg-2` | `#f3f1ea` parchment | `#171715` | Services band, footer, hovers |
| `--surface` | `#ffffff` | `#1c1c1a` | cards, form, menus, dialogs |
| `--ink` / `--ink-2` / `--muted` | `#141413` / `#3d3c38` / `#6b6a63` | `#f3f2ed` / `#cfcdc5` / `#9c9a91` | text, strongest to weakest |
| `--line` / `--line-2` | `#e7e4db` / `#d6d2c6` | `#2a2a27` / `#3a3935` | hairlines, input borders |
| `--brand` | `#00B0F0` | same | the logo blue — decoration only (dots, icons, progress bar) |
| `--accent` | `#0a74b0` | `#4cc4f5` | the logo blue adjusted to pass contrast as text: labels, links, focus |
| `--btn-bg` | near-black | off-white | primary buttons invert with the theme |
| `--plate` | `#efede6` | `#e6e4dc` | behind product photos — stays light so the photos read in both themes |

- **Type:** Inter (headings 650 weight, tight negative tracking; body 17px) and JetBrains
  Mono for technical labels (eyebrows, "System 01 / 06", table headers). Loaded from
  Google Fonts; system fonts are the fallback.
- **Shape:** buttons 10px radius (rectangles, not pills), cards 24px, pill shapes only for
  the system tabs and the hero badge.
- **Section rhythm:** hero (paper) → Services (parchment) → Why Kay9 (dark tile) →
  Contact (paper) → footer (parchment).
- **Motion:** one easing curve (`--ease`), 150–250ms for interface feedback, 800ms for
  scroll reveals. Buttons press to 97%. Everything respects reduced-motion settings.

### Light / dark mode

The site follows the visitor's device setting. The sun/moon button in the header
overrides it and the choice is remembered (`localStorage` key `kay9-theme`). A small
script in `<head>` applies a saved choice before the page paints, so there is no flash
of the wrong theme; `js/nav.js` handles the button.

## The hero illustration

The SVG scene in the hero is stepped through the systems on a timer by `js/hero.js`:

| Step | System |
|---|---|
| 0 | empty plot |
| 1 | Two Level Two Post Stack |
| 2 | Three Level Stack |
| 3 | Four Post Pit Stack |
| 4 | Puzzle |
| 5 | Tower |
| 6 | Bike Stack |

Each SVG group whose `data-from` / `data-to` range covers the current step gets `.on`.
The five slides (stack, pit, puzzle, tower, bike), their captions and how long each step
is held are the `SLIDES` list at the top of `js/hero.js`. The animation pauses while it
is off screen or the tab is in the background, and holds still for visitors who have
reduced motion turned on.

## Services we offer

One large card per system (photo + write-up) in `.svc-track`, a native horizontal
scroller with scroll-snap, so swiping works without JavaScript. `js/services.js` adds the
system tabs, the "01 / 06" counter, the arrows and auto-scroll (5 s per card; it pauses
on hover, focus or touch, and for 12 s after a visitor picks a card). The current card is
full strength; the next one peeks in, dimmed. Links to `#two-level`, `#three-level`,
`#pit-stack`, `#puzzle`, `#tower` and `#bike` — the header dropdown and the footer —
scroll the page here and turn to that card.

The "Full specifications" buttons open the `<dialog class="spec">` pop-ups at the end of
`index.html`.

## Enquiry form

Posts to FormSubmit (`https://formsubmit.co/kay9hydrotechparking@gmail.com`) with
file uploads. Points to know:

- **Activation.** The first submission from the live site sends a confirmation email to
  kay9hydrotechparking@gmail.com. Nothing is delivered until the link in it is clicked.
- **Attachments.** DWG, DXF, PDF, JPG, PNG or ZIP, optional, 10 MB in total per enquiry
  (FormSubmit's limit). FormSubmit takes one file per input, so `js/nav.js` moves each
  chosen file into its own hidden input (`attachment-1`, `attachment-2`, …) on submit.
- **After sending** FormSubmit returns the visitor to the page with `?sent=1`, which
  shows a thank-you message under the form.
- The form only works when the site is served over http(s); opened as a local file it
  shows the phone number and email instead.
- To send to a different inbox, change the address in the form's `action`.

## Content rules

Every technical sentence, benefit list and dimension table is copied from the brochure
without alteration. Only headings and short link labels are new. Nothing about the
company's history, size or client list is stated anywhere, because the brochure does
not contain it.

## Still to be supplied by the client

1. **Projects / client list** — the old Projects gallery and the stats strip (year
   established, systems installed, cities served) were removed at the client's request.
   The installation photographs are still in `assets/img/install-*.jpg` if a gallery is
   wanted again.
