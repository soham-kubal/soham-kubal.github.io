# Résumé source

`resume.tex` is the source of truth for the downloadable résumé. Content mirrors
[`src/data/resume.ts`](../src/data/resume.ts) — if you update one, update the other.

## Rebuilding the PDF

Any LaTeX engine works. This was built with [Tectonic](https://tectonic-typesetting.github.io/)
(a self-contained engine — no system-wide TeX install needed, fetches packages on first use):

```bash
tectonic resume.tex
cp resume.pdf ../public/Soham_Kubal_Resume.pdf
```

Or with a regular TeX Live / MiKTeX install: `pdflatex resume.tex` (run twice if section
numbers/links look stale — not needed here since there's no ToC, but harmless).
