import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, Search, Sun, Moon, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-300 lg:hidden focus:outline-none focus:text-gray-700">
                    <Menu size={24} />
                </button>

                <div className="hidden md:flex ml-4 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Search className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
                        placeholder="Search..."
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 transition-colors">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 relative transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                            {user?.name || 'Admin'}
                        </span>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.email}</p>
                            </div>
                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Your Profile</Link>
                            <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</Link>
                            <button
                                onClick={logout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
