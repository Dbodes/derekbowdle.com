"use client";

import { useState } from "react";
import SideNav from "@/components/sidenav";

const whitePapers = [
  { title: "Star GAN", file: "/pdfs/Image Translation for Time of Day Lighting Correction Using StarGAN.pdf", description: "Image Translation for Time of Day Lighting Correction Using StarGAN"},
  { title: "Quantum Walks", file: "/pdfs/Quantum Random Walks First Hitting Time.pdf" , description: "Quantum Random Walks First Hitting Time" },
  { title: "Healthcare", file: "/pdfs/HEALTHCARE CASE STANDARDS-BASED APPROACH TO CYBERSECURITY.pdf", description: "Healthcare Case: Standards-Based Approach to Cybersecurity" },
];




export default function WhitePapers() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <main className="min-h-screen p-6">
      <SideNav />
      <h1 className="text-3xl font-bold mb-6 text-center">White Papers</h1>
      <p className="text-lg text-gray-300 mb-6 text-center">
        Click on a white paper to expand and read it directly on this page.
      </p>

      <div className="space-y-4 max-w-3xl mx-auto">
        {whitePapers.map((paper, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow">
            <button
              className="w-full text-left flex justify-between items-center text-blue-400 hover:underline"
              onClick={() => setExpanded(expanded === index ? null : index)}
            >
              <span>{paper.title} - {paper.description}</span>
              <span>{expanded === index ? "▲" : "▼"}</span>
            </button>

            {expanded === index && (
              <div className="mt-4">
                {/* PDF Display - Works better on mobile */}
                <object
                  data={paper.file}
                  type="application/pdf"
                  className="w-full h-[500px] rounded-lg border border-gray-700 hidden sm:block"
                >
                  <p className="text-center text-gray-400 mt-2">
                    PDF preview is not available on mobile.{" "}
                    <a href={paper.file} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      Click here to download.
                    </a>
                  </p>
                </object>

                {/* Mobile fallback: Show a direct download link */}
                <div className="sm:hidden mt-2 text-center">
                  <a
                    href={paper.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Open PDF
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
