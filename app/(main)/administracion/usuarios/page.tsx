"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  puesto: string;
  departamento: string;
};

export default function Usuarios() {
  const inputExcelRef = useRef<HTMLInputElement | null>(null);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    puesto: "",
    departamento: "",
  });

  const limpiarFormulario = () => {
    setFormulario({
      nombre: "",
      correo: "",
      puesto: "",
      departamento: "",
    });
    setEditandoId(null);
  };

  const guardarUsuario = () => {
    if (!formulario.nombre || !formulario.correo) {
      alert("Nombre y correo son obligatorios");
      return;
    }

    if (editandoId !== null) {
      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === editandoId
            ? {
                ...usuario,
                ...formulario,
              }
            : usuario
        )
      );

      limpiarFormulario();
      return;
    }

    const nuevoUsuario: Usuario = {
      id: Date.now(),
      ...formulario,
    };

    setUsuarios((prev) => [...prev, nuevoUsuario]);
    limpiarFormulario();
  };

  const editarUsuario = (usuario: Usuario) => {
    setEditandoId(usuario.id);
    setFormulario({
      nombre: usuario.nombre,
      correo: usuario.correo,
      puesto: usuario.puesto,
      departamento: usuario.departamento,
    });
  };

  const eliminarUsuario = (id: number) => {
    const confirmar = confirm("¿Seguro que deseas eliminar este usuario?");

    if (!confirmar) return;

    setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
  };

  const importarExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];

    if (!archivo) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const hojaNombre = workbook.SheetNames[0];
      const hoja = workbook.Sheets[hojaNombre];

      const datos = XLSX.utils.sheet_to_json<Record<string, any>>(hoja);

      const usuariosImportados: Usuario[] = datos.map((fila, index) => ({
        id: Date.now() + index,
        nombre: fila.nombre || fila.Nombre || "",
        correo: fila.correo || fila.Correo || "",
        puesto: fila.puesto || fila.Puesto || "",
        departamento: fila.departamento || fila.Departamento || "",
      }));

      setUsuarios((prev) => [...prev, ...usuariosImportados]);
    };

    reader.readAsBinaryString(archivo);

    event.target.value = "";
  };

  return (
    <main className=" bg-gray-100 px-6 py-10">
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Usuarios
            </h1>
          </div>

          <div>
            <input
              ref={inputExcelRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={importarExcel}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => inputExcelRef.current?.click()}
              className="flex items-center gap-2 bg-[#009b63] text-white px-5 py-3 rounded-xl hover:bg-[#007f52] transition"
            >
              <Upload size={20} />
              Importar Excel
            </button>
            
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORMULARIO */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              {editandoId ? "Editar usuario" : "Nuevo usuario"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formulario.nombre}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      nombre: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009b63]"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Correo
                </label>
                <input
                  type="email"
                  value={formulario.correo}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      correo: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009b63]"
                  placeholder="correo@empresa.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Puesto
                </label>
                <input
                  type="text"
                  value={formulario.puesto}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      puesto: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009b63]"
                  placeholder="Ej. Auxiliar RH"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Departamento
                </label>
                <input
                  type="text"
                  value={formulario.departamento}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      departamento: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009b63]"
                  placeholder="Ej. Recursos Humanos"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={guardarUsuario}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#009b63] text-white px-4 py-3 rounded-xl hover:bg-[#007f52] transition"
                >
                  <Plus size={20} />
                  {editandoId ? "Guardar cambios" : "Agregar"}
                </button>

                {editandoId && (
                  <button
                    type="button"
                    onClick={limpiarFormulario}
                    className="px-4 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TABLA */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Lista de usuarios
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Total: {usuarios.length}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Correo
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Puesto
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Departamento
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {usuarios.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  ) : (
                    usuarios.map((usuario) => (
                      <tr
                        key={usuario.id}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-gray-800">
                          {usuario.nombre}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {usuario.correo}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {usuario.puesto}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {usuario.departamento}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => editarUsuario(usuario)}
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                              title="Editar"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={() => eliminarUsuario(usuario.id)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-2">
            Formato del Excel
          </h3>

          <p className="text-sm text-gray-600">
            El archivo debe tener columnas llamadas:
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">
              nombre
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">
              correo
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">
              puesto
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">
              departamento
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}