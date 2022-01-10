import { Uuid } from "@nexys/utils/dist/types";
import { Context } from "../../context";

interface MutateResponseInsert {
  success: boolean;
  uuid?: string;
  id?: number;
  status?: string;
}

export default abstract class LogService {
  abstract insert(
    apiRequestUuid: Uuid,
    apiParamsIn: any[],
    instance: { uuid: Uuid },
    responseBody: any,
    context: Pick<Context, "appToken">
  ): Promise<MutateResponseInsert>;

  abstract list(
    mrequest: { uuid: Uuid },
    context: Pick<Context, "appToken">
  ): Promise<any[]>;
}
