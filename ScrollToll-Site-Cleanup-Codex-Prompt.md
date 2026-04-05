# ScrollToll Website — Cleanup: Update Legal Copy + Remove Every.org References

## Context

The new hosted payment pages (`/setup`, `/account`, `/setup/success`) correctly reference Our Change Foundation and the 7% platform fee. However, the existing site pages still have outdated references. This prompt cleans those up.

---

## Task 1: Update Terms of Service (`/terms`)

Add the following paragraph to the Terms of Service page. This is the **exact required copy** from Our Change Foundation's official disclosure guide:

> All donations are to Our Change Foundation (EIN: 86-3353394), a nonprofit Section 501(c)(3) organization that makes grants to the nonprofits suggested by you here. Our Change Foundation (OCF) will not charge platform fees against the donations and will send the funds to the nonprofit suggested by you here unless (1) the suggested charity's public charity status with the Internal Revenue Service as an organization described in Section 501(c)(3) of the Internal Revenue Code has changed or has been revoked; or (2) the suggested Charity refuses to use the funds for those purposes described in Section 501(c)(3) of the Internal Revenue Code; or (3) Charity's registration to solicit charitable contributions with the California Attorney General's Office Registry of Charitable Trusts is not in good standing, which means that the registration is delinquent or suspended or revoked, or the charity is not otherwise prohibited from soliciting or operating in the state by the Attorney General. If OCF is unable to grant a donation to your suggested nonprofit, then OCF will choose a nonprofit that has a similar mission to your suggested charity and provide the donation to that charity. OCF will send the funds to the suggested nonprofit within 365 days of receiving the contribution. The maximum length of time it takes OCF to send the donation or a grant of the recommended donation to a recipient charity is 365 days.

Also add a clear section about ScrollToll's platform fee:

> ScrollToll charges a platform fee of 7% on each toll. This fee is retained by ScrollToll to cover operations and development. Only the remaining 93% constitutes the charitable contribution processed through Our Change Foundation. Only the charitable contribution portion is tax-deductible.

## Task 2: Update Privacy Policy (`/privacy`)

Add a section on payment data:

> Payment information is collected on our secure hosted payment page powered by Stripe. ScrollToll does not store, process, or have access to your full card number. Payment data is handled entirely by Stripe in compliance with PCI DSS standards. We store only a reference to your payment method (last four digits and card brand) for display purposes.

## Task 3: Search and Replace Every.org References

Search the entire codebase for any remaining references to "Every.org" or "every.org" and replace with "Our Change Foundation" or remove as appropriate.

Known locations from previous audit:
- `src/app/deck/page.tsx` — lines referencing Every.org in the pitch deck page
- Any marketing copy referencing "90/7/3 split" should be updated to reflect the current 93/7 split (93% donation, 7% platform fee)

Do NOT update the `/setup`, `/account`, or `/setup/success` pages — those are already correct.

## Task 4: Add FAQ Section to Website

Add a `/faq` page (or section on the home page) with the following, adapted from Our Change Foundation's disclosure guide:

**What is Our Change Foundation?**
Our Change Foundation is a 501(c)(3) donor-advised fund partner for our donation platform. They help distribute funds to charities across the United States.

**Where does my donation go?**
Your toll is split: 7% is a platform fee retained by ScrollToll, and 93% is a charitable donation processed through Our Change Foundation (EIN: 86-3353394) to your chosen nonprofit.

**Are my donations tax-deductible?**
The charitable donation portion (93% of your toll) is tax-deductible to the extent allowed by law. Tax receipts are issued by Our Change Foundation.

**How long until my charity receives the funds?**
Our Change Foundation disburses grants to charities within 365 days of receiving the contribution, though most disbursements happen much sooner (typically monthly).

**How do I get a tax receipt?**
Tax receipts are sent to the email associated with your ScrollToll account after each Scroll Jar charge is processed.

## Files to Modify

| File | Changes |
|------|---------|
| `src/app/terms/page.tsx` | Add OCF donation processing paragraph + platform fee disclosure |
| `src/app/privacy/page.tsx` | Add payment data handling section |
| `src/app/deck/page.tsx` | Replace Every.org references with Our Change Foundation |
| Any file with "Every.org" | Replace or remove |

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/faq/page.tsx` | FAQ page with donation/charity questions |

## Testing Checklist

1. `grep -r "every.org\|Every.org" src/` returns zero results
2. Terms of Service includes the full OCF disclosure paragraph
3. Privacy Policy includes payment data handling section
4. FAQ page renders correctly with all questions
5. Platform fee is consistently described as 7% across all pages
6. Build succeeds with no errors
