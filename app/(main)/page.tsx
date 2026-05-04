import Link from "next/link";
import {
  CalendarDays,
  FileText,
  Wallet,
  ReceiptText,
  GraduationCap,
  AlertCircle
} from "lucide-react";

export default function Home() {
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
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Quiosco
          </h1>

          <div className="w-12 h-1 bg-emerald-600 mb-8"></div>

          <p className="text-gray-600 mb-8">
            Selecciona una opción para continuar:
          </p>

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