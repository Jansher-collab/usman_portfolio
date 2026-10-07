# Muhammad Usman Khan — Portfolio (Next.js)

White + red themed portfolio, same layout/flow as the reference video
(scroll-scrubbed hero, About, Expertise, Skills, Projects, giant CONTACT).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Edit your content

Everything lives at the top of `app/page.js`:

- `WORDS` — the three hero headline/subtitle states that change as you scroll
- `EXPERTISE` — the 4 "what I do" cards
- `SKILLS` — the tech chip cloud
- `PROJECTS` — your 3 featured projects

Click the portrait (hero or About section) in the browser to upload your own
photo — it's stored in the browser's localStorage, no backend needed.

Update the email address and social links in the Contact section near the
bottom of `app/page.js`.

## Colors

Theme colors are defined in `tailwind.config.js` under `colors`:
- `paper` / `cream` — off-white backgrounds
- `red` / `red.dark` / `red.light` — accent
- `ink` — near-black text and the dark contact section

## Deploy

Works out of the box on Vercel: push to a GitHub repo and import it at
vercel.com/new, or run `npx vercel`.
