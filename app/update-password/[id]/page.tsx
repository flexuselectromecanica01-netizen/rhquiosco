"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Lock, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { useUpdatePasswordSubmit } from "@/src/hooks/useUpdatePasswordSubmit";

type UpdatePasswordForm = {
  password: string;
  confirmPassword: string;
};

export default function UpdatePasswordPage() {
  const { onSubmit } = useUpdatePasswordSubmit();

  const params = useParams();
  const router = useRouter();

  const { usuario, loading } = useAuth();

  const idParam = params.id as string;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordForm>();

  const password = watch("password");

  useEffect(() => {
  if (loading) return;

  if (!usuario) {
    router.replace("/login");
    return;
  }

  const idSesion = String(usuario.id);

  if (idParam !== idSesion) {
    router.replace(`/update-password/${idSesion}`);
  }
}, [idParam, usuario, loading, router]);

  if (loading) {
    return null;
  }


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
                Actualiza tu contraseña
              </h1>

              <div className="mt-4 h-1 w-12 bg-[#009b63]" />

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
              <Image
                src="/logo.png"
                alt="Flexus Electro"
                width={190}
                height={60}
                className="object-contain"
                priority
              />
            </div>

            <h3 className="mb-4 text-4xl font-bold leading-tight">
              Actualiza tu contraseña
            </h3>

            <div className="mb-6 h-1 w-14 bg-[#009b63]" />

          </div>
        </div>
      </section>
    </main>
  );
}