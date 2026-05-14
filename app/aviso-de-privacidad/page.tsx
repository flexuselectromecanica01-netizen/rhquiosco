// app/aviso-de-privacidad/page.tsx

import Link from "next/link";
import Image from "next/image";

export default function AvisoDePrivacidad() {
  return (
    <main className="min-h-screen bg-[#1f252b]">
      <section className="grid min-h-screen w-full grid-cols-1 bg-white lg:grid-cols-2">
        {/* LADO IZQUIERDO */}
        <div className="relative hidden min-h-screen items-center justify-center bg-[#222831] p-10 lg:flex">
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
              Protección de datos personales
            </h3>

            <div className="mb-6 h-1 w-14 bg-[#009b63]" />

            <p className="max-w-md text-sm leading-6 text-gray-300">
              Este aviso explica cómo se utiliza la información dentro del
              sistema para procesos internos de recursos humanos.
            </p>
          </div>
        </div>

        {/* CONTENIDO AVISO - DERECHA */}
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 sm:py-10 lg:bg-white lg:px-14 lg:py-12">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-md sm:p-8 lg:max-h-[88vh] lg:overflow-y-auto lg:rounded-none lg:shadow-none">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#009b63] sm:text-sm">
              Flexus Electro
            </p>

            <h1 className="mt-4 text-3xl font-extrabold text-gray-800 sm:text-4xl">
              Aviso de Privacidad
            </h1>

            <div className="mt-4 h-1 w-14 bg-[#009b63]" />

            <p className="mt-6 text-sm leading-6 text-gray-600 sm:text-base">
              Flexus Electro, como responsable del tratamiento de datos
              personales, informa que los datos proporcionados por sus empleados
              serán utilizados únicamente para fines internos relacionados con
              la administración laboral, control de vacaciones, gestión de
              usuarios y procesos de recursos humanos.
            </p>

            <div className="mt-8 space-y-6 text-sm leading-6 text-gray-600 sm:text-base">
              <section>
                <h2 className="text-lg font-bold text-gray-800">
                  1. Datos personales que se pueden tratar
                </h2>

                <p className="mt-2">
                  Los datos personales tratados pueden incluir nombre completo,
                  número de empleado, área, puesto, fecha de ingreso,
                  antigüedad, días de vacaciones, solicitudes realizadas,
                  estatus de solicitudes, información de acceso al sistema y
                  datos necesarios para la administración interna.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-800">
                  2. Finalidades del tratamiento
                </h2>

                <p className="mt-2">
                  La información será utilizada para administrar solicitudes de
                  vacaciones, validar identidad de usuarios, asignar roles,
                  controlar permisos de acceso, dar seguimiento a procesos
                  internos de recursos humanos y mantener registros
                  administrativos relacionados con la relación laboral.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-800">
                  3. Uso interno de la información
                </h2>

                <p className="mt-2">
                  Los datos serán utilizados exclusivamente dentro de la empresa
                  y solo por personal autorizado. No serán compartidos con
                  terceros, salvo que exista una obligación legal, requerimiento
                  de autoridad competente o necesidad administrativa relacionada
                  con la operación laboral.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-800">
                  4. Seguridad de la información
                </h2>

                <p className="mt-2">
                  El sistema cuenta con mecanismos de acceso mediante
                  credenciales personales. Cada usuario es responsable de
                  mantener la confidencialidad de su contraseña y de utilizar la
                  plataforma únicamente para los fines autorizados.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-800">
                  5. Derechos del titular
                </h2>

                <p className="mt-2">
                  El titular de los datos personales podrá solicitar el acceso,
                  rectificación, cancelación u oposición respecto al tratamiento
                  de sus datos personales, conforme a los procedimientos
                  internos establecidos por la empresa.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-800">
                  6. Aceptación
                </h2>

                <p className="mt-2">
                  Al utilizar este sistema, el usuario manifiesta haber leído y
                  entendido el presente Aviso de Privacidad, así como aceptar el
                  tratamiento de sus datos personales para las finalidades
                  descritas.
                </p>
              </section>
            </div>


            <p className="mt-8 text-center text-xs text-gray-500 sm:text-sm">
              © {new Date().getFullYear()} Flexus Electro
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}