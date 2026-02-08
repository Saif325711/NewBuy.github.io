import React from 'react';

const FAQPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">Frequently Asked Questions</h1>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">How do I place an order?</h3>
                        <p className="text-gray-600">Simply browse our products, add items to your cart, and proceed to checkout. You can pay via Razorpay (Cards/UPI) or Cash on Delivery.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">What is the estimated delivery time?</h3>
                        <p className="text-gray-600">Orders usually arrive within 5-7 business days depending on your location.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Do you accept returns?</h3>
                        <p className="text-gray-600">Yes, we accept returns within 7 days of delivery. The item must be unused and in original condition.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Is it safe to use my credit card?</h3>
                        <p className="text-gray-600">Yes, all payments are processed securely through Razorpay, a leading payment gateway.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">How can I track my order?</h3>
                        <p className="text-gray-600">Once shipped, you will receive a tracking number via SMS/Email. You can also track it in the "My Orders" section.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
