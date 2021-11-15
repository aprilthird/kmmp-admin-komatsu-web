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
  idActividad: number;
  idTipoMantenimiento: number;
  idBahia: number;
  idTipoSolicitud: number;
  nbl: string;
  nos: string;
  npe: string;
  cliente: string;
  equipo: string;
  flota?: number;
  modelo?: number;
}
