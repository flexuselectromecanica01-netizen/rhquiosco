"use client";

import { useEffect } from "react";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Mail, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

type UpdateEmailForm = {
  correoElectronico: string;
};

export default function UpdateEmail() {
  const params = useParams();
  const router = useRouter();

  const { usuario, loading } = useAuth();

  const idParam = params.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateEmailForm>({
    defaultValues: {
      correoElectronico: usuario?.correoElectronico ?? "",
    },
  });

  useEffect(() => {
    if (loading) return;

    if (!usuario) {
      router.replace("/login");
      return;
    }

    const idSesion = String(usuario.id);

    if (idParam !== idSesion) {
      router.replace(`/update-email/${idSesion}`);
    }
  }, [idParam, usuario, loading, router]);

  const onSubmit = async (data: UpdateEmailForm) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/login/${usuario?.id}/update-email`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correoElectronico: data.correoElectronico,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al actualizar el correo");
    }

    toast.success("Correo actualizado correctamente");

    router.back();
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Error al actualizar el correo"
    );
  }
};

  if (loading) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#1f252b]">
      <section className="grid min-h-screen w-full grid-cols-1 bg-white lg:grid-cols-2">
        {/* LEFT FORM */}
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 sm:py-10 lg:bg-white lg:px-20 lg:py-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md rounded-2xl bg-white px-5 py-8 shadow-md sm:px-8 sm:py-10 lg:rounded-none lg:p-0 lg:shadow-none"
          >
            {/* LOGO MOBILE/TABLET */}
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
                Actualiza tu correo
              </h1>

              <div className="mt-4 h-1 w-12 bg-[#009b63]" />
            </div>

            <div className="mb-7">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Nuevo correo electrónico
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  placeholder="correo@empresa.com"
                  {...register("correoElectronico", {
                    required: "El correo electrónico es obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Ingresa un correo electrónico válido",
                    },
                  })}
                  className={`w-full rounded-md border py-3 pl-12 pr-4 text-base outline-none transition ${
                    errors.correoElectronico
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#009b63] focus:ring-2 focus:ring-green-100"
                  }`}
                />
              </div>

              {errors.correoElectronico?.message && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.correoElectronico.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#009b63] py-3 text-base font-bold text-white transition hover:bg-[#008554] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Actualizando..." : "Actualizar correo"}
            </button>

            <p className="mt-6 text-center text-xs text-gray-500 sm:text-sm">
              © {new Date().getFullYear()} Flexus Electro
            </p>
          </form>
        </div>

        {/* RIGHT PANEL */}
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
              Actualiza tu correo
            </h3>

            <div className="mb-6 h-1 w-14 bg-[#009b63]" />

            <p className="text-sm leading-6 text-gray-300">
              Mantén actualizado tu correo electrónico para recibir información
              importante del sistema.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}