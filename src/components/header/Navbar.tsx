"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { FaHome, FaInfoCircle, FaBriefcase } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import Identity from "./Identity";

interface NavLinkProps {
  href: string;
  icon: JSX.Element;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = memo(({ href, icon, children }) => (
  <Link
    href={href}
    className="flex items-center text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
  >
    {icon} <span className="ml-2">{children}</span>
  </Link>
));

// Add displayName for debugging
NavLink.displayName = "NavLink";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full p-4 flex items-center justify-between z-50 transform ${
        isScrolled
          ? "sticky top-0 bg-white/50 dark:bg-black/50 backdrop-blur-lg shadow-md text-gray-900 dark:text-gray-100"
          : "relative bg-white dark:bg-black text-gray-900 dark:text-gray-100 shadow-md"
      }`}
    >
      <div className="flex items-center space-x-8">
        <NavLink href="/" icon={<FaHome />}>Home</NavLink>
        <NavLink href="/experiences" icon={<FaBriefcase />}>Experiences</NavLink>
        <NavLink href="/about" icon={<FaInfoCircle />}>About</NavLink>
      </div>

      <div className="flex items-center space-x-4">
        <Identity />
        <ThemeToggle />
      </div>
    </nav>
  );
}
