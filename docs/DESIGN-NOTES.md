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

## Brand

Taken from the company brochure (`KAY9.pdf`).

| Token | Value | Where it comes from |
|---|---|---|
| `--blue` | `#00B0F0` | the logo blue, sampled from the brochure artwork |
| `--ink` | `#231f20` | brochure body text colour |
| `--yellow` | `#f2c200` | the pallet yellow in the installation photographs |
| headings | Georgia / Times serif | the brochure sets every heading in Times |

`assets/logo-mark.svg` and `assets/logo-wordmark.svg` are vector traces of the bitmap
logos embedded in the PDF, so they stay sharp at any size and can be recoloured.

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

One card per system in `.svc-track`, a native horizontal scroller with scroll-snap, so
swiping works without JavaScript. `js/services.js` adds the arrows, dots and auto-scroll
(5 s per card; it pauses on hover, focus or touch, and for 12 s after a visitor picks a
card). Links to `#two-level`, `#three-level`, `#pit-stack`, `#puzzle`, `#tower` and
`#bike` — the header dropdown and the footer — scroll the page here and turn to that
card. Cards per view: 3 on desktop, 2 below 1100px, 1 below 620px.

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
