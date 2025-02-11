"use client";

import Image from "next/image";
import SideNav from "@/components/sidenav";

export default function About() {
  return (
    <section className="max-w-4xl mx-auto p-6 text-gray-200">
      <SideNav />
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Image
          src="/sing.jpg" // Replace with your profile image
          alt="Your Name"
          width={150}
          height={150}
          className="rounded-full border-4 border-gray-500"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Derek Bowdle</h1>
          <p className="text-lg text-gray-400">Machine Learning Engineer</p>
          <p className="text-lg text-gray-600">dkbowdle@gmail.com</p>
        </div>
      </div>

      <p className="mt-6 text-gray-300">
        I am a Machine Learning Engineer with a background in Python, deep learning, and data science. My experience includes building predictive models, optimizing neural networks, and deploying scalable ML solutions. I am passionate about solving real-world problems with AI and continuously improving model performance.
      </p>

      <p className="mt-4 text-gray-300">
        I have worked with frameworks such as TensorFlow, PyTorch, and Scikit-learn, and have experience with cloud computing and MLOps. Currently, I am focused on <em>infrared detector failure prediction</em>, applying CNNs and advanced statistical techniques to enhance manufacturing processes.
      </p>

      <p className="mt-4 text-gray-300">
        I am actively seeking new opportunities in machine learning engineering, where I can contribute my skills to innovative AI-driven projects. Feel free to connect with me!
      </p>

      <div className="mt-6 flex gap-4">
        <a
          href="https://github.com/Dbodes"
          target="_blank"
          className="text-gray-300 hover:text-gray-100 transition"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/derek-bowdle/"
          target="_blank"
          className="text-gray-300 hover:text-gray-100 transition"
        >
          LinkedIn
        </a>
        <a
          href="/pdfs/resume.pdf"
          target="_blank"
          className="text-gray-300 hover:text-gray-100 transition"
        >
          Resume
        </a>
      </div>
    </section>
  );
}
