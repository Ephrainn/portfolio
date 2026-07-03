# Portfolio — Ephraim Aseda Quarshie

A personal portfolio website built with HTML, CSS and JavaScript, plus a small PHP backend for email (PHPMailer). Live demo: https://myportfolio-eaq.vercel.app/

## Contents
- `index.html` — main site
- `style.css` — styles
- `script.js` — frontend JS
- `CV.docx` — downloadable CV (now linked correctly from `index.html`)
- `send_email.php` — backend email handler (uses PHPMailer)
- `PHPMailer-7.0.1/` — PHPMailer library
- `VERCEL_PHP_SETUP.md`, `QUICK_START.md`, `PHPMailer_Setup_Guide.md` — guides and docs

## Status: CV download issue — RESOLVED
The "Download CV" button previously pointed to `assets/CV.docx` while the file was at the repository root. I updated `index.html` so the button links to `CV.docx` at the repository root.

- Commit: `1dd8a5dc615fbaa36901be4f10aafc43882d9cf8`
- What changed: `index.html` download link updated from `assets/CV.docx` -> `CV.docx`.

If you prefer to keep all static assets in an `assets/` or `public/` folder, move `CV.docx` there and update `index.html` accordingly.

## Local development
1. Open `index.html` in a browser for a static preview.
3. If testing email locally, use a PHP server (PHP 8+ recommended):
   php -S localhost:8000
   Then open http://localhost:8000 in your browser.

## Email (send_email.php & PHPMailer)
- Do NOT commit SMTP usernames or passwords. Use environment variables or a server-side config file excluded by `.gitignore`.
- Configure PHPMailer in `send_email.php` to read credentials from environment variables (e.g., `getenv('SMTP_USER')`).
- Ensure `send_email.php`:
  - Validates and sanitizes input (name, email, message).
  - Uses TLS/SSL for SMTP (SMTPS or STARTTLS).
  - Implements rate limiting / spam protection (CAPTCHA recommended).
  - Returns safe error messages to users while logging details server-side.

See `PHPMailer_Setup_Guide.md` for more details.

## Deployment notes (Vercel)
- This project has `vercel.json`. Verify build & output settings in the Vercel dashboard.
- Ensure static files (like the CV) are included in the deployment output. If using a static framework that requires `public/`, move static assets accordingly.

## Security & privacy
- If the CV contains personal or sensitive data, confirm visibility settings for the deployed site and repository.
- Remove any credentials from the repo history if they were accidentally committed (consider using GitHub secret scanning and rotate credentials).

## Suggested next steps
- Option A (recommended): Keep the CV at the repository root (current state) OR move it to `assets/`/`public/` to centralize static assets.
- I can:
  - Move `CV.docx` into `assets/` and update `index.html` if you prefer that organization, OR
  - Do a line-by-line security review and hardening of `send_email.php` and create a secure patch.

If you'd like me to proceed with either action, tell me and I will create the commit and PR.

## License
Add your desired license here (e.g., MIT).