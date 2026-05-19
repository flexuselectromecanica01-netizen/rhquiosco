



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

