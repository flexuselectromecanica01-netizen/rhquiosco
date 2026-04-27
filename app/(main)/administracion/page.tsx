import Link from "next/link";
import { Users, CalendarDays } from "lucide-react";

export default function Administracion() {
  const botones = [
    {
      titulo: "Usuarios",
      href: "/administracion/usuarios",
      icono: Users,
    },
    {
      titulo: "Administración Vacaciones",
      href: "/administracion/vacaciones",
      icono: CalendarDays,
    },
  ];

  return (
    <main className="bg-gray-100 px-6 py-10">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Administración
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {botones.map((boton) => {
            const Icono = boton.icono;

            return (
              <Link
                key={boton.titulo}
                href={boton.href}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-8 flex flex-col items-center justify-center text-center border border-gray-200 hover:border-[#009b63] group"
              >
                <Icono
                  size={48}
                  className="text-[#009b63] mb-4 group-hover:scale-110 transition"
                  strokeWidth={1.8}
                />

                <span className="text-xl font-semibold text-gray-800">
                  {boton.titulo}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}