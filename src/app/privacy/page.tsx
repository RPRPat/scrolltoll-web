import Link from "next/link";

function LegalNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/70 px-5 py-4 backdrop-blur-md md:px-10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" className="font-heading text-xl font-bold tracking-widest">
          <span className="text-neon-green text-glow-green">SCROLL</span>
          <span className="text-hot-pink text-glow-pink">TOLL</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/#how-it-works"
            className="hidden text-sm text-white/50 transition-colors hover:text-white sm:inline"
          >
            How It Works
          </Link>
          <Link
            href="/#where-money-goes"
            className="hidden text-sm text-white/50 transition-colors hover:text-white sm:inline"
          >
            Transparency
          </Link>
          <Link
            href="/#faq"
            className="hidden text-sm text-white/50 transition-colors hover:text-white sm:inline"
          >
            FAQ
          </Link>
          <Link
            href="/#waitlist"
            className="inline-flex items-center gap-2 rounded-full border border-neon-green/30 px-4 py-2 text-sm font-bold text-neon-green transition-all hover:border-neon-green/60 hover:bg-neon-green/10 hover:shadow-[0_0_24px_rgba(57,255,20,0.25)]"
          >
            Join Waitlist &rarr;
          </Link>
        </div>
      </div>
    </nav>
  );
}

