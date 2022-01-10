import { Context } from "../../context";
import AbstractService from "./abstract";

type Uuid = string;

export default class LogService extends AbstractService {
  insert = (
    _apiRequestUuid: Uuid,
    _apiParamsIn: any[],
    _instance: { uuid: Uuid },
    _responseBody: any,
    _context: Pick<Context, "appToken">
  ) => {
    console.log("insert log");
    return Promise.resolve({ uuid: "sd", success: true });
  };

  list = ({ uuid }: { uuid: Uuid }, _context: Pick<Context, "appToken">) =>
    Promise.resolve([]);
}
