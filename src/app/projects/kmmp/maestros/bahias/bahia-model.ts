export const FakeBahiasData: BahiaI[] = [
  {
    nombre: "Allicorp",
    estado: false,
    cliente: "Plaza Vea",
  },
  {
    nombre: "Allicorp",
    estado: false,
    cliente: "Plaza Vea",
  },
  {
    nombre: "Allicorp",
    estado: false,
    cliente: "Plaza Vea",
  },
  {
    nombre: "Allicorp",
    estado: false,
    cliente: "Plaza Vea",
  },
];

export interface BahiaI {
  nombre: string;
  cliente: string;
  estado: boolean;
}

export const BahiaResponse: BahiaResponseI = {
  sucess: true,
  code: "200",
  body: FakeBahiasData,
};

export interface BahiaResponseI {
  sucess: boolean;
  code: any;
  body: BahiaI[];
}
