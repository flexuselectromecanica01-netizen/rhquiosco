import Link from "next/link";
import { CalendarCheck, CalendarDays } from "lucide-react";

export default function MaestraLineaPage() {
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
        <div className="mb-8">
        
          <h1 className="mt-1 text-3xl font-bold text-gray-800">
            Maestra Línea
          </h1>

          <div className="mt-4 h-1 w-12 rounded-full bg-[#009b63]" />

          <p className="mt-6 text-gray-600">
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