import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Cast War',
    description: 'Privacy policy and data handling for Cast War.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[var(--color-off-white)] pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-[var(--color-brand-black)] uppercase tracking-tight">Privacy Policy</h1>
                    <p className="text-[var(--color-muted-text)] font-medium text-lg">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-[var(--color-border-gray)] p-8 md:p-12 space-y-8 prose prose-gray max-w-none">
                    
                    <section>
                        <h2 className="text-2xl font-black text-[var(--color-brand-black)] mb-4">1. Information We Collect</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, password, and payment method details required for processing deposits.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[var(--color-brand-black)] mb-4">2. How We Use Your Information</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We use the information we collect to operate, maintain, and improve our platform. This includes processing your transactions, tracking leaderboard contributions, securing your account against fraud, and communicating with you regarding your activity or support requests.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[var(--color-brand-black)] mb-4">3. Data Sharing & Visibility</h2>
                        <p className="text-gray-600 leading-relaxed">
                            By default, your contributions and username may be visible on the public leaderboard. You have the option to make your contribution amounts private or remain completely anonymous when boosting a cast. We do not sell your personal data to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[var(--color-brand-black)] mb-4">4. Data Security</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We implement standard security measures designed to protect your information from unauthorized access or disclosure. However, no internet-based service can be completely secure, and we cannot guarantee the absolute security of your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[var(--color-brand-black)] mb-4">5. Contact Us</h2>
                        <p className="text-gray-600 leading-relaxed">
                            If you have any questions about this Privacy Policy or how your data is handled, please reach out to our support team through the ticketing system on your dashboard.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
