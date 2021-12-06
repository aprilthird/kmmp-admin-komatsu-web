export interface Activity {
  id?: number;
  nombre?: string;
  descripcion: string;
  visible?: boolean;
  activo?: boolean;
  asignado?: boolean;
  estado?: number;
  subEstado?: number;
  fechaReg?: Date;
  fechaMod?: Date;
  usuarioMod?: string;
  usuarioReg?: string;
  idUsuarioReg?: number;
  idUsuarioMod?: number;
  total?: number;
  idCliente: number;
  idEquipo: number;
  idClaseActividad: number;
  idTipoMantenimiento: number;
  idBahia: number;
  idTipoSolicitud: number;
  nbl: string;
  nos: string;
  npe: string;
  cliente: string;
  equipo?: string;
  flota?: number;
  modelo?: number;
  actividad?: string;
  fechaEstimadaIni?: any;
  idFlota?: number;
  idTipoEquipo?: number;
  tipo_equipo?: string;
  idModelo?: number;
}

export interface MultipleBaysI {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  visible: boolean;
  activo: boolean;
  asignado: boolean;
  estado: number;
  idBahia: number;
  idsActividades: number[];
  subEstado?: number;
  fechaReg?: any;
  fechaMod?: any;
  usuarioMod?: string;
  usuarioReg?: string;
  idUsuarioReg?: number;
  idUsuarioMod?: number;
  entidad?: number;
  total?: number;
}
