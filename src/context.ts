export type Request = any;

export enum Env {
  prod = 3,
  test = 2,
  dev = 1,
}

export interface Context {
  env: Env;
  instance: { uuid: string };
  request: Request[];
  product: { id: number };
  appToken: string;
}
