import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Save, User, Lock, AlertCircle } from 'lucide-react';

const Settings = () => {
    const { user, login } = useAuth(); // We might need to update global user state after change

    // Profile State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (password && password !== confirmPassword) {
            setMessage('Passwords do not match');
            setMessageType('error');
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.put('/auth/profile', {
                name,
                email,
                password: password || undefined, // Send undefined if empty to avoid hashing empty string
            });

            setMessage('Profile Updated Successfully');
            setMessageType('success');

            // Update local storage if needed, though Context should ideally handle this via a "refresh" or setAuth
            // For now, rely on response data
            localStorage.setItem('userInfo', JSON.stringify(data));
            // Trigger a reload or context update would be better, but sticking to simple flow
            // Actually, we should update the context. login() implementation updates state.
            // Let's manually update context if we had a setUser method expoed, but we don't. 
            // We can treat it as a silent re-login or just let the user know.

            setLoading(false);
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Update failed');
            setMessageType('error');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

            {message && (
                <div className={`p-4 rounded-md flex items-center ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    <AlertCircle size={20} className="mr-2" />
                    {message}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex items-center mb-6">
                    <User className="text-blue-500 mr-2" size={24} />
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Information</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                    </div>

                    <div className="pt-4 border-t dark:border-gray-700">
                        <div className="flex items-center mb-4">
                            <Lock className="text-blue-500 mr-2" size={20} />
                            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Change Password</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Leave blank to keep current"
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                        >
                            <Save size={18} className="mr-2" />
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