function LegalFooter() {
  return (
    <footer className="border-t border-white/5 px-6 py-12 text-center md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="font-heading text-2xl font-bold tracking-[0.2em] text-white">SCROLLTOLL</div>
        <p className="mt-4 text-sm text-gray-500">
          Turning screen time into impact. One toll at a time.
        </p>
        <p className="mt-3 text-sm text-gray-500">Pat &amp; Jon, Founders</p>
        <a
          href="mailto:hello@scrolltoll.me"
          className="mt-2 inline-block text-sm text-neon-green transition-colors hover:text-white"
        >
          hello@scrolltoll.me
        </a>
        <div className="mt-6 flex items-center justify-center gap-6">
          <Link href="/deck" className="text-xs text-gray-600 transition-colors hover:text-gray-400">
            For Investors
          </Link>
          <span className="text-gray-700">|</span>
          <Link href="/privacy" className="text-xs text-gray-600 transition-colors hover:text-gray-400">
            Privacy Policy
          </Link>
          <span className="text-gray-700">|</span>
          <Link href="/terms" className="text-xs text-gray-600 transition-colors hover:text-gray-400">
            Terms
          </Link>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-gray-500">
          &copy; 2026 ScrollToll. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-void text-white">
      <LegalNav />
      <section className="px-6 pt-32 pb-16 md:px-10">
        <div className="mx-auto max-w-[700px]">
          <Link href="/" className="text-sm text-neon-green transition-colors hover:text-white">
            &larr; Back to home
          </Link>
          <h1 className="mt-6 font-heading text-4xl font-bold text-neon-green sm:text-5xl">
            PRIVACY POLICY
          </h1>
          <p className="mt-3 text-sm text-gray-500">Last updated: March 16, 2026</p>

          <div className="mt-10 space-y-8 text-base leading-8 text-gray-300">
            <p>
              ScrollToll ("we", "us", "our") is operated by Rock Paper Reality, LLC. This Privacy
              Policy describes how we collect, use, and protect your information when you use the
              ScrollToll mobile application and website (scrolltoll.me).
            </p>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">INFORMATION WE COLLECT</h2>
              <h3 className="mt-6 font-heading text-xl font-semibold text-white">Account Information</h3>
              <p className="mt-2">
                When you create an account, we collect your email address through Apple Sign In or
                Google Sign In. We use this to identify your account and deliver tax receipts for
                your donations.
              </p>
              <h3 className="mt-6 font-heading text-xl font-semibold text-white">Screen Time Data</h3>
              <p className="mt-2">
                ScrollToll monitors your device screen time usage through Apple&apos;s Screen Time API
                (DeviceActivityFramework). This data stays on your device and is processed locally
                — we do not collect, transmit, or store your screen time data on our servers. We
                only know that a donation was triggered, not which apps you were using or for how
                long.
              </p>
              <h3 className="mt-6 font-heading text-xl font-semibold text-white">Payment Information</h3>
              <p className="mt-2">
                When you add a payment method, your card details are collected and processed by
                Stripe, our payment processor. We do not store your full card number. We retain
                only the last four digits and card brand for display purposes in the app. All
                payment processing is handled by Stripe in compliance with PCI DSS standards.
              </p>
              <p className="mt-4">
                Payment information is collected on our secure hosted payment page powered by
                Stripe. ScrollToll does not store, process, or have access to your full card
                number. Payment data is handled entirely by Stripe in compliance with PCI DSS
                standards. We store only a reference to your payment method (last four digits and
                card brand) for display purposes.
              </p>
              <h3 className="mt-6 font-heading text-xl font-semibold text-white">Donation Records</h3>
              <p className="mt-2">
                We record the date, amount, and recipient charity of each donation you make. This
                information is used to display your donation history, calculate impact metrics, and
                generate tax-related summaries.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">HOW WE USE YOUR INFORMATION</h2>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>To process charitable donations on your behalf</li>
                <li>To deliver tax receipts via our nonprofit giving partner</li>
                <li>To display your donation history and impact in the app</li>
                <li>To send you notifications related to your screen time limits and donations</li>
                <li>To improve the app experience and fix bugs</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">WHO WE SHARE DATA WITH</h2>
              <p className="mt-4">
                <strong className="text-white">Stripe:</strong> Payment processing. Stripe receives
                your card details to process charges. See Stripe&apos;s privacy policy at{" "}
                <a href="https://stripe.com/privacy" className="text-neon-green hover:text-white">
                  stripe.com/privacy
                </a>.
              </p>
              <p className="mt-4">
                <strong className="text-white">Our Change Foundation:</strong> Charitable donation
                disbursement and tax receipts. They receive the donation amount, charity
                selection, and your email so they can process the donation and issue tax receipts
                for your full donation amount.
              </p>
              <p className="mt-4">
                <strong className="text-white">No UK Entity Sharing:</strong> ScrollToll does not
                share donation-level personal data with Scroll Toll Ltd (UK). Donation processing
                records needed for charity disbursement and tax receipts are shared only with Our
                Change Foundation and payment data is handled by Stripe.
              </p>
              <p className="mt-4">
                <strong className="text-white">Firebase (Google):</strong> Authentication and
                analytics. Google receives your authentication credentials and basic app usage
                analytics. See Firebase&apos;s privacy policy at{" "}
                <a
                  href="https://firebase.google.com/support/privacy"
                  className="text-neon-green hover:text-white"
                >
                  firebase.google.com/support/privacy
                </a>.
              </p>
              <p className="mt-4">
                We do not sell your personal information to anyone. We do not share your data with
                advertisers.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">DATA RETENTION</h2>
              <p className="mt-4">
                We retain your account information and donation history for as long as your account
                is active. You can request deletion of your account and associated data by emailing{" "}
                <a href="mailto:hello@scrolltoll.me" className="text-neon-green hover:text-white">
                  hello@scrolltoll.me
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">YOUR RIGHTS</h2>
              <p className="mt-4">
                You may request access to, correction of, or deletion of your personal data at any
                time by contacting{" "}
                <a href="mailto:hello@scrolltoll.me" className="text-neon-green hover:text-white">
                  hello@scrolltoll.me
                </a>. California residents have additional rights under the CCPA. EU residents have
                additional rights under the GDPR.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">CHILDREN&apos;S PRIVACY</h2>
              <p className="mt-4">
                ScrollToll is not intended for children under 13. We do not knowingly collect
                personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">CHANGES TO THIS POLICY</h2>
              <p className="mt-4">
                We may update this Privacy Policy from time to time. We will notify you of material
                changes by posting the updated policy on this page with a revised "Last updated"
                date.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">CONTACT US</h2>
              <p className="mt-4">
                If you have questions about this Privacy Policy, contact us at:
                <br />
                <a href="mailto:hello@scrolltoll.me" className="text-neon-green hover:text-white">
                  hello@scrolltoll.me
                </a>
              </p>
              <p className="mt-4">
                Rock Paper Reality, LLC
                <br />
                San Diego, CA
              </p>
            </section>
          </div>
        </div>
      </section>
      <LegalFooter />
    </main>
  );
}
