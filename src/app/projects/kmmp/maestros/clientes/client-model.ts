export const FakeClientsData: ClientI[] = [
  {
    nombre: "Allicorp",
    razon_social: "Allicorp SAC",
    ruc: "45GYJYGYG47",
    ubicacion: "Av argentina, lima",
    estado: "Lima",
  },
  {
    nombre: "Allicorp",
    razon_social: "Allicorp SAC",
    ruc: "45GYJYGYG45",
    ubicacion: "Av argentina, lima",
    estado: "Lima",
  },
  {
    nombre: "Allicorp",
    razon_social: "Allicorp SAC",
    ruc: "45GYJYGYG46",
    ubicacion: "Av argentina, lima",
    estado: "Lima",
  },
  {
    nombre: "Allicorp",
    razon_social: "Allicorp SAC",
    ruc: "45GYJYGYG48",
    ubicacion: "Av argentina, lima",
    estado: "Lima",
  },
];

export const ClientResponse: ClientResponseI = {
  sucess: true,
  code: "200",
  body: FakeClientsData,
};

export interface ClientResponseI {
  sucess: boolean;
  code: any;
  body: ClientI[];
}

export interface ClientI {
  nombre: string;
  ruc: string;
  razon_social: string;
  ubicacion: string;
  estado: string;
}
