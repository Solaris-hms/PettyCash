// src/components/layout/TopBar.js
import React from 'react';
import { Menu, UserCircle } from 'lucide-react';

const TopBar = ({ onMenuClick, user }) => {
    return (
        <header className="sticky top-0 bg-white shadow-sm p-4 flex justify-between items-center z-10">
            {/* Hamburger menu button - only visible on mobile */}
            <button
                onClick={onMenuClick}
                className="text-slate-600 hover:text-blue-600 md:hidden"
                aria-label="Open sidebar"
            >
                <Menu size={24} />
            </button>
            
            {/* A placeholder for a page title or other content */}
            <div className="text-lg font-semibold text-slate-700">
                {/* This could be dynamically set based on the page */}
            </div>

            {/* User info on the right */}
            <div className="flex items-center">
                <span className="hidden sm:inline text-sm font-medium text-slate-600 mr-3">
                    {user?.name || 'Guest'}
                </span>
                <UserCircle className="text-slate-500" size={28} />
            </div>
        </header>
    );
};

export default TopBar;