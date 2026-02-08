import React from 'react';
import { Mail, Phone, MapPin, User, CheckCircle } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

            {/* Left Side - Contact Info (Dark Theme) */}
            <div className="w-full md:w-1/3 bg-slate-900 text-white p-12 flex flex-col justify-center">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">
                        Sai<span className="text-blue-500">Flex</span>
                    </h1>
                    <p className="text-gray-400 text-sm tracking-widest uppercase">Premium Streetwear</p>
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-gray-400 text-sm font-bold uppercase mb-4 tracking-wider">Owner</h3>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-slate-800 rounded-lg">
                                <User className="text-blue-500" size={24} />
                            </div>
                            <div>
                                <p className="text-xl font-bold">Saiful Islam</p>
                                <p className="text-gray-400 text-sm">Founder & CEO</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-gray-400 text-sm font-bold uppercase mb-4 tracking-wider">Contact Details</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-4">
                                <Mail className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                                <a href="mailto:saifulislam.786452@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors">saifulislam.786452@gmail.com</a>
                            </li>
                            <li className="flex items-start space-x-4">
                                <Phone className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                                <a href="tel:+916003359534" className="text-gray-300 hover:text-blue-400 transition-colors">+91 60033 59534</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-gray-400 text-sm font-bold uppercase mb-4 tracking-wider">Warehouse Location</h3>
                        <div className="flex items-start space-x-4">
                            <MapPin className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                            <a href="https://www.google.com/maps/search/?api=1&query=House+No.+14,+Niribili+Path,+Birckuchi,+Narengi,+Guwahati,+Assam,+India" target="_blank" rel="noopener noreferrer" className="text-gray-300 leading-relaxed hover:text-blue-400 transition-colors">
                                House No. 14, Niribili Path,<br />
                                Birckuchi, Narengi,<br />
                                Guwahati, Assam, India.
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - content (Light Theme) */}
            <div className="w-full md:w-2/3 bg-white p-12 flex flex-col justify-center text-slate-900">
                <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 text-slate-900 leading-tight">
                        Quality Fashion <br />
                        <span className="text-blue-600">Accessible to All.</span>
                    </h2>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        At SaiFlex, we believe that style shouldn't come with a compromise.
                        Founded in 2024, we started with a simple mission: to bring premium quality streetwear to fashion enthusiasts across India.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <CheckCircle className="text-green-500 mr-2" size={20} />
                                Our Collection
                            </h3>
                            <ul className="space-y-2 text-gray-600 ml-7 list-disc">
                                <li>Trendy Baggy Jeans</li>
                                <li>Premium Cotton Hoodies</li>
                                <li>Graphic & Oversized T-Shirts</li>
                                <li>Traditional Panjabis</li>
                                <li>Stylish Accessories</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <CheckCircle className="text-green-500 mr-2" size={20} />
                                Why Choose Us?
                            </h3>
                            <ul className="space-y-2 text-gray-600 ml-7 list-disc">
                                <li>100% Original Quality Guarantee</li>
                                <li>Eco-friendly Packaging</li>
                                <li>Fast & Secure Shipping</li>
                                <li>7-Day Easy Returns</li>
                                <li>Customer-First Approach</li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-blue-800 italic font-medium">
                            "When I started SaiFlex, my passion was simple: to create a brand where quality meets affordability. Every piece you buy is personally curated to ensure it meets our high standards."
                        </p>
                        <p className="text-blue-600 font-bold mt-4 text-sm uppercase tracking-wide">
                            — Saiful Islam, Founder
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
