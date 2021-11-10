export const FakeEquiposData: EquipoI[] = [
  {
    nombre: "Allicorp",
    flota: "FF5",
    tag: "XXX",
    modelo: "FDF5",
    estado: false,
    cliente: "Plaza Vea",
    horometro: "3:00",
  },
  {
    nombre: "Allicorp",
    flota: "FF5",
    tag: "XXX",
    modelo: "FDF5",
    estado: true,
    cliente: "Plaza Vea",
    horometro: "3:00",
  },
  {
    nombre: "Allicorp",
    flota: "FF5",
    tag: "XXX",
    modelo: "FDF5",
    estado: false,
    cliente: "Plaza Vea",
    horometro: "3:00",
  },
  {
    nombre: "Allicorp",
    flota: "FF5",
    tag: "XXX",
    modelo: "FDF5",
    estado: true,
    cliente: "Plaza Vea",
    horometro: "3:00",
  },
];

export interface EquipoI {
  nombre: string;
  flota: string;
  tag: string;
  modelo: string;
  cliente: string;
  horometro: string;
  estado: boolean;
}

export const EquipoResponse: EquipoResponseI = {
  sucess: true,
  code: "200",
  body: FakeEquiposData,
};

export interface EquipoResponseI {
  sucess: boolean;
  code: any;
  body: EquipoI[];
}
