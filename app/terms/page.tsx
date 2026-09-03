import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions | Cast War',
    description: 'Terms and conditions for participating in the Cast War platform.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[var(--color-off-white)] pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-[var(--color-brand-black)] uppercase tracking-tight">Terms & Conditions</h1>
                    <p className="text-[var(--color-muted-text)] font-medium text-lg">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-[var(--color-border-gray)] p-8 md:p-12 space-y-8 prose prose-gray max-w-none">
                    
                    <section>
                        <h2 className="text-2xl font-black text-[var(--color-brand-black)] mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 leading-relaxed">
                            By accessing and using Cast War, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[var(--color-brand-black)] mb-4">2. User Accounts</h2>
                        <p className="text-gray-600 leading-relaxed">
                            When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[var(--color-brand-black)] mb-4">3. War Points & Contributions</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Contributions made to boost a cast's ranking are non-refundable. War Points (WP) have no real-world monetary value outside of the Cast War ecosystem. The platform reserves the right to modify the conversion rate of WP in future updates.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[var(--color-brand-black)] mb-4">4. Code of Conduct</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Users agree to maintain a spirit of healthy competition. Hate speech, harassment, or malicious behavior aimed at individuals or communities will result in immediate account suspension.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[var(--color-brand-black)] mb-4">5. Modifications</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We reserve the right to modify or replace these Terms at any time. We will provide reasonable notice of any significant changes. Your continued use of the platform after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
