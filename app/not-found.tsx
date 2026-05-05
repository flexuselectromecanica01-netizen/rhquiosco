// app/not-found.tsx

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#1f252b]">
      <section className="grid min-h-screen w-full grid-cols-2 bg-white">
        {/* CONTENIDO 404 - IZQUIERDA */}
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 sm:py-10 lg:bg-white lg:px-14 lg:py-12">
          <div className="w-full max-w-md text-center ">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#009b63] sm:text-sm">
              Error 404
            </p>

            <h1 className="mt-4 text-7xl font-extrabold text-gray-200 sm:text-8xl lg:text-9xl">
              404
            </h1>

            <h2 className="mt-6 text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
              Página no encontrada
            </h2>

            <div className="mx-auto mt-4 h-1 w-14 bg-[#009b63]" />

            <p className="mx-auto mt-6 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
              La página que estás buscando no existe, fue movida o no tienes
              acceso a ella.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex rounded-full bg-[#009b63] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#008554] active:scale-[0.99]"
            >
              Volver al inicio
            </Link>

            <p className="mt-8 text-center text-xs text-gray-500 sm:text-sm">
              © {new Date().getFullYear()} Flexus Electro
            </p>
          </div>
        </div>

        {/* LADO DERECHO */}
        <div className="relative flex min-h-screen items-center justify-center bg-[#222831] p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1f252b] via-[#26313a] to-[#111827]" />

          <div className="relative z-10 text-white">
            <div className="mb-10">
              <Image
                src="/logo.png"
                alt="Flexus Electro"
                width={190}
                height={60}
                className="object-contain"
                priority
              />
            </div>

            <h3 className="mb-4 text-3xl font-bold leading-tight lg:text-4xl">
              Página no encontrada
            </h3>

            <div className="mb-6 h-1 w-14 bg-[#009b63]" />

            <p className="max-w-md text-sm leading-6 text-gray-300">
              La ruta que intentas visitar no existe o fue movida.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}