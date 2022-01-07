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
    case "dni":
      return {
        ...paramData,
        idParametro: 1,
        label: "DNI",
        regex: "dni",
        placeholder: "Ingrese DNI",
      };
    case "email":
      return {
        ...paramData,
        idParametro: 1,
        label: "Correo",
        regex: "email",
        placeholder: "Ingrese correo",
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

    case "upload":
      return {
        ...paramData,
        idParametro: 4,
        label: "Cargue imagen",
        placeholder: "Cargar imagen",
      };

    case "date":
      return {
        ...paramData,
        idParametro: 5,
        placeholder: "Ingrese fecha",
        label: "Fecha",
      };
    case "image":
      return {
        ...paramData,
        idParametro: 6,
        label: "Imagen",
      };

    case "sign":
      return {
        ...paramData,
        idParametro: 7,
        label: "Firma",
        placeholder: "Cargar firma",
      };

    case "label":
      return {
        ...paramData,
        idParametro: 8,
        label: "Label",
      };

    case "checkbox":
      return {
        ...paramData,
        idParametro: 9,
        label: "Checkbox",
      };

    case "selection":
      return {
        ...paramData,
        idParametro: 10,
        label: "Selection",
        placeholder: "Ingrese opciones",
      };
  }
}
