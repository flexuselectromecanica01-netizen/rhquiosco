import Image from "next/image";
import Link from "next/link";
import {
  User,
  CalendarDays,
  FileText,
  Wallet,
  ReceiptText,
  GraduationCap,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export default function Home() {
  const botones = [
    {
      titulo: "Vacaciones",
      href: "/vacaciones",
      icono: CalendarDays,
    },
    {
      titulo: "Trámites",
      href: "#",
      icono: FileText,
    },
    {
      titulo: "Caja de Ahorro",
      href: "#",
      icono: Wallet,
    },
    {
      titulo: "Nómina",
      href: "#",
      icono: ReceiptText,
    },
    {
      titulo: "Capacitación",
      href: "#",
      icono: GraduationCap,
    },
    {
      titulo: "Incidencias",
      href: "#",
      icono: AlertCircle,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

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

              return (
                <Link
                  key={boton.titulo}
                  href={boton.href}
                  className="bg-white rounded-2xl p-8 min-h-44 shadow-sm hover:shadow-lg hover:border-b-4 hover:border-emerald-600 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center mb-6 group-hover:scale-105 transition">
                    <Icono size={30} className="text-white" />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800">
                    {boton.titulo}
                  </h2>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      
    </div>
  );
}