import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Save, Settings as SettingsIcon } from 'lucide-react';

const SettingsPage = () => {
    const [shippingCharge, setShippingCharge] = useState('');
    const [freeShippingThreshold, setFreeShippingThreshold] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get('/settings');
                setShippingCharge(data.shippingCharge);
                setFreeShippingThreshold(data.freeShippingThreshold);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/settings', {
                shippingCharge,
                freeShippingThreshold
            });
            setMessage('Settings updated successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update settings:', error);
            setMessage('Failed to update settings');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800 flex items-center">
                <SettingsIcon className="mr-2" /> Global Settings
            </h1>

            {message && (
                <div className={`p-4 mb-4 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={submitHandler} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Charge (INR)</label>
                        <input
                            type="number"
                            value={shippingCharge}
                            onChange={(e) => setShippingCharge(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Amount to charge for shipping if below threshold.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold (INR)</label>
                        <input
                            type="number"
                            value={freeShippingThreshold}
                            onChange={(e) => setFreeShippingThreshold(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Order value above which shipping is free.</p>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        <Save size={18} className="mr-2" />
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsPage;
