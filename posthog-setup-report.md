<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the ScrollToll Next.js website (App Router, Next.js 14). PostHog is initialized client-side via a `PHProvider` component (the Next.js 14-compatible approach), wrapped around the root layout. A reverse proxy through `/ingest` routes all PostHog traffic through the same origin, keeping it compatible with the existing strict Content Security Policy (`connect-src 'self'`). A server-side `getPostHogClient()` helper powers event capture in the five API routes. Users are identified by their Firebase UID on the payment setup and success pages. Exception capture is enabled globally for client-side error tracking.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `waitlist_joined` | User submits their email on the home page waitlist form. | `src/app/page.tsx` |
| `payment_setup_viewed` | User lands on the payment setup page (top of the payment funnel). | `src/app/setup/SetupPageClient.tsx` |
| `payment_setup_started` | User clicks 'Set Up Payment - Stripe' to open the Stripe checkout flow. | `src/app/setup/SetupPageClient.tsx` |
| `payment_setup_completed` | User's Stripe payment setup is successfully confirmed and saved. | `src/app/setup/success/SetupSuccessClient.tsx` |
| `payment_update_started` | User clicks 'Update Payment Method' on the account page to swap their card. | `src/app/account/AccountPageClient.tsx` |
| `giving_paused` | User toggles off giving (pauses future Scroll Jar charges). | `src/app/account/AccountPageClient.tsx` |
| `giving_resumed` | User toggles giving back on after a pause. | `src/app/account/AccountPageClient.tsx` |
| `payment_removed` | User cancels and removes their saved payment method. | `src/app/account/AccountPageClient.tsx` |
| `invite_app_opened` | User clicks the deep-link button to open the ScrollToll app from an invite page. | `src/app/invite/[code]/InviteActions.tsx` |
| `payment_setup_session_created` | Stripe checkout session successfully created for initial payment setup. | `src/app/api/create-checkout-session/route.ts` |
| `payment_confirmed` | Payment method confirmed and stored after Stripe checkout completes. | `src/app/api/confirm-setup/route.ts` |
| `payment_cancelled` | User's payment method detached and removed from their account. | `src/app/api/cancel-payment/route.ts` |
| `giving_status_updated` | User's giving status toggled between paused and active via the API. | `src/app/api/update-payment/route.ts` |
| `payment_update_session_created` | Stripe checkout session created to allow user to swap their saved payment method. | `src/app/api/update-payment/route.ts` |

## New files created

- `src/app/providers.tsx` — `PHProvider` client component that initializes posthog-js and wraps the app
- `src/lib/posthog-server.ts` — `getPostHogClient()` factory for server-side posthog-node usage
- `src/app/invite/[code]/InviteActions.tsx` — client component for tracked invite deep-link button

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/507700/dashboard/1832928)
- **Payment setup funnel**: [https://us.posthog.com/project/507700/insights/Ct5rAwbk](https://us.posthog.com/project/507700/insights/Ct5rAwbk)
- **Waitlist signups**: [https://us.posthog.com/project/507700/insights/jZxOEMef](https://us.posthog.com/project/507700/insights/jZxOEMef)
- **Payments confirmed vs cancelled**: [https://us.posthog.com/project/507700/insights/IdlbYtbj](https://us.posthog.com/project/507700/insights/IdlbYtbj)
- **Giving paused vs resumed**: [https://us.posthog.com/project/507700/insights/eklyVrzM](https://us.posthog.com/project/507700/insights/eklyVrzM)
- **Invite link opens**: [https://us.posthog.com/project/507700/insights/WSF8gTHk](https://us.posthog.com/project/507700/insights/WSF8gTHk)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `posthog.identify()` — currently identify is only called during the initial payment setup flow. If users re-open the account page directly from the app (passing their uid via URL fragment), consider calling `posthog.identify(uid)` there too so returning sessions are linked.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
