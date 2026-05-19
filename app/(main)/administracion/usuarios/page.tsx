"use client";

import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Save,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import { formatearFecha } from "@/src/utils/formatearFecha";
import { Area, Puesto, Vacacione, VacacioneFormulario, VacacioneSinTurno } from "@/src/types/schemas";

const formularioInicial: VacacioneFormulario = {
  idempleado: "",
  nombre: "",
  tipoempleado: "",
  area: "",
  puesto: "",
  fechaingreso: "",
  antiguedad: 0,
  diasderecho: 0,
  iniciocicloactual: "",
  fincicloactual: "",
  proporcionaldevengado: "0.00",
  diastomados: 0,
  saldodisponible: "0.00",
  diasporvencer: 0,
  diasavencer: 0,
  semaforo: "",
  accionsugerida: "",
};

const crearFechaLocal = (fecha: string) => {
  const [year, month, day] = fecha.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatearFechaInput = (fecha: Date) => {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const sumarMeses = (fecha: Date, meses: number) => {
  const nuevaFecha = new Date(fecha);
  nuevaFecha.setMonth(nuevaFecha.getMonth() + meses);
  return nuevaFecha;
};

const sumarAnios = (fecha: Date, anios: number) => {
  const nuevaFecha = new Date(fecha);
  nuevaFecha.setFullYear(nuevaFecha.getFullYear() + anios);
  return nuevaFecha;
};

const calcularDiasVacacionesLey = (antiguedad: number) => {
  if (antiguedad <= 0) return 0;

  if (antiguedad === 1) return 12;
  if (antiguedad === 2) return 14;
  if (antiguedad === 3) return 16;
  if (antiguedad === 4) return 18;
  if (antiguedad === 5) return 20;

  if (antiguedad >= 6 && antiguedad <= 10) return 22;
  if (antiguedad >= 11 && antiguedad <= 15) return 24;
  if (antiguedad >= 16 && antiguedad <= 20) return 26;
  if (antiguedad >= 21 && antiguedad <= 25) return 28;
  if (antiguedad >= 26 && antiguedad <= 30) return 30;
  if (antiguedad >= 31 && antiguedad <= 35) return 32;

  return 32;
};

const calcularAntiguedad = (fechaIngreso: string, hoy = new Date()) => {
  const ingreso = crearFechaLocal(fechaIngreso);

  let antiguedad = hoy.getFullYear() - ingreso.getFullYear();

  const aniversarioEsteAnio = new Date(
    hoy.getFullYear(),
    ingreso.getMonth(),
    ingreso.getDate()
  );

  if (hoy < aniversarioEsteAnio) {
    antiguedad--;
  }

  return Math.max(antiguedad, 0);
};

const calcularMesesTranscurridos = (inicio: Date, hoy = new Date()) => {
  let meses =
    (hoy.getFullYear() - inicio.getFullYear()) * 12 +
    (hoy.getMonth() - inicio.getMonth());

  if (hoy.getDate() < inicio.getDate()) {
    meses--;
  }

  return Math.max(meses, 0);
};

const calcularDiasEntreFechas = (desde: Date, hasta: Date) => {
  const inicio = new Date(
    desde.getFullYear(),
    desde.getMonth(),
    desde.getDate()
  );

  const fin = new Date(
    hasta.getFullYear(),
    hasta.getMonth(),
    hasta.getDate()
  );

  const diferencia = fin.getTime() - inicio.getTime();

  return Math.max(Math.ceil(diferencia / (1000 * 60 * 60 * 24)), 0);
};

const calcularSemaforo = (saldoDisponible: number) => {
  if (saldoDisponible <= 0) return "SINSALDO";
  if (saldoDisponible <= 3) return "ATENCION";
  return "CONTROLADO";
};

const calcularVacacionesPorFechaIngreso = (fechaIngreso: string) => {
  if (!fechaIngreso) {
    return {
      antiguedad: 0,
      diasderecho: 0,
      iniciocicloactual: "",
      fincicloactual: "",
      proporcionaldevengado: "0.00",
      saldodisponible: "0.00",
      diasporvencer: 0,
      diasavencer: 0,
      semaforo: "",
    };
  }

  const ingreso = crearFechaLocal(fechaIngreso);
  const hoy = new Date();

  const fechaSeisMeses = sumarMeses(ingreso, 6);
  const antiguedad = calcularAntiguedad(fechaIngreso, hoy);

  let diasderecho = 0;
  let inicioCiclo: Date;
  let finCiclo: Date;

  if (hoy < fechaSeisMeses) {
    diasderecho = 0;
    inicioCiclo = fechaSeisMeses;
    finCiclo = sumarMeses(inicioCiclo, 4);
  } else if (antiguedad < 1) {
    diasderecho = 6;
    inicioCiclo = fechaSeisMeses;
    finCiclo = sumarMeses(inicioCiclo, 4);
  } else {
    diasderecho = calcularDiasVacacionesLey(antiguedad);
    inicioCiclo = sumarAnios(ingreso, antiguedad);
    finCiclo = sumarMeses(inicioCiclo, 5);
  }

  const proporcionaldevengado = calcularMesesTranscurridos(inicioCiclo, hoy);

  const saldoDisponible = diasderecho;
  const diasPorVencer = saldoDisponible;
  const diasAVencer = calcularDiasEntreFechas(hoy, finCiclo);
  const semaforo = calcularSemaforo(saldoDisponible);

  return {
    antiguedad,
    diasderecho,
    iniciocicloactual: formatearFechaInput(inicioCiclo),
    fincicloactual: formatearFechaInput(finCiclo),
    proporcionaldevengado: proporcionaldevengado.toFixed(2),
    saldodisponible: saldoDisponible.toFixed(2),
    diasporvencer: diasPorVencer,
    diasavencer: diasAVencer,
    semaforo,
  };
};



export default function ImportarVacacionesPage() {
  const inputExcelRef = useRef<HTMLInputElement | null>(null);
  const { token } = useAuth();

  const [detalleEmpleado, setDetalleEmpleado] = useState<any | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [cambiandoRol, setCambiandoRol] = useState(false);
  const [reseteandoPassword, setReseteandoPassword] = useState(false);
  const [busquedaIdEmpleado, setBusquedaIdEmpleado] = useState("");
  const [passwordTemporal, setPasswordTemporal] = useState("");

  const [areas, setAreas] = useState<Area[]>([]);
const [puestos, setPuestos] = useState<Puesto[]>([]);
const [cargandoCatalogos, setCargandoCatalogos] = useState(false);

  const [pagina, setPagina] = useState(1);
  const [limite, setLimite] = useState(5);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const [empleados, setEmpleados] = useState<VacacioneSinTurno[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [formulario, setFormulario] =
    useState<VacacioneFormulario>(formularioInicial);

    const obtenerCatalogos = async () => {
  try {
    setCargandoCatalogos(true);

    const [resAreas, resPuestos] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/area`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/PUESTO`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      }),
    ]);

    const dataAreas = await resAreas.json();
    const dataPuestos = await resPuestos.json();

    if (!resAreas.ok) {
      toast.error(dataAreas.message || "Error al obtener áreas");
      return;
    }

    if (!resPuestos.ok) {
      toast.error(dataPuestos.message || "Error al obtener puestos");
      return;
    }

    setAreas(dataAreas);
    setPuestos(dataPuestos);
  } catch (error) {
    toast.error("No se pudieron cargar áreas y puestos");
  } finally {
    setCargandoCatalogos(false);
  }
};

  const headersJson = () => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  };

  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setDetalleEmpleado(null);
    setRolSeleccionado("");
    setPasswordTemporal("");
  };

  const obtenerEmpleados = async (
  page = pagina,
  limit = limite,
  idempleado = busquedaIdEmpleado
) => {
  try {
    setCargando(true);

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (idempleado.trim() !== "") {
      params.append("idempleado", idempleado.trim());
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vacaciones/paginado?${params.toString()}`,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      }
    );

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.message || "Error al obtener empleados");
      return;
    }

    setEmpleados(result.data);
    setPagina(result.meta.page);
    setLimite(result.meta.limit);
    setTotalPaginas(result.meta.totalPages);
    setTotalRegistros(result.meta.total);
  } catch (error) {
    toast.error("No se pudo conectar con el servidor");
  } finally {
    setCargando(false);
  }
};

const buscarPorIdEmpleado = () => {
  obtenerEmpleados(1, limite, busquedaIdEmpleado);
};

const limpiarBusqueda = () => {
  setBusquedaIdEmpleado("");
  obtenerEmpleados(1, limite, "");
};

  useEffect(() => {
  obtenerEmpleados(1, 5);
  obtenerCatalogos();
}, []);

  const formatearFechaExcel = (valor: unknown): string => {
    if (!valor) return "";

    if (valor instanceof Date) {
      return valor.toISOString().split("T")[0];
    }

    if (typeof valor === "number") {
      const fecha = XLSX.SSF.parse_date_code(valor);

      if (!fecha) return "";

      const year = fecha.y;
      const month = String(fecha.m).padStart(2, "0");
      const day = String(fecha.d).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    return String(valor).trim();
  };

  const obtenerValor = (
    fila: Record<string, any>,
    claves: string[],
    valorDefault: any = ""
  ) => {
    for (const clave of claves) {
      if (fila[clave] !== undefined && fila[clave] !== null) {
        return fila[clave];
      }
    }

    return valorDefault;
  };

  const obtenerDetalleEmpleado = async (id: number) => {
    try {
      setCargandoDetalle(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vacaciones/detalle/${id}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al obtener detalle del empleado");
        return;
      }

      setDetalleEmpleado(data);
      setRolSeleccionado(data.login?.rol ?? "");
      setPasswordTemporal("");
    } catch (error) {
      toast.error("No se pudo conectar con el servidor");
    } finally {
      setCargandoDetalle(false);
    }
  };

  const cambiarRolEmpleado = async () => {
    if (!detalleEmpleado?.empleado?.idempleado) {
      toast.error("No hay empleado seleccionado");
      return;
    }

    if (!rolSeleccionado) {
      toast.error("Selecciona un rol");
      return;
    }

    try {
      setCambiandoRol(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/login/admin/${detalleEmpleado.empleado.idempleado}/rol`,
        {
          method: "PATCH",
          headers: headersJson(),
          body: JSON.stringify({
            rol: rolSeleccionado,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al cambiar rol");
        return;
      }

      toast.success("Rol actualizado correctamente");

      setDetalleEmpleado((prev: any) => ({
        ...prev,
        login: {
          ...prev.login,
          rol: data.login.rol,
        },
      }));
    } catch (error) {
      toast.error("No se pudo conectar con el servidor");
    } finally {
      setCambiandoRol(false);
    }
  };

  const resetearPasswordEmpleado = async () => {
    if (!detalleEmpleado?.empleado?.idempleado) {
      toast.error("No hay empleado seleccionado");
      return;
    }

    const confirmar = confirm(
      `¿Seguro que deseas restablecer la contraseña de ${detalleEmpleado.empleado.nombre}?`
    );

    if (!confirmar) return;

    try {
      setReseteandoPassword(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/login/admin/${detalleEmpleado.empleado.idempleado}/reset-password`,
        {
          method: "PATCH",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al restablecer contraseña");
        return;
      }

      toast.success("Contraseña restablecida correctamente");
      setPasswordTemporal(data.passwordTemporal);

      setDetalleEmpleado((prev: any) => ({
        ...prev,
        login: {
          ...prev.login,
          actualizarpassword: true,
        },
      }));
    } catch (error) {
      toast.error("No se pudo conectar con el servidor");
    } finally {
      setReseteandoPassword(false);
    }
  };

  const importarExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];

    if (!archivo) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;

      const workbook = XLSX.read(data, {
        type: "binary",
        cellDates: true,
      });

      const hojaNombre = workbook.SheetNames.includes("Vacaciones")
        ? "Vacaciones"
        : workbook.SheetNames[0];

      const hoja = workbook.Sheets[hojaNombre];

      const datos = XLSX.utils.sheet_to_json<Record<string, any>>(hoja, {
        defval: "",
      });

      const empleadosImportados: VacacioneSinTurno[] = datos.map(
        (fila, index) => {
          const idempleado = String(
            obtenerValor(fila, ["idempleado", "ID empleado", "IdEmpleado"], "")
          )
            .trim()
            .padStart(4, "0");

          return {
            id: Date.now() + index,
            idempleado,
            nombre: String(obtenerValor(fila, ["nombre", "Nombre"], "")).trim(),
            tipoempleado: String(
              obtenerValor(fila, ["tipoempleado", "Tipo empleado"], "")
            ).trim() as Vacacione["tipoempleado"],
            area: String(
              obtenerValor(fila, ["area", "Área", "Area"], "")
            ).trim(),
            puesto: String(obtenerValor(fila, ["puesto", "Puesto"], "")).trim(),
            fechaingreso: formatearFechaExcel(
              obtenerValor(fila, ["fechaingreso", "Fecha ingreso"], "")
            ),
            antiguedad: Number(
              obtenerValor(fila, ["antiguedad", "Antiguedad", "Antigüedad"], 0)
            ),
            diasderecho: Number(
              obtenerValor(fila, ["diasderecho", "Días derecho"], 0)
            ),
            iniciocicloactual: formatearFechaExcel(
              obtenerValor(
                fila,
                ["iniciocicloactual", "Inicio ciclo actual"],
                ""
              )
            ),
            fincicloactual: formatearFechaExcel(
              obtenerValor(fila, ["fincicloactual", "Fin ciclo actual"], "")
            ),
            proporcionaldevengado: Number(
              obtenerValor(
                fila,
                ["proporcionaldevengado", "Proporcional devengado"],
                "0.00"
              )
            ),
            diastomados: Number(
              obtenerValor(fila, ["diastomados", "Días tomados"], 0)
            ),
            saldodisponible: Number(
              obtenerValor(
                fila,
                ["saldodisponible", "Saldo disponible"],
                "0.00"
              )
            ),
            diasporvencer: Number(
              obtenerValor(fila, ["diasporvencer", "Días por vencer"], 0)
            ),
            diasavencer: Number(
              obtenerValor(fila, ["diasavencer", "Días a vencer"], 0)
            ),
            semaforo: String(
              obtenerValor(fila, ["semaforo", "Semaforo", "Semáforo"], "")
            ).trim() as Vacacione["semaforo"],
            accionsugerida: String(
              obtenerValor(fila, ["accionsugerida", "Acción sugerida"], "")
            ).trim(),
          };
        }
      );

      setEmpleados((prev) => [...empleadosImportados, ...prev]);
      toast.success("Excel cargado correctamente");
    };

    reader.readAsBinaryString(archivo);
    event.target.value = "";
  };

  const validarFormulario = () => {
    if (!formulario.idempleado || !formulario.nombre) {
      toast.error("ID empleado y nombre son obligatorios");
      return false;
    }

    if (formulario.idempleado.length !== 4) {
      toast.error("El ID empleado debe tener 4 dígitos");
      return false;
    }

    if (!formulario.tipoempleado) {
      toast.error("Selecciona el tipo de empleado");
      return false;
    }

    if (!formulario.semaforo) {
      toast.error("Selecciona el semáforo");
      return false;
    }

    return true;
  };

  const guardarEmpleado = async () => {
    if (!validarFormulario()) return;

    if (editandoId !== null) {
      const empleadoExistente = empleados.find((e) => e.id === editandoId);

      if (!empleadoExistente) return;

      const esEmpleadoDeBaseDeDatos =
        empleadoExistente.id && empleadoExistente.id < 1000000000000;

      if (esEmpleadoDeBaseDeDatos) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/vacaciones/${editandoId}`,
            {
              method: "PATCH",
              headers: headersJson(),
              body: JSON.stringify(formulario),
            }
          );

          const data = await res.json();

          if (!res.ok) {
            toast.error(data.message || "Error al actualizar empleado");
            return;
          }

          toast.success("Empleado actualizado correctamente");
          await obtenerEmpleados();
          await obtenerDetalleEmpleado(editandoId);
          return;
        } catch (error) {
          toast.error("No se pudo conectar con el servidor");
          return;
        }
      }

      setEmpleados((prev: VacacioneSinTurno[]) =>
  prev.map((empleado) =>
    empleado.id === editandoId
      ? {
          ...empleado,
          ...formulario,
          id: editandoId,
          proporcionaldevengado: Number(formulario.proporcionaldevengado),
          saldodisponible:Number(formulario.saldodisponible)
        }
      : empleado
  )
);

      toast.success("Registro actualizado localmente");
      limpiarFormulario();
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vacaciones`, {
        method: "POST",
        headers: headersJson(),
        body: JSON.stringify(formulario),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al crear empleado");
        return;
      }

      toast.success("Empleado creado correctamente");
      await obtenerEmpleados();
      limpiarFormulario();
    } catch (error) {
      toast.error("No se pudo conectar con el servidor");
    }
  };

  const editarEmpleado = async (empleado: VacacioneSinTurno) => {
    if (!empleado.id) return;

    setEditandoId(empleado.id);

    const { id, ...datosFormulario } = empleado;
  setFormulario({
  ...datosFormulario,
  proporcionaldevengado: String(datosFormulario.proporcionaldevengado),
  saldodisponible:String(formulario.saldodisponible)
});

    await obtenerDetalleEmpleado(empleado.id);
  };

  const eliminarEmpleado = async (empleado: VacacioneSinTurno) => {
    if (!empleado.id) return;

    if(empleado.idempleado==="0001"){
      toast.error("El usuario administrador principal no se puede eliminar")
      return
    }

    const confirmar = confirm("¿Seguro que deseas eliminar este registro?");

    if (!confirmar) return;

    const esEmpleadoDeBaseDeDatos = empleado.id < 1000000000000;

    if (!esEmpleadoDeBaseDeDatos) {
      setEmpleados((prev) => prev.filter((item) => item.id !== empleado.id));

      if (editandoId === empleado.id) {
        limpiarFormulario();
      }

      toast.success("Registro eliminado localmente");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vacaciones/${empleado.id}`,
        {
          method: "DELETE",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al eliminar empleado");
        return;
      }

      toast.success("Empleado eliminado correctamente");
      await obtenerEmpleados();

      if (editandoId === empleado.id) {
        limpiarFormulario();
      }
    } catch (error) {
      toast.error("No se pudo conectar con el servidor");
    }
  };

  const guardarImportadosEnBaseDatos = async () => {
    const importados = empleados.filter(
      (empleado) => empleado.id && empleado.id >= 1000000000000
    );

    if (importados.length === 0) {
      toast.error("No hay registros importados para guardar");
      return;
    }

    try {
      setGuardando(true);

      const payload = importados.map(({ id, ...empleado }) => empleado);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vacaciones/importar-json`,
        {
          method: "POST",
          headers: headersJson(),
          body: JSON.stringify({
            empleados: payload,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al guardar importados");
        return;
      }

      toast.success(
        `Importación finalizada. Creados: ${data.creados}, omitidos: ${data.omitidos}`
      );

      await obtenerEmpleados();
      limpiarFormulario();
    } catch (error) {
      toast.error("No se pudo conectar con el servidor");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold uppercase tracking-wide text-orange-500">
              Administración
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-800">
              Panel 
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Administra empleados, roles y recuperación de contraseña.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              ref={inputExcelRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={importarExcel}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => obtenerEmpleados()}
              disabled={cargando}
              className="flex items-center cursor-pointer justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={20} />
              {cargando ? "Cargando..." : "Actualizar"}
            </button>

            <button
              type="button"
              onClick={() => inputExcelRef.current?.click()}
              className="flex items-center justify-center cursor-pointer gap-2 rounded-xl bg-[#009b63] px-5 py-3 font-semibold text-white transition hover:bg-[#007f52]"
            >
              <Upload size={20} />
              Importar Excel
            </button>

            <button
              type="button"
              disabled={guardando}
              onClick={guardarImportadosEnBaseDatos}
              className="flex items-center cursor-pointer justify-center gap-2 rounded-xl bg-gray-800 px-5 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={20} />
              {guardando ? "Guardando..." : "Guardar importados"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Columna izquierda */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:sticky xl:top-6 xl:col-span-4 xl:self-start">
            <div className="mb-5 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editandoId ? "Editar empleado" : "Nuevo empleado"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Administra la información general del empleado.
              </p>
            </div>

            <div className="max-h-[80vh] space-y-4 overflow-y-auto pr-1">
              <InputTexto
                label="ID empleado"
                value={formulario.idempleado}
                maxLength={4}
                onChange={(value) =>
                  setFormulario({
                    ...formulario,
                    idempleado: value.replace(/\D/g, ""),
                  })
                }
                placeholder="0293"
                disabled={formulario.idempleado === "0001"}
              />

              <InputTexto
                label="Nombre"
                value={formulario.nombre}
                onChange={(value) =>
                  setFormulario({ ...formulario, nombre: value })
                }
                placeholder="Diego Trejo"
              />

              <SelectTexto
                label="Tipo empleado"
                value={formulario.tipoempleado}
                onChange={(value) =>
                  setFormulario({
                    ...formulario,
                    tipoempleado: value as Vacacione["tipoempleado"],
                  })
                }
                opciones={["SEMANAL", "QUINCENAL"]}
              />

              <SelectTexto
  label="Área"
  value={formulario.area}
  onChange={(value) =>
    setFormulario({ ...formulario, area: value })
  }
  opciones={areas.map((area) => area.area)}
  disabled={cargandoCatalogos}
/>

              <SelectTexto
  label="Puesto"
  value={formulario.puesto}
  onChange={(value) =>
    setFormulario({ ...formulario, puesto: value })
  }
  opciones={puestos.map((puesto) => puesto.puesto)}
  disabled={cargandoCatalogos}
/>

              <InputTexto
  label="Fecha ingreso"
  type="date"
  value={formulario.fechaingreso}
  onChange={(value) => {
    const calculo = calcularVacacionesPorFechaIngreso(value);

    setFormulario({
      ...formulario,
      fechaingreso: value,
      antiguedad: calculo.antiguedad,
      diasderecho: calculo.diasderecho,
      iniciocicloactual: calculo.iniciocicloactual,
      fincicloactual: calculo.fincicloactual,
      proporcionaldevengado: calculo.proporcionaldevengado,
      saldodisponible: calculo.saldodisponible,
      diasporvencer: calculo.diasporvencer,
      diasavencer: calculo.diasavencer,
      semaforo: calculo.semaforo as Vacacione["semaforo"],
    });
  }}
/>

              <InputNumero
                label="Antigüedad"
                value={formulario.antiguedad}
                disabled={true}
                onChange={(value) =>
                  setFormulario({ ...formulario, antiguedad: value })
                }
              />

              <InputNumero
                label="Días derecho"
                disabled={true}
                value={formulario.diasderecho}
                onChange={(value) =>
                  setFormulario({ ...formulario, diasderecho: value })
                }
              />

              <InputTexto
                label="Inicio ciclo actual"
                disabled={true}
                type="date"
                value={formulario.iniciocicloactual}
                onChange={(value) =>
                  setFormulario({ ...formulario, iniciocicloactual: value })
                }
              />

              <InputTexto
                label="Fin ciclo actual"
                 disabled={true}
                type="date"
                value={formulario.fincicloactual}
                onChange={(value) =>
                  setFormulario({ ...formulario, fincicloactual: value })
                }
              />

              <InputTexto
                label="Proporcional devengado"
                disabled={true}
                value={(formulario.proporcionaldevengado)}
                onChange={(value) =>
                  setFormulario({
                    ...formulario,
                    proporcionaldevengado: value,
                  })
                }
              />

              <InputNumero
                label="Días tomados"
                value={formulario.diastomados}
                onChange={(value) =>
                  setFormulario({ ...formulario, diastomados: value })
                }
                disabled={true}
              />

              <InputTexto
                label="Saldo disponible"
                 disabled={true}
                value={formulario.saldodisponible}
                onChange={(value) =>
                  setFormulario({ ...formulario, saldodisponible: value })
                }
              />

              <InputNumero
                label="Días por vencer"
                disabled={true}
                value={formulario.diasporvencer}
                onChange={(value) =>
                  setFormulario({ ...formulario, diasporvencer: value })
                }
              />

              <InputNumero
                label="Días a vencer"
                value={formulario.diasavencer}
                onChange={(value) =>
                  setFormulario({ ...formulario, diasavencer: value })
                }
                 disabled={true}
              />

              <SelectTexto
                label="Semáforo"
                value={formulario.semaforo}
                onChange={(value) =>
                  setFormulario({
                    ...formulario,
                    semaforo: value as Vacacione["semaforo"],
                  })
                }
                opciones={["CONTROLADO", "ATENCION", "SINSALDO"]}
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-600">
                  Acción sugerida
                </label>

                <textarea
                  value={formulario.accionsugerida}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      accionsugerida: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#009b63] focus:ring-2 focus:ring-[#009b63]/20"
                />
              </div>

              <div className="sticky bottom-0 bg-white pt-3">
                <div className="flex gap-3 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={guardarEmpleado}
                    className="flex flex-1 items-center cursor-pointer justify-center gap-2 rounded-xl bg-[#009b63] px-4 py-3 text-white transition hover:bg-[#007f52]"
                  >
                    <Plus size={20} />
                    {editandoId ? "Guardar cambios" : "Crear"}
                  </button>

                  {editandoId && (
                    <button
                      type="button"
                      onClick={limpiarFormulario}
                      className="rounded-xl border border-gray-300 px-4 py-3 text-gray-600 transition cursor-pointer hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Columna derecha */}
          <div className="space-y-6 xl:col-span-8">
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Empleados
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Mostrando {empleados.length} de {totalRegistros}
                  </p>
                </div>

                <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
                  Página {pagina} de {totalPaginas}
                </div>
              </div>

              <div className="border-b border-gray-200 bg-white px-6 py-4">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
    <div className="flex-1">
      <label className="mb-1.5 block text-sm font-medium text-gray-600">
        Buscar por ID empleado
      </label>

      <input
        type="text"
        value={busquedaIdEmpleado}
        maxLength={4}
        onChange={(e) =>
          setBusquedaIdEmpleado(e.target.value.replace(/\D/g, ""))
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            buscarPorIdEmpleado();
          }
        }}
        placeholder="Ej. 0001"
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#009b63] focus:ring-2 focus:ring-[#009b63]/20"
      />
    </div>

    <button
      type="button"
      onClick={buscarPorIdEmpleado}
      disabled={cargando}
      className="rounded-xl cursor-pointer bg-[#009b63] px-5 py-3 font-semibold text-white transition hover:bg-[#007f52] disabled:cursor-not-allowed disabled:opacity-60"
    >
      Buscar
    </button>

    <button
      type="button"
      onClick={limpiarBusqueda}
      disabled={cargando}
      className="rounded-xl border cursor-pointer border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Limpiar
    </button>
  </div>
</div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <Th>ID</Th>
                      <Th>Empleado</Th>
                      <Th>Tipo</Th>
                      <Th>Área</Th>
                      <Th>Ingreso</Th>
                      <Th>Días</Th>
                      <Th>Saldo</Th>
                      <Th align="right">Acciones</Th>
                    </tr>
                  </thead>

                  <tbody>
                    {empleados.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-6 py-10 text-center text-gray-500"
                        >
                          No hay empleados registrados.
                        </td>
                      </tr>
                    ) : (
                      empleados.map((empleado) => (
                        <tr
                          key={empleado.id}
                          className="border-t border-gray-100 transition hover:bg-gray-50"
                        >
                          <Td>{empleado.idempleado}</Td>

                          <Td>
                            <div className="min-w-[150px]">
                              <p className="font-semibold text-gray-800">
                                {empleado.nombre}
                              </p>
                              <p className="text-xs text-gray-500">
                                {empleado.area}
                              </p>
                            </div>
                          </Td>

                          <Td>{empleado.tipoempleado}</Td>
                          <Td>{empleado.area}</Td>
                          <Td>{formatearFecha(empleado.fechaingreso)}</Td>
                          <Td>{empleado.diasderecho}</Td>
                          <Td>
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                Number(empleado.saldodisponible) > 0
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {empleado.saldodisponible}
                            </span>
                          </Td>

                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => editarEmpleado(empleado)}
                                className="rounded-lg p-2 text-blue-600 transition cursor-pointer hover:bg-blue-50"
                                title="Editar"
                              >
                                <Pencil size={18} />
                              </button>

                              <button
                                type="button"
                                onClick={() => eliminarEmpleado(empleado)}
                                disabled={empleado.idempleado ==="0001"}
                                className={`rounded-lg p-2 transition cursor-pointer ${
    empleado.idempleado === "0001"
      ? "cursor-not-allowed text-gray-300"
      : "text-red-600 hover:bg-red-50"
  }`}
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

              <div className="flex flex-col gap-4 border-t border-gray-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Página {pagina} de {totalPaginas} — Total: {totalRegistros}
                </p>

                <div className="flex items-center gap-2">
                  <select
                    value={limite}
                    onChange={(e) => {
                      const nuevoLimite = Number(e.target.value);
                      setLimite(nuevoLimite);
                      obtenerEmpleados(1, nuevoLimite);
                    }}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#009b63]"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>

                  <button
                    type="button"
                    disabled={pagina <= 1 || cargando}
                    onClick={() => obtenerEmpleados(pagina - 1, limite)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Anterior
                  </button>

                  <button
                    type="button"
                    disabled={pagina >= totalPaginas || cargando}
                    onClick={() => obtenerEmpleados(pagina + 1, limite)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              {!editandoId ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Selecciona un empleado
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Presiona el botón de editar para mostrar aquí su
                      información y las herramientas de superadministrador.
                    </p>
                  </div>
                </div>
              ) : cargandoDetalle ? (
                <div className="flex min-h-[260px] items-center justify-center text-gray-500">
                  Cargando detalle...
                </div>
              ) : detalleEmpleado ? (
                <div className="space-y-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-500">
                        Panel SuperAdmin
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {detalleEmpleado.empleado.nombre}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        ID empleado: {detalleEmpleado.empleado.idempleado}
                      </p>
                    </div>

                    <span className="inline-flex w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                      {detalleEmpleado.login?.rol ?? "Sin rol"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <InfoCard
                      label="Área"
                      value={detalleEmpleado.empleado.area}
                    />
                    <InfoCard
                      label="Puesto"
                      value={detalleEmpleado.empleado.puesto}
                    />
                    <InfoCard
                      label="Tipo empleado"
                      value={detalleEmpleado.empleado.tipoempleado}
                    />
                    <InfoCard
                      label="Fecha ingreso"
                      value={formatearFecha(
                        detalleEmpleado.empleado.fechaingreso
                      )}
                    />
                    <InfoCard
                      label="Días derecho"
                      value={detalleEmpleado.empleado.diasderecho}
                    />
                    <InfoCard
                      label="Saldo disponible"
                      value={detalleEmpleado.empleado.saldodisponible}
                    />
                    <InfoCard
                      label="Días tomados"
                      value={detalleEmpleado.empleado.diastomados}
                    />
                    <InfoCard
                      label="Semáforo"
                      value={detalleEmpleado.empleado.semaforo}
                    />
                    <InfoCard
                      label="Actualizar contraseña"
                      value={
                        detalleEmpleado.login?.actualizarpassword ? "Sí" : "No"
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-500">
                        Acceso
                      </p>
                      <h4 className="mt-1 text-lg font-semibold text-gray-800">
                        Información de inicio de sesión
                      </h4>

                      <div className="mt-4 space-y-3">
                        <InfoRow
                          label="Usuario"
                          value={detalleEmpleado.empleado.idempleado}
                        />
                        <InfoRow
                          label="Contraseña inicial"
                          value={
                            detalleEmpleado.login?.passwordInicial ??
                            "Sin login"
                          }
                        />
                        <InfoRow
                          label="Estado"
                          value={
                            detalleEmpleado.login?.actualizarpassword
                              ? "Debe cambiar contraseña"
                              : "Contraseña actualizada"
                          }
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-500">
                        Administración de acceso
                      </p>
                      <h4 className="mt-1 text-lg font-semibold text-gray-800">
                        Rol y recuperación de contraseña
                      </h4>

                      <div className="mt-4 grid grid-cols-1 gap-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-600">
                            Rol del usuario
                          </label>

                          <select
                            value={rolSeleccionado}
                            onChange={(e) =>
                              setRolSeleccionado(e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#009b63]"
                          >
                            <option value="">Selecciona un rol</option>
                            <option value="EMPLEADO">Empleado</option>
                            <option value="SUPERVISOR">Supervisor</option>
                            <option value="ADMINISTRADOR">
                              Administrador
                            </option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={cambiarRolEmpleado}
                          disabled={cambiandoRol}
                          className="rounded-xl bg-[#009b63] px-5 py-3 font-semibold text-white transition hover:bg-[#007f52] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {cambiandoRol ? "Guardando rol..." : "Guardar rol"}
                        </button>

                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="text-sm text-gray-500">
                            Recuperación de contraseña
                          </p>

                          <p className="mt-2 text-sm font-medium text-gray-700">
                            Usuario: {detalleEmpleado.empleado.idempleado}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Al restablecer, el usuario deberá cambiar su
                            contraseña al iniciar sesión.
                          </p>

                          <button
                            type="button"
                            onClick={resetearPasswordEmpleado}
                            disabled={reseteandoPassword}
                            className="mt-4 w-full rounded-xl bg-gray-800 px-5 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {reseteandoPassword
                              ? "Restableciendo..."
                              : "Restablecer contraseña"}
                          </button>

                          {passwordTemporal && (
                            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                              <p className="text-sm font-semibold text-emerald-800">
                                Contraseña temporal generada
                              </p>
                              <p className="mt-1 text-lg font-bold text-emerald-900">
                                {passwordTemporal}
                              </p>
                              <p className="mt-1 text-xs text-emerald-700">
                                Comparte esta contraseña solo con el empleado
                                correspondiente.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[220px] items-center justify-center text-gray-500">
                  No se encontró información del empleado.
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function InputTexto({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  disabled=false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  disabled?:boolean
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-600">
        {label}
      </label>

      <input
        type={type}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#009b63] focus:ring-2 focus:ring-[#009b63]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      />
    </div>
  );
}

function InputNumero({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
   disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-600">
        {label}
      </label>

      <input
        type="number"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#009b63] focus:ring-2 focus:ring-[#009b63]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      />
    </div>
  );
}

function SelectTexto({
  label,
  value,
  onChange,
  opciones,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  opciones: string[];
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-600">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#009b63] focus:ring-2 focus:ring-[#009b63]/20"
      >
        <option value="">Selecciona una opción</option>

        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-4 text-sm font-semibold text-gray-600 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-4 text-sm text-gray-700">{children}</td>;
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-semibold text-gray-800">
        {value}
      </span>
    </div>
  );
}