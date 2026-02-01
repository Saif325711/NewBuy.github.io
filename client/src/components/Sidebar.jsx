import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Products', path: '/products', icon: Package },
        { name: 'Orders', path: '/orders', icon: ShoppingCart },
        { name: 'Customers', path: '/customers', icon: Users },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between h-16 px-6 bg-blue-600 dark:bg-blue-900 text-white">
                    <span className="text-2xl font-bold tracking-wider">NewBuy</span>
                    <button onClick={toggleSidebar} className="lg:hidden text-white focus:outline-none">
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-8 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${isActive(item.path)
                                    ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <item.icon className="h-5 w-5 mr-3" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}

                    <button
                        onClick={logout}
                        className="w-full flex items-center px-4 py-3 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors duration-200 mt-8"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
