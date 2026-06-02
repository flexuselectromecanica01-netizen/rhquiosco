"use client";

import { useEffect, useState } from "react";
import { Save, Users, Pencil, RefreshCw } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { SelectTabla } from "@/app/components/SelectTabla";
import { Th } from "@/app/components/Th";
import { Td } from "@/app/components/Td";

type Rol = "SUPERVISOR" | "EMPLEADO";
type Subrol = "MAESTRA" | "EMPLEADO";
type Bodega = "B1" | "B2";
type Linea =
  | "L1"
  | "L2"
  | "L3"
  | "L4"
  | "L5"
  | "L6"
  | "L7"
  | "L8"
  | "L9"
  | "L10"
  | "L11"
  | "L12"
  | "L13"
  | "L14" |
  "CALIDAD"

type Usuario = {
  id: number;
  idempleado: string;
  rol: Rol;
  subrol: Subrol;
  bodega: Bodega;
  linea: Linea;
};

const roles: Rol[] = ["SUPERVISOR", "EMPLEADO"];
const subroles: Subrol[] = ["MAESTRA", "EMPLEADO"];
const bodegas: Bodega[] = ["B1", "B2"];
const lineas: Linea[] = [
  "L1",
  "L2",
  "L3",
  "L4",
  "L5",
  "L6",
  "L7",
  "L8",
  "CALIDAD"
];

export default function SupervisorEmpleadosPage() {
  const { token } = useAuth();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [busquedaIdEmpleado, setBusquedaIdEmpleado] = useState("");
  const [cargando, setCargando] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);

  const registrosPorPagina = 5;

  const obtenerUsuarios = async () => {
    try {
      setCargando(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al obtener usuarios");
        return;
      }

      setUsuarios(data);
      setPaginaActual(1);
      setEditandoId(null);
    } catch (error) {
      alert("No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const actualizarUsuario = <K extends keyof Usuario>(
    id: number,
    campo: K,
    valor: Usuario[K]
  ) => {
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === id
          ? {
              ...usuario,
              [campo]: valor,
            }
          : usuario
      )
    );
  };

  const guardarCambios = async (usuario: Usuario) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/login/${usuario.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          rol: usuario.rol,
          subrol: usuario.subrol,
          bodega: usuario.bodega,
          linea: usuario.linea,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al guardar cambios");
      return;
    }

    setEditandoId(null);
    alert("Cambios guardados correctamente");
    await obtenerUsuarios();
  } catch (error) {
    alert("No se pudo conectar con el servidor");
  }
};

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.idempleado.includes(busquedaIdEmpleado.trim())
  );

  const totalPaginas = Math.ceil(
    usuariosFiltrados.length / registrosPorPagina
  );

  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = indiceInicial + registrosPorPagina;

  const usuariosPaginados = usuariosFiltrados.slice(
    indiceInicial,
    indiceFinal
  );

  const irPaginaAnterior = () => {
    setPaginaActual((prev) => Math.max(prev - 1, 1));
  };

  const irPaginaSiguiente = () => {
    setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));
  };

  return (
    <main className="bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold uppercase tracking-wide text-orange-500">
              Supervisor
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-800">
              Empleados
            </h1>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#009b63] text-white">
              <Users size={24} />
            </div>

            <div>
              <p className="text-xs text-gray-500">Total usuarios</p>
              <p className="text-xl font-bold text-gray-800">
                {usuarios.length}
              </p>
            </div>
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="w-full sm:max-w-sm">
                <label className="mb-1.5 block text-sm font-medium text-gray-600">
                  Buscar por número de empleado
                </label>

                <input
                  type="text"
                  value={busquedaIdEmpleado}
                  maxLength={4}
                  onChange={(e) => {
                    setBusquedaIdEmpleado(e.target.value.replace(/\D/g, ""));
                    setPaginaActual(1);
                  }}
                  placeholder="Ej. 0004"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#009b63] focus:ring-2 focus:ring-[#009b63]/20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={obtenerUsuarios}
                  disabled={cargando}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw size={16} />
                  {cargando ? "Cargando..." : "Actualizar"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBusquedaIdEmpleado("");
                    setPaginaActual(1);
                  }}
                  disabled={busquedaIdEmpleado.trim() === ""}
                  className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Mostrando {usuariosPaginados.length} de{" "}
              {usuariosFiltrados.length} usuarios
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <Th>ID</Th>
                  <Th>ID empleado</Th>
                  <Th>Rol</Th>
                  <Th>Subrol</Th>
                  <Th>Bodega</Th>
                  <Th>Línea</Th>
                  <Th align="right">Acciones</Th>
                </tr>
              </thead>

              <tbody>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No se encontraron usuarios.
                    </td>
                  </tr>
                ) : (
                  usuariosPaginados.map((usuario) => {
                    const editando = editandoId === usuario.id;

                    return (
                      <tr
                        key={usuario.id}
                        className="border-t border-gray-100 transition hover:bg-gray-50"
                      >
                        <Td>{usuario.id}</Td>

                        <Td>
                          <span className="font-semibold text-gray-800">
                            {usuario.idempleado}
                          </span>
                        </Td>

                        <Td>
                          <SelectTabla
                            value={usuario.rol}
                            disabled={true}
                            opciones={roles}
                            onChange={(value) =>
                              actualizarUsuario(usuario.id, "rol", value as Rol)
                            }
                          />
                        </Td>

                        <Td>
                          <SelectTabla
                            value={usuario.subrol}
                            disabled={!editando}
                            opciones={subroles}
                            onChange={(value) =>
                              actualizarUsuario(
                                usuario.id,
                                "subrol",
                                value as Subrol
                              )
                            }
                          />
                        </Td>

                        <Td>
                          <SelectTabla
                            value={usuario.bodega}
                            disabled={!editando}
                            opciones={bodegas}
                            onChange={(value) =>
                              actualizarUsuario(
                                usuario.id,
                                "bodega",
                                value as Bodega
                              )
                            }
                          />
                        </Td>

                        <Td>
                          <SelectTabla
                            value={usuario.linea}
                            disabled={!editando}
                            opciones={lineas}
                            onChange={(value) =>
                              actualizarUsuario(
                                usuario.id,
                                "linea",
                                value as Linea
                              )
                            }
                          />
                        </Td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            {!editando ? (
                              <button
                                type="button"
                                onClick={() => setEditandoId(usuario.id)}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                              >
                                <Pencil size={16} />
                                Editar
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => guardarCambios(usuario)}
                                  className="inline-flex items-center gap-2 rounded-xl bg-[#009b63] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#007f52]"
                                >
                                  <Save size={16} />
                                  Guardar
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    obtenerUsuarios();
                                    setEditandoId(null);
                                  }}
                                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Página {totalPaginas === 0 ? 0 : paginaActual} de {totalPaginas}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={paginaActual <= 1}
                onClick={irPaginaAnterior}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>

              <button
                type="button"
                disabled={paginaActual >= totalPaginas || totalPaginas === 0}
                onClick={irPaginaSiguiente}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
