export const FakeFlotasData: FlotaI[] = [
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

export interface FlotaI {
  nombre: string;
  cliente: string;
  estado: boolean;
}

export const FlotaResponse: FlotaResponseI = {
  sucess: true,
  code: "200",
  body: FakeFlotasData,
};

export interface FlotaResponseI {
  sucess: boolean;
  code: any;
  body: FlotaI[];
}
