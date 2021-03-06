import { Request } from "../types";

import { Context } from "../context";
import { isEmpty } from "../param/utils";

/**
 * replaces en var in request - takes env var from the context (prod, test, dev etc) and replaces in the request object
 * this allows for env dependent requests
 * @param request
 * @param context
 * @return new request object
 */
const replaceEnvVar = (request: Request, _context: Pick<Context, "env">) => {
  // todo
  /*const { product: p, env: e, envvar } = context;

  if (envvar) {
    const { data, reference } = envvar;
    const matches = reference[request.uuid];
    if (!matches) {
      return request;
    }

    const vars: Env[] = data.filter(
      ({ key, product, env }) =>
        matches.includes(key) && product.id === p && env.id === e
    );

    vars.forEach((envvar: Env) => {
      const regex = new RegExp(`\\$ENV\\{${envvar.key}\\}`, "g");

      // NOTE: replace host & uri variables
      const host = request.host.replace(regex, envvar.value);
      const uri = request.uri.replace(regex, envvar.value);

      // NOTE: replace variables in Authorization field
      const mappingIn: RequestMapping[] = request.mappingIn.map(
        (m: RequestMapping) => {
          if (
            m.paramDefault &&
            m.paramDefault.name === "Authorization" &&
            m.valueDefault
          ) {
            const valueDefault = getEnvValFinal(
              regex,
              m.valueDefault,
              envvar.value
            ); // m.valueDefault.replace(regex, envvar.value);

            return {
              ...m,
              valueDefault,
            };
          }

          return m;
        }
      );

      request = {
        ...request,
        host,
        uri,
        mappingIn,
      };
    });
  }*/

  return request;
};

// unused
export const getEnvValFinal = (
  regex: RegExp,
  valueDefault: string | number,
  v: string
): string | number => {
  if (typeof valueDefault === "string") {
    return valueDefault.replace(regex, v);
  }

  return valueDefault;
};

/**
 * when a given url: `/foo/:myparam1/bar` replace `:myparam1` with content of `obj[myparam1]`
 * @param  url: original url
 * @param  obj: object containing the value of the params
 * @return url with substituted values
 */
export const replaceParams = (
  uri: string,
  params: { [k: string]: any },
  curly: boolean = false
) => {
  if (!params || !(typeof params === "object")) {
    return uri;
  }

  Object.entries(params).map(([key, value]: [string, any]) => {
    if (curly) {
      const regex = new RegExp(`\\$\\{${key}\\}`, "g");
      uri = uri.replace(regex, value);
    } else uri = uri.replace(`:${key}`, value);
  });

  return uri;
};

/**
 * replace URI params
 * @params: request: request object
 * @params params: params object with var that will be substituted in url
 * @params dollar: to allow for regex // TODO: dollar <-> regex
 * @return new url with replaced params
 */
const replaceUriParams = (request: Request, params = {}): Request => {
  // unused
  /*const matches = Utils.regex.getMatches(
    `\\$\\{([A-Za-z_-]+)\\}`,
    request.uri,
    { depth: 1 }
  );*/

  // NOTE: do not stop at first error, return all errors
  // TODO
  /*Validation.validateSync(params, schema, {
    abortEarly: false,
    format: { prefix: "params" },
  });*/

  const uri = replaceParams(request.uri, params, true);

  return {
    ...request,
    uri,
  };
};

/**
 * replace request object with env vars
 */
export const prepare = (
  request: Request,
  params: any = {},
  context: Pick<Context, "env">
): Request => {
  // NOTE: replace $ENV{} vars in HOST, URI & Authorization
  request = replaceEnvVar(request, context);

  if (!isEmpty(params)) {
    // NOTE: replace ${} params in URI
    return replaceUriParams(request, params);
  }

  return request;
};

export const getQueryString = (query: { [k: string]: string }) => {
  const obj: string[] = Object.entries(query).map(
    ([k, v]) => k + "=" + encodeURIComponent(v)
  );
  if (obj.length === 0) {
    return undefined;
  }

  return "?" + obj.reduce((a, b) => a + "&" + b);
};

export const getFinalUrl = (
  host: string,
  url: string,
  query?: { [k: string]: string }
): string => {
  const queryString: string | undefined = query && getQueryString(query);

  // this used to be suffixed
  //.replace(/(http[s]:\/\/)+/, "$1");

  return host + url + (queryString || "");
};

export const formatBody = (t: string): any | string => {
  try {
    return JSON.parse(t);
  } catch (_err) {
    return t;
  }
};
