export type SolicitudDetalle = {
  id: number;
  fechainicio: string;
  fechatermino: string;
  diastotales: number;
  estatus: string;
  motivorechazo: string | null;
  empleado: {
    id: number;
    idempleado: string;
    nombre: string;
    tipoempleado: string;
    area: string;
    puesto: string;
    fechaingreso: string;
    antiguedad: number;
    diasderecho: number;
    diastomados: number;
    saldodisponible: string;
    semaforo: string;
    accionsugerida: string;
  };
};


export type Solicitud = {
  id: number;
  fechainicio: string;
  fechatermino: string;
  diastotales: number;
  estatus: string;
  motivorechazo: string | null;
   fechacreacion: string;
};

export type EmpleadoVacaciones = {
  id: number;
  idempleado: string;
  nombre: string;
  tipoempleado: string;
  area: string;
  puesto: string;
  fechaingreso: string;
  antiguedad: number;
  diasderecho: number;
  inicioactual: string;
  finalactual: string;
  proporcionaldevengado: string;
  diastomados: number;
  saldodisponible: string;
  diasporvencer: number;
  diasavencer: number;
  semaforo: string;
  accionsugerida: string;
  solicitudes: Solicitud[];
};



export type SolicitudTabla = {
  id: number;
  empleado: string;
  idempleado: string;
  fechaCreacion: string;
  
  departamento: string;
  puesto: string;
  fechaInicio: string;
  fechaFin: string;
  diasSolicitados: number;
  motivo: string;
  estatus: string;
};



export type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  puesto: string;
  departamento: string;
};


export type LoginForm = {
  idempleado: string;
  password: string;
};