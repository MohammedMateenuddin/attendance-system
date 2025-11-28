import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[20%] w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[30%] w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 md:mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg">
          Live Attend
        </h1>

        <div className="grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-1 lg:text-left">
          <Link
            href="/professor"
            className="group rounded-xl border border-white/10 bg-white/5 px-6 py-6 md:px-8 md:py-8 transition-all hover:bg-white/10 hover:scale-105 hover:shadow-2xl backdrop-blur-md"
          >
            <h2 className="mb-3 text-2xl md:text-3xl font-semibold text-white group-hover:text-purple-300 transition-colors">
              Professor{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm text-gray-300 group-hover:text-white transition-colors mx-auto lg:mx-0">
              Create a secure session, track attendance in real-time, and export reports instantly.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
