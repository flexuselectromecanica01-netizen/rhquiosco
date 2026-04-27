"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock } from "lucide-react";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    console.log("Datos del login:", data);
  };

  return (
    <main className="min-h-screen bg-[#1f252b] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white shadow-2xl overflow-hidden">
        {/* LADO IZQUIERDO */}
        <div className="hidden lg:flex relative bg-[#222831] min-h-[560px] items-center justify-center p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1f252b] via-[#26313a] to-[#111827]" />

          <div className="relative z-10 text-white">
            <div className="mb-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#005b96] flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#9cc600]" />
                </div>

                <div>
                  <p className="text-orange-500 text-sm font-bold tracking-wide">
                    FLEXUS ELECTRO
                  </p>
                  <h2 className="text-3xl font-bold mt-1">
                    Portal interno
                  </h2>
                </div>
              </div>
            </div>

            <h3 className="text-4xl font-bold leading-tight mb-4">
              Bienvenido de nuevo
            </h3>

            <div className="w-14 h-1 bg-[#009b63] mb-6" />

          </div>
        </div>

        {/* FORMULARIO */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md"
          >
            <div className="mb-10">
              <p className="text-sm font-bold text-orange-500 uppercase tracking-wide">
                Flexus Electro
              </p>

              <h1 className="text-3xl font-bold text-gray-800 mt-2">
                Iniciar sesión
              </h1>

              <div className="w-12 h-1 bg-[#009b63] mt-4" />

              <p className="text-gray-500 mt-5">
                Ingresa tus credenciales para continuar.
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...register("email", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Ingresa un correo válido",
                    },
                  })}
                  className={`w-full border rounded-md pl-12 pr-4 py-3 outline-none transition
                    ${
                      errors.email
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#009b63] focus:ring-2 focus:ring-green-100"
                    }`}
                />
              </div>

              {errors.email?.message && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-7">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>

              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  placeholder="********"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener mínimo 6 caracteres",
                    },
                  })}
                  className={`w-full border rounded-md pl-12 pr-4 py-3 outline-none transition
                    ${
                      errors.password
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#009b63] focus:ring-2 focus:ring-green-100"
                    }`}
                />
              </div>

              {errors.password?.message && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#009b63] text-white py-3 rounded-md font-bold hover:bg-[#008554] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              © {new Date().getFullYear()} Flexus Electro
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}