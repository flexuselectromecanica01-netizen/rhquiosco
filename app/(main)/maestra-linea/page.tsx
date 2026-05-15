import Link from "next/link";
import {
  CalendarCheck,
  Building2,
  BriefcaseBusiness,
} from "lucide-react";

export default function MaestraLineaPage() {
  const opciones = [
    {
      titulo: "Áreas",
      descripcion: "Administra las áreas disponibles para los empleados.",
      href: "/maestra-linea/areas",
      icono: Building2,
      disabled: false,
    },
    {
      titulo: "Puestos",
      descripcion: "Administra los puestos disponibles para los empleados.",
      href: "/maestra-linea/puestos",
      icono: BriefcaseBusiness,
      disabled: false,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-lg font-semibold uppercase tracking-wide text-orange-500">
            Administración
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-800">
            Maestra Línea
          </h1>

          <div className="mt-4 h-1 w-12 rounded-full bg-[#009b63]" />

          <p className="mt-6 text-gray-600">
            Selecciona una opción para continuar:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {opciones.map((opcion) => {
            const Icono = opcion.icono;

            const contenido = (
              <>
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full transition ${
                    opcion.disabled
                      ? "bg-gray-300"
                      : "bg-[#009b63] group-hover:scale-105"
                  }`}
                >
                  <Icono
                    size={30}
                    className={opcion.disabled ? "text-gray-500" : "text-white"}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      opcion.disabled ? "text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {opcion.titulo}
                  </h2>

                  <p
                    className={`mt-2 text-sm ${
                      opcion.disabled ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {opcion.descripcion}
                  </p>
                </div>
              </>
            );

            if (opcion.disabled) {
              return (
                <div
                  key={opcion.titulo}
                  className="relative flex min-h-44 cursor-not-allowed flex-col justify-between rounded-2xl bg-white p-8 opacity-60 shadow-sm grayscale"
                >
                  {contenido}
                  <div className="absolute inset-0 rounded-2xl bg-white/20" />
                </div>
              );
            }

            return (
              <Link
                key={opcion.titulo}
                href={opcion.href}
                className="group flex min-h-44 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-[#009b63] hover:shadow-lg"
              >
                {contenido}
              </Link>
            );
          })}
        </div>

        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <CalendarCheck
              size={48}
              className="mb-4 text-[#009b63]"
              strokeWidth={1.8}
            />

            <h2 className="text-2xl font-bold text-gray-800">
              Catálogos del sistema
            </h2>

            <p className="mt-2 max-w-xl text-sm text-gray-500">
              Desde esta sección puedes administrar la información base que se
              utiliza en los formularios, como áreas y puestos.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}