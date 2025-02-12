import SideNav from "@/components/sidenav";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <SideNav />
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">Projects</h1>
        <ul className="space-y-3">
            <li>
              <Link href="/projects/cgan" className="block p-2 hover:bg-gray-700 rounded">
                Conditional GAN
              </Link>
            </li>
            <li>
              <Link href="/projects/quantum" className="block p-2 hover:bg-gray-700 rounded">
                Quantum Hitting Times
              </Link>
            </li>
            <li>
              <Link href="/projects/hilbert" className="block p-2 hover:bg-gray-700 rounded">
                **UNDER CONSTRUCTION** 
                Audio to Image
              </Link>
            </li>
          </ul>
      </div>
    </main>
  );
}

