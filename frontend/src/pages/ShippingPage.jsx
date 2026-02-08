import React from 'react';

const ShippingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">Shipping & Returns Policy</h1>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">Shipping Policy</h2>
                    <p className="mb-4 text-gray-700">
                        At NewBuy, we strive to deliver your orders as quickly and efficiently as possible.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Processing Time:</strong> All orders are processed within 1-2 business days.</li>
                        <li><strong>Shipping Rates:</strong> We offer free shipping on all orders over ₹1000. For orders under ₹1000, a standard shipping fee of ₹100 applies.</li>
                        <li><strong>Delivery Estimates:</strong> Standard delivery takes 5-7 business days depending on your location.</li>
                        <li><strong>Tracking:</strong> Once your order is shipped, you will receive a tracking number via email/SMS.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">Return & Refund Policy</h2>
                    <p className="mb-4 text-gray-700">
                        We want you to be completely satisfied with your purchase. If you are not happy with your order, we are here to help.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Return Period:</strong> You can return items within 7 days of delivery.</li>
                        <li><strong>Condition:</strong> Items must be unused, unwashed, and in their original packaging with tags attached.</li>
                        <li><strong>Process:</strong> To initiate a return, please contact our support team or use the "My Orders" section in your account.</li>
                        <li><strong>Refunds:</strong> Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed within 5-7 business days.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">Contact Us</h2>
                    <p className="text-gray-700">
                        If you have any questions about our shipping or return policy, please contact us at:
                        <br />
                        <strong>Email:</strong> saifulislam.786452@gmail.com
                        <br />
                        <strong>Phone:</strong> +91 60033 59534
                    </p>
                </section>
            </div>
        </div>
    );
};

export default ShippingPage;
