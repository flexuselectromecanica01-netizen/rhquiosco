export type TipoEmpleado = "SEMANAL" | "QUINCENAL";

export type Semaforo = "CONTROLADO" | "ATENCION" | "SINSALDO";

export type VacacioneImport = {
  id?: number;
  idempleado: string;
  nombre: string;
  tipoempleado: TipoEmpleado | "";
  area: string;
  puesto: string;
  fechaingreso: string;
  antiguedad: number;
  diasderecho: number;
  iniciocicloactual: string;
  fincicloactual: string;
  proporcionaldevengado: string;
  diastomados: number;
  saldodisponible: string;
  diasporvencer: number;
  diasavencer: number;
  semaforo: Semaforo | "";
  accionsugerida: string;
};