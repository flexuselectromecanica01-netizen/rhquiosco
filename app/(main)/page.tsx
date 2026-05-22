"use client";
import Link from "next/link";
import {
  CalendarDays,
  FileText,
  Wallet,
  ReceiptText,
  GraduationCap,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { usuario} = useAuth()
  const botones = [
    {
      titulo: "Vacaciones",
      href: "/vacaciones",
      icono: CalendarDays,
      disabled: false,
    },
    {
      titulo: "Trámites",
      href: "#",
      icono: FileText,
      disabled: true,
    },
    {
      titulo: "Caja de Ahorro",
      href: "#",
      icono: Wallet,
      disabled: true,
    },
    {
      titulo: "Nómina",
      href: "#",
      icono: ReceiptText,
      disabled: true,
    },
    {
      titulo: "Capacitación",
      href: "#",
      icono: GraduationCap,
      disabled: true,
    },
    {
      titulo: "Incidencias",
      href: "#",
      icono: AlertCircle,
      disabled: true,
    },
  ];

  return (
    <div className="flex flex-col bg-gray-100">

      {/* CONTENIDO */}
      <main className="flex-1 bg-gray-100 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-800">
        Quiosco
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

          {/* BOTONES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {botones.map((boton) => {
              const Icono = boton.icono;

              const contenido = (
                <>
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition ${
                      boton.disabled
                        ? "bg-gray-300"
                        : "bg-emerald-600 group-hover:scale-105"
                    }`}
                  >
                    <Icono
                      size={30}
                      className={boton.disabled ? "text-gray-500" : "text-white"}
                    />
                  </div>

                  <div>
                    <h2
                      className={`text-2xl font-bold ${
                        boton.disabled ? "text-gray-400" : "text-gray-800"
                      }`}
                    >
                      {boton.titulo}
                    </h2>
                  </div>
                </>
              );

              if (boton.disabled) {
                return (
                  <div
                    key={boton.titulo}
                    className="relative bg-white rounded-2xl p-8 min-h-44 shadow-sm flex flex-col justify-between opacity-60 cursor-not-allowed grayscale"
                  >
                    {contenido}

                    <div className="absolute inset-0 rounded-2xl bg-white/20"></div>
                  </div>
                );
              }

              return (
                <Link
                  key={boton.titulo}
                  href={boton.href}
                  className="bg-white rounded-2xl p-8 min-h-44 shadow-sm hover:shadow-lg hover:border-b-4 hover:border-emerald-600 transition-all duration-300 flex flex-col justify-between group"
                >
                  {contenido}
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      
    </div>
  );
}