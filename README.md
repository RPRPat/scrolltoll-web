# ScrollToll Web

ScrollToll's marketing, invitation, payment setup, and account-management site.

## Environments

- Vercel Preview is staging. It must use Firebase `scrolltoll-staging`, Stripe test keys, and the staging PostHog project token.
- Vercel Production is production. Do not add live Stripe keys until the live-payment launch checklist has been approved.
- Never share a Firebase service-account key between staging and production.

Copy `.env.example` to `.env.local` for local work. Local environment files and the `.vercel` project link are intentionally ignored by Git.

## Verification

```bash
npm ci
npm run build
```

The repository is linked to Vercel project `rock-paper-reality1/scrolltoll-web`. Configure Preview and Production environment variables separately in Vercel before promoting a deployment.
