import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-gray-300">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* About Section */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">
                            NEW<span className="text-blue-500">BUY</span>
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Your one-stop destination for premium fashion. Quality products at affordable prices.
                        </p>
                        {/* Social Media */}
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                className="hover:text-blue-500 transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                                className="hover:text-pink-500 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                className="hover:text-blue-400 transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/category/men" className="hover:text-white transition-colors">Men</Link>
                            </li>
                            <li>
                                <Link to="/category/women" className="hover:text-white transition-colors">Women</Link>
                            </li>
                            <li>
                                <Link to="/category/accessories" className="hover:text-white transition-colors">Accessories</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <MapPin size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                                <span>123 Fashion Street, New Delhi, India - 110001</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="mr-2 flex-shrink-0" />
                                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="mr-2 flex-shrink-0" />
                                <a href="mailto:support@newbuy.com" className="hover:text-white transition-colors">
                                    support@newbuy.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="text-sm text-gray-400 text-center md:text-left">
                            © {new Date().getFullYear()} NewBuy. All rights reserved.
                        </div>
                        <div className="mt-4 md:mt-0">
                            <ul className="flex justify-center md:justify-end space-x-6 text-sm">
                                <li>
                                    <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
