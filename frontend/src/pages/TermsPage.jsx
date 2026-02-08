import React from 'react';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">Terms of Service</h1>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">1. Overview</h2>
                    <p className="text-gray-700">
                        This website is operated by SaiFlex. Throughout the site, the terms "we", "us" and "our" refer to SaiFlex. By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">2. Online Store Terms</h2>
                    <p className="text-gray-700">
                        By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">3. Accuracy of Billing and Account Information</h2>
                    <p className="text-gray-700">
                        We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">4. Contact Information</h2>
                    <p className="text-gray-700">
                        Questions about the Terms of Service should be sent to us at saifulislam.786452@gmail.com.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsPage;
