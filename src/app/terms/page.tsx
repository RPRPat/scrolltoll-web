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

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-void text-white">
      <LegalNav />
      <section className="px-6 pt-32 pb-16 md:px-10">
        <div className="mx-auto max-w-[700px]">
          <Link href="/" className="text-sm text-neon-green transition-colors hover:text-white">
            &larr; Back to home
          </Link>
          <h1 className="mt-6 font-heading text-4xl font-bold text-neon-green sm:text-5xl">
            TERMS OF SERVICE
          </h1>
          <p className="mt-3 text-sm text-gray-500">Last updated: March 16, 2026</p>

          <div className="mt-10 space-y-8 text-base leading-8 text-gray-300">
            <p>
              Welcome to ScrollToll. By using our mobile application or website (scrolltoll.me),
              you agree to these Terms of Service. ScrollToll is operated by Rock Paper Reality,
              LLC (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
            </p>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">THE SERVICE</h2>
              <p className="mt-4">
                ScrollToll is a mobile application that monitors your screen time and facilitates
                charitable micro-donations when you exceed self-set limits. When you surpass your
                chosen screen time threshold, the app prompts you to make a small donation to a
                charity of your choice.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">ELIGIBILITY</h2>
              <p className="mt-4">
                You must be at least 18 years old to use ScrollToll. By using the app, you
                represent that you are at least 18 years of age and have the legal capacity to
                enter into these terms.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">ACCOUNT REGISTRATION</h2>
              <p className="mt-4">
                You may sign in using Apple Sign In or Google Sign In. You are responsible for
                maintaining the security of your account. You agree to provide accurate information
                and to update it as needed.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">DONATIONS AND PAYMENTS</h2>
              <p className="mt-4">
                <strong className="text-white">Voluntary nature:</strong> All donations made through
                ScrollToll are voluntary. You choose your donation amount and can skip any
                individual toll. ScrollToll does not automatically charge you without your knowledge
                — returning users with a card on file are shown a confirmation screen before any
                charge is processed.
              </p>
              <p className="mt-4">
                <strong className="text-white">Processing:</strong> Payments are processed by
                Stripe. By adding a payment method, you agree to Stripe&apos;s terms of service.
              </p>
              <p className="mt-4">
                <strong className="text-white">Platform fee:</strong> ScrollToll charges a
                platform fee equal to 7% of the donation amount, plus standard payment processing
                costs. These fees are charged to the donor separately, on top of the donation
                amount. 100% of the stated donation is delivered to the designated charity through
                Our Change Foundation. Your full donation amount is eligible for a tax receipt from
                Our Change Foundation. The platform fee and processing costs are not tax-deductible.
              </p>
              <p className="mt-4">
                <strong className="text-white">Disbursement:</strong> Charitable donations are
                processed through Our Change Foundation, not by ScrollToll directly. Tax receipts
                are provided by Our Change Foundation, not by ScrollToll.
              </p>
              <p className="mt-4">
                <strong className="text-white">Refunds:</strong> Because donations are made to
                third-party charitable organizations, refunds are generally not available once a
                donation has been processed and disbursed. If you believe a charge was made in
                error, contact us at{" "}
                <a href="mailto:hello@scrolltoll.me" className="text-neon-green hover:text-white">
                  hello@scrolltoll.me
                </a>{" "}
                within 7 days and we will investigate.
              </p>
              <p className="mt-4">
                <strong className="text-white">Tax deductibility:</strong> Donations made through
                ScrollToll may be tax-deductible to the extent permitted by law. Your full donation
                amount processed through Our Change Foundation is eligible for a tax receipt. The
                ScrollToll platform fee, payment processing costs, and any voluntary tips are not
                tax-deductible. ScrollToll does not provide tax advice. Consult a tax professional
                for guidance on your specific situation.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">DONATION PROCESSING</h2>
              <p className="mt-4">
                All donations are to Our Change Foundation (EIN: 86-3353394), a nonprofit Section
                501(c)(3) organization that makes grants to the nonprofits suggested by you here.
                Our Change Foundation (OCF) will not charge platform fees against the donations and
                will send the funds to the nonprofit suggested by you here unless (1) the suggested
                charity&apos;s public charity status with the Internal Revenue Service as an
                organization described in Section 501(c)(3) of the Internal Revenue Code has
                changed or has been revoked; or (2) the suggested Charity refuses to use the funds
                for those purposes described in Section 501(c)(3) of the Internal Revenue Code; or
                (3) Charity&apos;s registration to solicit charitable contributions with the
                California Attorney General&apos;s Office Registry of Charitable Trusts is not in
                good standing, which means that the registration is delinquent or suspended or
                revoked, or the charity is not otherwise prohibited from soliciting or operating in
                the state by the Attorney General. If OCF is unable to grant a donation to your
                suggested nonprofit, then OCF will choose a nonprofit that has a similar mission to
                your suggested charity and provide the donation to that charity. OCF will send the
                funds to the suggested nonprofit within 365 days of receiving the contribution. The
                maximum length of time it takes OCF to send the donation or a grant of the
                recommended donation to a recipient charity is 365 days.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">TIP JAR</h2>
              <p className="mt-4">
                ScrollToll offers an optional tipping feature that allows users to make voluntary
                payments to support the ScrollToll platform. Tips are payments to Scroll Toll, LLC,
                not charitable donations. Tips are not tax-deductible and are not processed through
                Our Change Foundation.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">SCREEN TIME MONITORING</h2>
              <p className="mt-4">
                ScrollToll uses Apple&apos;s Screen Time API (DeviceActivityFramework) to monitor
                your app usage. This monitoring occurs entirely on your device. You grant
                permission for this monitoring during onboarding, and you can revoke it at any time
                through your device&apos;s Settings.
              </p>
              <p className="mt-4">
                ScrollToll does not access, collect, or transmit the specific apps you use or your
                detailed usage patterns. We only detect when your cumulative usage exceeds the
                threshold you set.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">INTELLECTUAL PROPERTY</h2>
              <p className="mt-4">
                All content, design, trademarks, and code comprising ScrollToll are the property
                of Rock Paper Reality, LLC. You may not copy, modify, distribute, or
                reverse-engineer any part of the service.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">LIMITATION OF LIABILITY</h2>
              <p className="mt-4">
                ScrollToll is provided &quot;as is&quot; without warranties of any kind. We are not liable
                for any indirect, incidental, or consequential damages arising from your use of the
                service. Our total liability is limited to the amount you have paid through the app
                in the 12 months preceding any claim.
              </p>
              <p className="mt-4">
                We are not responsible for the operations, performance, or policies of third-party
                charities receiving your donations.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">TERMINATION</h2>
              <p className="mt-4">
                You may stop using ScrollToll at any time by deleting the app and revoking Screen
                Time permissions. We may suspend or terminate your account if you violate these
                terms.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">CHANGES TO TERMS</h2>
              <p className="mt-4">
                We may update these Terms from time to time. Continued use of ScrollToll after
                changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">GOVERNING LAW</h2>
              <p className="mt-4">
                These terms are governed by the laws of the State of California, without regard to
                conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-neon-green">CONTACT US</h2>
              <p className="mt-4">
                Questions about these Terms? Contact us at:
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
