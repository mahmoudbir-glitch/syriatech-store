import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";

const mock = pathToFileURL(process.env.DEV_BLOB_MOCK).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@vercel/blob" || specifier === "@vercel/blob/client") {
      return { url: mock, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  }
});
