"use client";

import { useForm } from "react-hook-form";
import { Lock, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUpdatePasswordSubmit } from "@/src/hooks/useUpdatePasswordSubmit";

type UpdatePasswordForm = {
  password: string;
  confirmPassword: string;
  aceptaAviso: boolean;
};

export default function Updatepassword() {
  const { onSubmit } = useUpdatePasswordSubmit();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordForm>();

  const password = watch("password");

  return (
    <main className="min-h-screen bg-[#1f252b]">
      <section className="grid min-h-screen w-full grid-cols-1 bg-white lg:grid-cols-2">
        {/* FORMULARIO A LA IZQUIERDA */}
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 sm:py-10 lg:bg-white lg:px-20 lg:py-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
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
              <p className="text-xs font-bold uppercase tracking-wide text-orange-500 sm:text-sm">
                Flexus Electro
              </p>

              <h1 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                Cambiar contraseña
              </h1>

              <div className="mt-4 h-1 w-12 bg-[#009b63]" />

              <p className="mt-5 text-sm text-gray-500 sm:text-base">
                Esta actualización solo será necesaria la primera vez que
                inicies sesión.
              </p>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Nueva contraseña
              </label>

              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  {...register("password", {
                    required: "La nueva contraseña es obligatoria",
                    minLength: {
                      value: 8,
                      message: "La contraseña debe tener mínimo 8 caracteres",
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d).+$/,
                      message: "Debe incluir al menos una mayúscula y un número",
                    },
                  })}
                  className={`w-full rounded-md border py-3 pl-12 pr-4 text-base outline-none transition ${
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

            <div className="mb-7">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Confirmar contraseña
              </label>

              <div className="relative">
                <CheckCircle
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  {...register("confirmPassword", {
                    required: "Confirma tu nueva contraseña",
                    validate: (value) =>
                      value === password || "Las contraseñas no coinciden",
                  })}
                  className={`w-full rounded-md border py-3 pl-12 pr-4 text-base outline-none transition ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#009b63] focus:ring-2 focus:ring-green-100"
                  }`}
                />
              </div>

              {errors.confirmPassword?.message && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="flex items-start gap-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  {...register("aceptaAviso", {
                    required:
                      "Debes aceptar el aviso de privacidad para continuar",
                  })}
                  className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#009b63]"
                />

                <span>
                  He leído y acepto el{" "}
                  <Link
                    href="/aviso-de-privacidad"
                    target="_blank"
                    className="font-semibold text-[#009b63] underline-offset-2 hover:underline"
                  >
                    Aviso de Privacidad
                  </Link>
                  .
                </span>
              </label>

              {errors.aceptaAviso?.message && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.aceptaAviso.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#009b63] py-3 text-base font-bold text-white transition hover:bg-[#008554] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
            </button>

            <p className="mt-6 text-center text-xs text-gray-500 sm:text-sm">
              © {new Date().getFullYear()} Flexus Electro
            </p>
          </form>
        </div>

        {/* PANEL DERECHO */}
        <div className="relative hidden min-h-screen items-center justify-center bg-[#222831] p-10 lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1f252b] via-[#26313a] to-[#111827]" />

          <div className="relative z-10 max-w-md text-white">
            <div className="mb-10">
              <div className="flex items-center gap-4">
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
            </div>

            <h3 className="mb-4 text-4xl font-bold leading-tight">
              Actualiza tu contraseña
            </h3>

            <div className="mb-6 h-1 w-14 bg-[#009b63]" />

            <p className="leading-relaxed text-gray-300">
              Por seguridad, antes de continuar debes crear una nueva contraseña
              para tu cuenta.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}