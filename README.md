# Evan Wologodzew — portfolio

A minimal, static GitHub Pages portfolio. Project content lives in `projects.json`.

After editing the JSON, regenerate the project markup from PowerShell:

```powershell
./build.ps1
git diff --check
```

Commit both the JSON and generated `index.html`. Project rows and technical disclosures use native HTML and work without JavaScript. The generator HTML-escapes content and checks that technology icons exist.

Use `displayName` and `summary` for the compact index, `name` for the full title, and `problem`, `contribution`, and `outcome` for the case study. Longer supplied descriptions remain under Technical details. Only add repository, report, or demo links when the destination is confirmed.

Technology logo sources are documented in `assets/ICONS.md`.

## Blog

Posts live in `posts.json`, in display order. Add entries using this structure, then run `./build.ps1` and commit the regenerated HTML:

```json
{
  "id": "your-post-slug",
  "title": "Your post title",
  "date": "2026-11-12",
  "summary": "A short introduction for the collapsed row.",
  "tags": ["Data Science"],
  "paragraphs": ["First paragraph.", "Second paragraph."]
}
```

Dates use `YYYY-MM-DD`. Entries are sorted newest first and displayed in a timeline above projects. Content is plain text and is escaped during generation. Full entries use native disclosures and remain readable without JavaScript.
