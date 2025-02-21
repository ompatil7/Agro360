import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo1.png";

import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { FaAngleDown } from "react-icons/fa";

function NavigationBar() {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target))
            {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="sticky top-0 z-50 bg-white">
            <div className="border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center">
                                <img src={logo} className="h-14 w-auto" alt="Agro360 Logo" />
                                <span className="ml-4 text-2xl font-semibold text-gray-900">Agro360</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-10">
                            <Link to="/" className={`text-lg font-medium ${isActive("/") ? "text-gray-900" : "text-gray-500 hover:text-gray-900"}`}>
                                Home
                            </Link>
                            <Link to="/insurance" className={`text-lg font-medium ${isActive("/insurance") ? "text-gray-900" : "text-gray-500 hover:text-gray-900"}`}>
                                Insurances
                            </Link>
                            <Link to="/features" className={`text-lg font-medium ${isActive("/features") ? "text-gray-900" : "text-gray-500 hover:text-gray-900"}`}>
                                Features
                            </Link>
                            <Link to="/aboutus" className={`text-lg font-medium ${isActive("/aboutus") ? "text-gray-900" : "text-gray-500 hover:text-gray-900"}`}>
                                About Us
                            </Link>

                            {/* Greeting & Profile Section */}
                            {user && (
                                <div className="flex items-center space-x-4">
                                    {/* Notification Bell */}
                                    <button className="p-2 hover:bg-gray-100 rounded-full">
                                        <Bell className="h-5 w-5 text-gray-600" />
                                    </button>

                                    {/* Profile Dropdown */}
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={toggleDropdown}
                                            className="flex gap-4 items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            {user.photo !== "default.jpg" ? <img src={user.image} alt="Profile" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-gray-600 font-medium">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>}
                                            <span className="text-gray-700 text-lg">{user.name}</span>
                                            <FaAngleDown className="h-5 w-5 text-gray-600" />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isOpen && (
                                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 transform transition-all duration-200 ease-in-out">
                                                {/* User Info Section */}
                                                <div className="p-4 border-b border-gray-100">
                                                    <div className="flex items-center space-x-3">
                                                        {user.photo !== "default.jpg" ? <img src={user.image} alt="Profile" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <span className="text-gray-600 font-medium">
                                                                {user.name?.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>}
                                                        <div className="flex flex-col">
                                                            <span className="text-md font-medium text-gray-700">
                                                                {user.name}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {user.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="py-2">
                                                    <Link
                                                        to="/profile"
                                                        className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <User className="h-5 w-5" /> {/* Profile icon */}
                                                            <span>Profile</span>
                                                        </div>
                                                    </Link>

                                                    <button
                                                        onClick={logout}
                                                        className="block w-full text-left px-4 py-2 text-md text-red-600 hover:bg-gray-50 transition-colors duration-150"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <LogOut className="h-5 w-5" /> {/* Logout icon */}
                                                            <span>Logout</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {!user && (
                                <div className="flex items-center space-x-6">
                                    <Link to="/signin" className="text-lg font-medium text-gray-500 hover:text-gray-900">
                                        Sign in
                                    </Link>
                                    <Link to="/signup" className="text-lg font-medium text-gray-500 hover:text-gray-900">
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="block h-8 w-8" />
                                ) : (
                                    <Menu className="block h-8 w-8" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-4 pt-3 pb-4 space-y-2">
                            {user && (
                                <div className="py-4 border-b border-gray-200 mb-2">
                                    <div className="flex items-center space-x-3 px-3">
                                        <img
                                            src={user.photo !== "default.jpg" ? user.photo : "../../assets/default_avatar.jpg"}
                                            alt="Profile"
                                            className="h-12 w-12 rounded-full"
                                        />
                                        <div>
                                            <p className="text-lg font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Link to="/" className="block px-3 py-3 rounded-md text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                Home
                            </Link>
                            <Link to="/insurance" className="block px-3 py-3 rounded-md text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                Insurances
                            </Link>
                            <Link to="/features" className="block px-3 py-3 rounded-md text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                Features
                            </Link>
                            <Link to="/aboutus" className="block px-3 py-3 rounded-md text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                About Us
                            </Link>

                            {user ? (
                                <>
                                    <Link to="/profile" className="block px-3 py-3 rounded-md text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                        Profile
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-3 py-3 rounded-md text-lg font-medium text-red-600 hover:text-gray-900 hover:bg-gray-50"
                                    >
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/signin" className="block px-3 py-3 rounded-md text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                        Sign in
                                    </Link>
                                    <Link to="/signup" className="block px-3 py-3 rounded-md text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Add these styles at the bottom of the same file
    const styles = `
    @keyframes dropdownEnter {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes dropdownExit {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-8px);
        }
    }

    .dropdown-enter {
        animation: dropdownEnter 0.2s ease-out forwards;
    }

    .dropdown-exit {
        animation: dropdownExit 0.2s ease-out forwards;
    }
`;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

export default NavigationBar;
