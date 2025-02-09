import Link from "next/link";

const whitePapers = [
  { title: "Star GAN", file: "/pdfs/Image Translation for Time of Day Lighting Correction Using StarGAN.pdf" },
  { title: "Healthcare", file: "/pdfs/HEALTHCARE CASE STANDARDS-BASED APPROACH TO CYBERSECURITY.pdf" },
];

export default function WhitePapers() {
  return (
    <main className="min-h-screen p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">White Papers</h1>
      <p className="text-lg text-gray-300 mb-4">
        Here are some of my technical white papers on AI and machine learning.
      </p>
      <ul className="space-y-4">
        {whitePapers.map((paper, index) => (
          <li key={index} className="bg-gray-800 p-4 rounded-lg shadow">
            <Link
              href={paper.file}
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              {paper.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
