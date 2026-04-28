"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Lock, User } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

type LoginForm = {
  idempleado: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const res = await fetch("http://localhost:4008/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempleado: data.idempleado,
          password: data.password,
        }),
      });

      const response = await res.json();

      if (!res.ok) {
        toast.error(response.message || "Credenciales incorrectas");
        return;
      }

      await login(response.access_token);

      toast.success("Inicio de sesión correcto");

      if (response.usuario?.actualizarpassword) {
        router.push("/actualizar-password");
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.error("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="min-h-screen bg-[#1f252b]">
      <section className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
        {/* LADO IZQUIERDO */}
        <div className="hidden lg:flex relative bg-[#222831] min-h-screen items-center justify-center p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1f252b] via-[#26313a] to-[#111827]" />

          <div className="relative z-10 text-white">
            <div className="mb-10">
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Flexus Electro"
                  width={190}
                  height={60}
                  className="object-contain"
                  priority
                />
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
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
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
                ID empleado
              </label>

              <div className="relative">
                <User
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="0293"
                  {...register("idempleado", {
                    required: "El ID de empleado es obligatorio",
                    pattern: {
                      value: /^\d{4}$/,
                      message: "El ID debe tener exactamente 4 dígitos",
                    },
                  })}
                  className={`w-full border rounded-md pl-12 pr-4 py-3 outline-none transition ${
                    errors.idempleado
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#009b63] focus:ring-2 focus:ring-green-100"
                  }`}
                />
              </div>

              {errors.idempleado?.message && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.idempleado.message}
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
                  className={`w-full border rounded-md pl-12 pr-4 py-3 outline-none transition ${
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