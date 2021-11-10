export const FakeModelosData: ModeloI[] = [
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

export interface ModeloI {
  nombre: string;
  cliente: string;
  estado: boolean;
}

export const ModeloResponse: ModeloResponseI = {
  sucess: true,
  code: "200",
  body: FakeModelosData,
};

export interface ModeloResponseI {
  sucess: boolean;
  code: any;
  body: ModeloI[];
}
