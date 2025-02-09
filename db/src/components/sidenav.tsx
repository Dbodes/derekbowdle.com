"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-gray-800 rounded-lg"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 w-48 bg-gray-800 p-4 rounded-lg shadow-lg">
          <ul className="space-y-3">
            <li>
              <Link href="/" className="block p-2 hover:bg-gray-700 rounded">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="block p-2 hover:bg-gray-700 rounded">
                About
              </Link>
            </li>
            <li>
              <Link href="/projects" className="block p-2 hover:bg-gray-700 rounded">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/papers" className="block p-2 hover:bg-gray-700 rounded">
                Papers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block p-2 hover:bg-gray-700 rounded">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
