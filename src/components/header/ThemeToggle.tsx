"use client";

import { useState, useEffect, useCallback } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const initialTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      setTheme(initialTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    if (typeof document !== 'undefined') {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);

      document.documentElement.classList.replace(theme, newTheme);

      const debounceTimer = setTimeout(() => {
        document.cookie = `theme=${newTheme}; path=/;`;
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center w-14 h-8 p-1 bg-gray-200 rounded-full dark:bg-gray-600 transition-colors duration-300"
      title={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div
        className={`flex items-center justify-center w-6 h-6 rounded-full transition-transform duration-300 transform ${
          theme === 'light' ? 'translate-x-0 bg-yellow-500' : 'translate-x-6 bg-gray-800'
        }`}
      >
        {theme === 'light' ? <FaSun className="text-white" /> : <FaMoon className="text-yellow-500" />}
      </div>
    </button>
  );
}
