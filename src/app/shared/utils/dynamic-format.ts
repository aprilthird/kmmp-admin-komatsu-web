import { ParamI } from "../models/formatos";

export function paramsInfo(type: number, paramData: ParamI): ParamI {
  switch (type) {
    case 1:
      return {
        ...paramData,
        idParametro: 1,
      };
    case 1:
      return {
        ...paramData,
        idParametro: 1,
        regex: "dni",
      };
    case 1:
      return {
        ...paramData,
        idParametro: 1,
        regex: "email",
      };
    case 2:
      return {
        ...paramData,
        idParametro: 2,
      };
    case 3:
      return {
        ...paramData,
        idParametro: 3,
      };

    case 4:
      return {
        ...paramData,
        idParametro: 4,
      };

    case 5:
      return {
        ...paramData,
        idParametro: 5,
      };
    case 6:
      return {
        ...paramData,
        idParametro: 6,
      };

    case 7:
      return {
        ...paramData,
        idParametro: 7,
      };

    case 8:
      return {
        ...paramData,
        idParametro: 8,
      };

    case 9:
      return {
        ...paramData,
        idParametro: 9,
      };

    case 10:
      return {
        ...paramData,
        idParametro: 10,
      };
  }
}
