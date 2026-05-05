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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
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

      await login(response.token);

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 sm:py-10 lg:bg-white lg:px-14 lg:py-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="w-full max-w-md rounded-2xl bg-white px-5 py-8 shadow-md sm:px-8 sm:py-10 lg:rounded-none lg:p-0 lg:shadow-none"
          >
            {/* LOGO SOLO EN MOBILE/TABLET */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Image
                src="/logo.png"
                alt="Flexus Electro"
                width={170}
                height={55}
                className="object-contain"
                priority
              />
            </div>

            <div className="mb-8 sm:mb-10">
              <p className="text-xs font-bold text-orange-500 uppercase tracking-wide sm:text-sm">
                Flexus Electro
              </p>

              <h1 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                Iniciar sesión
              </h1>

              <div className="mt-4 h-1 w-12 bg-[#009b63]" />

              <p className="mt-5 text-sm text-gray-500 sm:text-base">
                Ingresa tus credenciales para continuar.
              </p>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                  className={`w-full rounded-md border py-3 pl-12 pr-4 text-base outline-none transition sm:py-3 ${
                    errors.idempleado
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#009b63] focus:ring-2 focus:ring-green-100"
                  }`}
                />
              </div>

              {errors.idempleado?.message && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.idempleado.message}
                </p>
              )}
            </div>

            <div className="mb-7">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                  className={`w-full rounded-md border py-3 pl-12 pr-4 text-base outline-none transition sm:py-3 ${
                    errors.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#009b63] focus:ring-2 focus:ring-green-100"
                  }`}
                />
              </div>

              {errors.password?.message && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#009b63] cursor-pointer py-3 text-base font-bold text-white transition hover:bg-[#008554] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>

            <p className="mt-6 text-center text-xs text-gray-500 sm:text-sm">
              © {new Date().getFullYear()} Flexus Electro
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}