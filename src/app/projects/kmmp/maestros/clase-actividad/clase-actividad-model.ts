export const FakeClseActividadessData: ClaseActividadI[] = [
  {
    nombre: "Allicorp",
    estado: false,
  },
  {
    nombre: "Pepsi",
    estado: false,
  },
  {
    nombre: "Iglo SAC",
    estado: false,
  },
  {
    nombre: "Coca Cola",
    estado: false,
  },
];

export interface ClaseActividadI {
  nombre: string;
  estado: boolean;
}

export const ClaseActividadResponse: ClaseActividadResponseI = {
  sucess: true,
  code: "200",
  body: FakeClseActividadessData,
};

export interface ClaseActividadResponseI {
  sucess: boolean;
  code: any;
  body: ClaseActividadI[];
}
