import { ActionInput } from "../types";
import { Context } from "../context";

import * as RequestService from "../request-service";
import RequestLogService from "../request-service/logs/nexys-service";

type Uuid = string;

export default class RequestService2 {
  context: Pick<Context, "instance" | "env" | "request" | "appToken">;
  logService: RequestLogService;

  constructor(
    context: Pick<Context, "instance" | "env" | "request" | "appToken">,
    request: <Input, Output = any>(
      path: string,
      payload: Input,
      appToken: string
    ) => Promise<Output>
  ) {
    this.context = context;

    this.logService = new RequestLogService(request);
  }

  exec = <A>(
    uuid: Uuid,
    {
      data,
      params,
    }: // headers,
    {
      data?: any;
      params?: { [key: string]: string };
      // headers?: { [key: string]: string };
    } = {}
  ) => {
    const actionInput: ActionInput = {
      data,
      params,
      headers: undefined, // todo
      query: undefined, // todo
    };
    return RequestService.findAndExec<A>(
      uuid,
      actionInput,
      this.context,
      this.logService
    );
  };

  logs = (
    uuid: Uuid
  ): Promise<
    { uuid: Uuid; responseBody: string; inputs: string; logDateAdded: Date }[]
  > => this.logService.list({ uuid }, this.context);
}
