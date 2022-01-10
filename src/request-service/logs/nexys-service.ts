import { Context } from "../../context";
import AbstractService from "./abstract";

type Uuid = string;

interface MutateResponseInsert {
  success: boolean;
  uuid?: string;
  id?: number;
  status?: string;
}

export default class LogService extends AbstractService {
  request: <Input, Output = any>(
    path: string,
    payload: Input,
    appToken: string
  ) => Promise<Output>;

  constructor(
    request: <Input, Output = any>(
      path: string,
      payload: Input,
      appToken: string
    ) => Promise<Output>
  ) {
    super();
    this.request = request;
  }

  insert = (
    apiRequestUuid: Uuid,
    apiParamsIn: any[],
    instance: { uuid: Uuid },
    responseBody: any,
    context: Pick<Context, "appToken">
  ): Promise<MutateResponseInsert> =>
    this.request<
      {
        apiRequestUuid: Uuid;
        apiParamsIn: any[];
        instance: { uuid: Uuid };
        responseBody: any;
      },
      MutateResponseInsert
    >(
      "/request/log/insert",
      {
        apiRequestUuid,
        apiParamsIn,
        instance,
        responseBody,
      },
      context.appToken
    );

  list = (mrequest: { uuid: Uuid }, context: Pick<Context, "appToken">) =>
    this.request<{ request: { uuid: Uuid } }>(
      "/request/log/list",
      { request: mrequest },
      context.appToken
    );
}
