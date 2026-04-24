"use client";

export default function Vacaciones() {
  return (
    <section className="min-h-screen bg-gray-100 px-6 py-12">
        
      <div className="max-w-6xl mx-auto">
        {/* Título de página */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Mis Vacaciones
          </h1>

          <div className="w-12 h-1 bg-emerald-600"></div>

          <p className="text-gray-600 mt-6">
            Consulta tu información de vacaciones y realiza una nueva solicitud.
          </p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Columna izquierda */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Antigüedad
                </p>
                <p className="text-xl font-semibold text-gray-800">
                  ---
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Días que tiene derecho
                </p>
                <p className="text-xl font-semibold text-gray-800">
                  ---
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Saldo
                </p>
                <p className="text-xl font-semibold text-gray-800">
                  ---
                </p>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Fecha de ingreso
                </p>
                <p className="text-xl font-semibold text-gray-800">
                  ---
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Vigencia
                </p>
                <p className="text-xl font-semibold text-gray-800">
                  ---
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500 mb-1">
                  Último periodo de vacaciones
                </p>
                <p className="text-xl font-semibold text-gray-800">
                  ---
                </p>
              </div>
            </div>
          </div>

          {/* Botón */}
          <div className="mt-12 flex justify-center md:justify-end">
            <button className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-sm hover:bg-emerald-700 active:scale-95 transition">
              Solicitud de Vacaciones
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}