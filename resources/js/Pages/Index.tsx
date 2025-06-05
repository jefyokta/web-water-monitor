import { useState } from "react";
import { ReactIcon } from "./../components/icon/react"

const Index = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Navbar */}
      <header className="w-full px-6 py-4 border-b border-slate-800 flex justify-between items-center backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-white">Oktaax</h1>
        <nav className="space-x-4">
          <a href="/" className="text-slate-400 hover:text-white transition">Home</a>
          <a href="https://github.com/jefyokta/oktaax/wiki" className="text-slate-400 hover:text-white transition">Docs</a>
          <a href="https://github.com/jefyokta/oktaax" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">GitHub</a>
        </nav>
      </header>

      <main className="flex-1 px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-extrabold text-white mb-4">
            🚀 Build Fast with Oktaax
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Minimalist PHP backend meets modern frontend with zero overhead. Powered by Swoole.
          </p>
          <div className="w-full flex my-10 justify-center">

            <ReactIcon />
          </div>
          <div className="my-8 border-b border-white/70 py-5">
            <button
              className="bg-white text-black cursor-pointer font-semibold px-6 py-3 rounded-xl hover:bg-slate-200 transition transform active:scale-95"
              onClick={() => setCounter((p) => p + 1)}
            >
              Clicked {counter} time{counter !== 1 && "s"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://github.com/jefyokta/oktaax/wiki"
              className="px-6 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-200 transition"
            >
              Get Started
            </a>
            <a
              href="https://github.com/jefyokta/oktaax"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg border border-slate-600 hover:bg-slate-800 transition"
            >
              GitHub Repo
            </a>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 w-full max-w-5xl px-4">
          {[
            {
              title: "Zero Overhead",
              desc: "No complex framework bloat. Just pure performance.",
            },
            {
              title: "Swoole Power",
              desc: "Async PHP backend with extreme speed and concurrency.",
            },
            {
              title: "Frontend Freedom",
              desc: "Bring your own frontend: React, Vue, Vanilla or anything.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-slate-800 rounded-xl border border-slate-700 shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-slate-600 py-6">
        © {new Date().getFullYear()} Oktaax Framework — All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
