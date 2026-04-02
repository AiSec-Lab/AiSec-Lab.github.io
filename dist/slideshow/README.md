# AiSec Lab Terminal Slideshow

This folder is intentionally standalone so the slideshow can be revised without touching the rest of the site.

Files:

- `index.html` builds the slideshow page shell.
- `styles.css` controls the terminal presentation look.
- `slides.js` builds the slide sequence and is the main place to edit wording or order.
- `script.js` handles typing, autoplay, and keyboard controls.

Data sources:

- `slides.js` pulls the intro from `../data/lab-intro.txt`.
- `slides.js` pulls the project list from `../data/projects.json`.

Quick edits:

1. Change slide wording or order in `slides.js`.
2. Update the autoplay timing by changing each slide `duration` in `slides.js`.
3. Update terminal behavior and controls in `script.js`.
