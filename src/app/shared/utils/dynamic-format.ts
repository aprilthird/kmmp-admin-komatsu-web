import { ParamI } from "../models/formatos";

export function paramsInfo(type: number, paramData: ParamI): ParamI {
  switch (type) {
    case 1:
      return {
        ...paramData,
        idParametro: 1,
        label: "Texto",
      };
    case 1:
      return {
        ...paramData,
        idParametro: 1,
        label: "DNI",
        regex: "dni",
      };
    case 1:
      return {
        ...paramData,
        idParametro: 1,
        label: "Correo",
        regex: "email",
      };
    case 2:
      return {
        ...paramData,
        idParametro: 2,
        label: "Número",
      };
    case 3:
      return {
        ...paramData,
        idParametro: 3,
        label: "Area de texto",
      };

    case 4:
      return {
        ...paramData,
        idParametro: 4,
        label: "Cargue imagen",
      };

    case 5:
      return {
        ...paramData,
        idParametro: 5,
        label: "Fecha",
      };
    case 6:
      return {
        ...paramData,
        idParametro: 6,
        label: "Imagen",
      };

    case 7:
      return {
        ...paramData,
        idParametro: 7,
        label: "Firma",
      };

    case 8:
      return {
        ...paramData,
        idParametro: 8,
        label: "Label",
      };

    case 9:
      return {
        ...paramData,
        idParametro: 9,
        label: "Checkbox",
      };

    case 10:
      return {
        ...paramData,
        idParametro: 10,
        label: "Selection",
      };
  }
}
