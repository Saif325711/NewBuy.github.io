import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">Privacy Policy</h1>
                <p className="text-gray-500 mb-6 text-sm text-center">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">1. Information We Collect</h2>
                    <p className="mb-4 text-gray-700">
                        We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Name, email address, phone number, and shipping/billing address.</li>
                        <li>Payment information (processed securely by Razorpay).</li>
                        <li>Order history and preferences.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">2. How We Use Your Information</h2>
                    <p className="mb-4 text-gray-700">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Process your orders and payments.</li>
                        <li>Communicate with you about your order status.</li>
                        <li>Send you promotional offers and newsletters (if subscribed).</li>
                        <li>Improve our website and customer service.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">3. Information Sharing</h2>
                    <p className="mb-4 text-gray-700">
                        We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who help us operate our business, such as:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Payment processors (Razorpay).</li>
                        <li>Shipping partners.</li>
                        <li>Email marketing services.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">4. Security</h2>
                    <p className="mb-4 text-gray-700">
                        We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">5. Contact Us</h2>
                    <p className="text-gray-700">
                        If you have any questions about this Privacy Policy, please contact us at:
                        <br />
                        <strong>Email:</strong> saifulislam.786452@gmail.com
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
