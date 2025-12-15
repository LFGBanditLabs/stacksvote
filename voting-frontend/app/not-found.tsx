'use client';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-white/90 mb-8">Page not found</p>
        <a
          href="/"
          className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-all"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
