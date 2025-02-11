import SideNav from "@/components/sidenav";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <SideNav />
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome</h1>
        <p className="text-lg text-gray-300">
          I’m a Machine Learning Engineer passionate about AI, data science, and building automated
          intelligent systems that drive better outcomes with less resources. 
          This site showcases my projects, research, and insights into the world of machine learning and software development.
        </p>
      </div>
    </main>
  );
}

