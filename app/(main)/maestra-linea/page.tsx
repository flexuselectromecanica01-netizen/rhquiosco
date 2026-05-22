"use client";
import Link from "next/link";
import { CalendarCheck, CalendarDays } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function MaestraLineaPage() {
  const{usuario} = useAuth()
  const opciones = [
    {
      titulo: "Autorización de Vacaciones",
      href: "/maestra-linea/autorizacion-vacaciones",
      icono: CalendarCheck,
    },
    {
      titulo: "Solicitar Vacaciones",
      href: "/maestra-linea/vacaciones",
      icono: CalendarDays,
    },
  ];

  return (
    <main className="bg-gray-100 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-800">
        Maestra Linea
      </h1>

      <div className="mt-3 h-1 w-14 rounded-full bg-emerald-600" />

      <p className="mt-6 text-sm font-medium text-gray-500">
        Bienvenido
      </p>

      <h2 className="mt-1 text-2xl font-bold text-gray-900">
        {usuario?.nombre}
      </h2>

      <div className="mt-3 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
        ID empleado: {usuario?.idempleado}
      </div>
    </div>

    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">
      {usuario?.nombre?.charAt(0) ?? "U"}
    </div>
  </div>

  <p className="mt-6 border-t border-gray-100 pt-5 text-gray-600">
    Selecciona una opción para continuar:
  </p>
</div>


        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {opciones.map((opcion) => {
            const Icono = opcion.icono;

            return (
              <Link
                key={opcion.titulo}
                href={opcion.href}
                className="group flex min-h-44 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:border-[#009b63] hover:shadow-lg"
              >
                <Icono
                  size={48}
                  className="mb-4 text-[#009b63] transition group-hover:scale-110"
                  strokeWidth={1.8}
                />

                <span className="text-xl font-semibold text-gray-800">
                  {opcion.titulo}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}