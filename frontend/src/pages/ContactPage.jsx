import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">Contact Us</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <Phone className="w-8 h-8 mx-auto text-blue-600 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Phone</h3>
                        <p className="text-gray-600">+91 60033 59534</p>
                        <p className="text-gray-600">+91 60027 32572 (WhatsApp)</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <Mail className="w-8 h-8 mx-auto text-blue-600 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Email</h3>
                        <p className="text-gray-600">saifulislam.786452@gmail.com</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-center mb-8">
                    <MapPin className="w-8 h-8 mx-auto text-blue-600 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Address</h3>
                    <p className="text-gray-600">House No. 14, Niribili Path, Birckuchi, Narengi</p>
                    <p className="text-gray-600">Guwahati, Assam, India</p>
                </div>

                <form className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Send us a Message</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="Your Name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border h-32" placeholder="How can we help?"></textarea>
                    </div>
                    <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full" onClick={() => alert('Message sent (Demo)')}>Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
