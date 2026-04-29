"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Lock, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

type UpdatePasswordForm = {
  password: string;
  confirmPassword: string;
};

export default function Updatepassword() {
  const { token, cargarUsuario } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordForm>();

  const password = watch("password");

  const onSubmit: SubmitHandler<UpdatePasswordForm> = async (data) => {
    if (!token) {
      alert("Sesión expirada. Inicia sesión nuevamente.");
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:4008/api/login/update-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Error al actualizar contraseña");
        return;
      }

      await cargarUsuario(token);

      alert("Contraseña actualizada correctamente");
      router.replace("/");
    } catch (error) {
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
  <main className="min-h-screen bg-[#1f252b]">
    <section className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* FORMULARIO A LA IZQUIERDA */}
      <div className="min-h-screen flex items-center justify-center px-6 py-12 sm:px-10 lg:px-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <p className="text-sm font-bold text-orange-500 uppercase tracking-wide">
              Flexus Electro
            </p>

            <h1 className="text-3xl font-bold text-gray-800 mt-2">
              Cambiar contraseña
            </h1>

            <div className="w-12 h-1 bg-[#009b63] mt-4" />

            <p className="text-gray-500 mt-5">
              Esta actualización solo será necesaria la primera vez que
              inicies sesión.
            </p>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
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

          <div className="mb-7">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                className={`w-full border rounded-md pl-12 pr-4 py-3 outline-none transition
                  ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#009b63] focus:ring-2 focus:ring-green-100"
                  }`}
              />
            </div>

            {errors.confirmPassword?.message && (
              <p className="text-red-500 text-sm mt-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#009b63] text-white py-3 rounded-md font-bold hover:bg-[#008554] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            © {new Date().getFullYear()} Flexus Electro
          </p>
        </form>
      </div>

      {/* PANEL DERECHO */}
      <div className="hidden lg:flex relative bg-[#222831] min-h-screen items-center justify-center p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1f252b] via-[#26313a] to-[#111827]" />

        <div className="relative z-10 text-white max-w-md">
          <div className="mb-10">
            <div className="flex items-center gap-4">
              

              {/* Logo */}
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

          <h3 className="text-4xl font-bold leading-tight mb-4">
            Actualiza tu contraseña
          </h3>

          <div className="w-14 h-1 bg-[#009b63] mb-6" />

          <p className="text-gray-300 leading-relaxed">
            Por seguridad, antes de continuar debes crear una nueva contraseña
            para tu cuenta.
          </p>
        </div>
      </div>
    </section>
  </main>
);
}