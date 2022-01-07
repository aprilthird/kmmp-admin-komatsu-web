import { ParamI } from "../models/formatos";

export function paramsInfo(type: string, paramData: ParamI): ParamI {
  switch (type) {
    case "text":
      return {
        ...paramData,
        idParametro: 1,
        placeholder: "Ingrese texto",
        label: "Texto",
      };
    case "number":
      return {
        ...paramData,
        idParametro: 2,
        placeholder: "Ingrese número",
        label: "Número",
      };
    case "area":
      return {
        ...paramData,
        idParametro: 3,
        placeholder: "Ingrese texto",
        label: "Area de texto",
      };

    case "date":
      return {
        ...paramData,
        idParametro: 5,
        placeholder: "Ingrese fecha",
        label: "Fecha",
      };
    case "label":
      return {
        ...paramData,
        idParametro: 8,
        label: "Label",
      };
    case "dni":
      return {
        ...paramData,
        idParametro: 1,
        label: "Ingrese texto",
        regex: "dni",
      };
    case "email":
      return {
        ...paramData,
        idParametro: 1,
        label: "Ingrese texto",
        regex: "email",
      };
    case "checkbox":
      return {
        ...paramData,
        idParametro: 9,
        label: "Checkbox",
      };
  }
}
