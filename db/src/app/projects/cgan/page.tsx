import SideNav from "@/components/sidenav";

export default function ProjectPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-gray-900 text-white">
      <SideNav />
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-4">Conditional Generative Adversarial Network (cGAN)</h1>
        <div className="w-full h-[80vh] border border-gray-700 rounded-lg overflow-hidden">
          <iframe
            src="/projects/conditional_gan.html"
            className="w-full h-full"
            title="Jupyter Notebook Project"
          />
        </div>
      </div>
    </main>
  );
}