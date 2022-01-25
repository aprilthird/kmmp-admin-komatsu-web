import { ParamI } from "../models/formatos";

export function paramsInfo(type: number, paramData: ParamI): ParamI {
  switch (type) {
    case 1:
      return {
        ...paramData,
        idParametro: 1,
        regex: null,
      };
    case 11:
      return {
        ...paramData,
        idParametro: 1,
        regex: "3",
        placeholder: "Ingrese DNI",
        minCaracteres: null,
        maxCaracteres: null,
      };
    case 12:
      return {
        ...paramData,
        idParametro: 1,
        regex: "2",
        placeholder: "Ingrese Correo",
        minCaracteres: 1,
        maxCaracteres: 50,
      };
    case 2:
      return {
        ...paramData,
        idParametro: 2,
        regex: "",
        placeholder: "Ingrese número",
      };
    case 3:
      return {
        ...paramData,
        idParametro: 3,
        regex: "",
      };

    case 4:
      return {
        ...paramData,
        idParametro: 4,
        regex: "",
      };

    case 5:
      return {
        ...paramData,
        idParametro: 5,
        regex: "",
      };
    case 6:
      return {
        ...paramData,
        idParametro: 6,
        regex: "",
      };

    case 7:
      return {
        ...paramData,
        idParametro: 7,
        regex: "",
      };

    case 8:
      return {
        ...paramData,
        idParametro: 8,
        regex: "",
      };

    case 9:
      return {
        ...paramData,
        idParametro: 9,
        regex: "",
      };

    case 10:
      return {
        ...paramData,
        idParametro: 10,
        regex: "",
      };
  }
}
