# Kay9 Hydro Tech Parking — landing page notes

Static site. No build step, no dependencies. Open `index.html` or serve the folder.

```
index.html            all markup, including the inline SVG scene and the spec dialogs
css/style.css         tokens, layout, responsive rules
js/nav.js             header, dropdown, mobile menu, dialogs, gallery lightbox, form
js/scroll.js          the scroll-driven build sequence
assets/               logo SVGs, brochure PDF
assets/img/           photographs and drawings taken from KAY9.pdf
.claude/serve.js      local preview server only — not part of the website
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

## The build sequence

`.build-track` is seven viewports tall. `.stage` is pinned to the top of it, and each
seventh of the scrolled distance is one step:

| Step | System |
|---|---|
| 0 | empty plot |
| 1 | Two Level Two Post Stack |
| 2 | Three Level Stack |
| 3 | Four Post Pit Stack |
| 4 | Puzzle |
| 5 | Tower |
| 6 | Bike Stack |

`js/scroll.js` writes the current step to `data-step` on `.stage`, adds `.on` to the
matching panel, and adds `.on` to every SVG group whose `data-from` / `data-to` range
covers the step. To change what appears when, edit those two attributes in the markup —
no JavaScript changes needed.

The header menu and the dot rail link to `<span class="step-anchor">` elements, which
`layout()` positions at the centre of each step band, so a link lands on the right step.

Below 900px the stage becomes scene-on-top / copy-below; everything else is unchanged.

## Content rules

Every technical sentence, benefit list and dimension table is copied from the brochure
without alteration. Only headings and short link labels are new. Nothing about the
company's history, size or client list is stated anywhere, because the brochure does
not contain it.

## Still to be supplied by the client

1. **Stats strip** — year established, systems installed, cities served. Marked
   `[CLIENT TO CONFIRM]` in the markup.
2. **Projects** — real project names, locations and a client list, plus any further
   site photographs for the gallery.
3. **Enquiry form endpoint** — the form validates and is styled, but has no action URL.
   `js/nav.js` blocks submission and shows the phone number instead. To connect it:
   set `action="<endpoint>"` and `method="post"` on `<form id="enquiry">`, then delete
   its `data-demo="true"` attribute.
