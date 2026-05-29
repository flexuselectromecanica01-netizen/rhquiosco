import {z} from 'zod'


export const EstatusSolicitudSchema = z.enum([
    "PENDIENTE",
    "APROBADA",
    "RECHAZADA",
    "CANCELADA"
])

export const VacacioneSchema = z.object({
    id:z.number(),
    idempleado:z.string(),
    nombre:z.string(),
    tipoempleado:z.enum(["QUINCENAL","SEMANAL",""]),
    area:z.string(),
    puesto:z.string(),
    fechaingreso:z.string(),
    antiguedad:z.number(),
    diasderecho:z.number(),
    iniciocicloactual:z.string(),
    fincicloactual:z.string(),
    proporcionaldevengado:z.number(),
    diastomados:z.number(),
    saldodisponible:z.number(),
    diasporvencer:z.number(),
    diasavencer:z.number(),
    semaforo:z.enum(["CONTROLADO","ATENCION","SINSALDO",""]),
    turno:z.enum(["MATUTINO","NOCTURNO",""]).default("MATUTINO"),
    accionsugerida:z.string()
})

export type Vacacione = z.infer<typeof VacacioneSchema>
export type VacacioneSinTurno = Omit<Vacacione,'turno'>
export type VacacioneFormulario = Omit<Vacacione,| "id"| "turno"|"tipoempleado"| "semaforo"| "proporcionaldevengado"| "saldodisponible"> & {
  tipoempleado: Vacacione["tipoempleado"] | "";
  semaforo: Vacacione["semaforo"] | "";
  proporcionaldevengado: string;
  saldodisponible: string;
};




export const SolicitudSchema = z.object({
    id:z.number(),
    fechainicio:z.string(),
    diastotales:z.number(),
    fechatermino:z.string(),
    estatus:EstatusSolicitudSchema,
    motivorechazo:z.string().nullable().optional(),
    empleado:VacacioneSchema.optional(),
    fechacreacion:z.string()
})

export type Solicitud = z.infer<typeof SolicitudSchema>
export type SolicitudEmpleadoVacaciones =
  z.infer<typeof VacacioneSchema> & {
    solicitudes: Solicitud[]
  }


export const CreateSolicitudSchema=SolicitudSchema.omit({
    id:true,
    estatus:true,
    motivorechazo:true,
    empleado:true,
    fechacreacion:true
})

export type CreateSolicitude = z.infer<typeof CreateSolicitudSchema>


export const TipoRolSistemaSchema = z.enum([
    "SUPERVISOR",
    "ADMINISTRADOR",
    "EMPLEADO"
])

export const SubrolSistemaSchema = z.enum([
    "MAESTRA",
    "EMPLEADO"
])

export const BodegaSistemaSchema = z.enum([
    "B1",
    "B2"
])


export const LineaSistemaSchema = z.enum([
  "L1",
  "L2",
  "L3",
  "L4",
  "L5",
  "L6",
  "L7",
  "L8",
  "L9",
  "L10",
  "L11",
  "L12",
  "L13",
  "L14",
  "CALIDAD",
]);


export const LoginSchema = z.object({
  id: z.number(),
  idempleado:z.string(),
  empleado: VacacioneSchema,
  password: z.string(),
  actualizarpassword: z.boolean(),
  rol: TipoRolSistemaSchema,
  subrol: SubrolSistemaSchema,
  bodega: BodegaSistemaSchema,
  linea: LineaSistemaSchema,
});

export type Login = z.infer<typeof LoginSchema>;
export type LoginForm = Pick<Login , 'idempleado' | 'password'>



export const AreaEnumSchema = z.enum([
  "ALMACEN",
  "CALIDAD",
  "PRODUCCION",
  "MANTENIMIENTO",
  "ADMINISTRACION",
]);

export const AreaSchema = z.object({
  id: z.number(),
  area: z.string(),
});

export type Area = z.infer<typeof AreaSchema>;


export const PuestoEnumSchema = z.enum([
  "MAESTRADELINEA",
  "TECNICODECALIDAD",
  "AUXILIARDEMANTENIMIENTO",
  "OPDEPRODUCCION",
  "AUDITOROBA",
  "SUPERVISOR",
  "ALMACENISTA",
  "AUXILIARDEINTENDENCIA",
  "TI",
  "JEFEDEMANTENIMIENTO",
  "INGENIERIADECALIDAD",
  "INGENIERODEPROCESO",
  "GERENTEDECALIDAD",
  "INGENIERODENUEVOSPRODUCTOS",
  "TRAFICO",
  "GENERALISTADERH",
  "JEFEDERECURSOSHUMANOS",
  "INGENIERODECOTIZACIONES",
  "RECLUTADOR",
  "AUXILIARDETRAFICO",
  "AUXILIARDESOPORTETECNICO",
]);

export const PruebaEnumSchema = z.enum([
  "PRUEBA",
]);

export const PuestoSchema = z.object({
  id: z.number(),
  puesto: z.string(),
});

export type Puesto = z.infer<typeof PuestoSchema>;


export type EmpleadoAuthContext = Login & {
  nombre: Vacacione['nombre']
  empleado:Vacacione
  solicitudes:Solicitud[]
}