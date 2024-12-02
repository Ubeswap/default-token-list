import * as path from "path";

export const requireOrNull = (dirname: string, p: string): any => {
  if (p.startsWith(`.${path.sep}`) || p.startsWith(`..${path.sep}`)) {
    p = path.resolve(dirname, p);
  }

  try {
    return require(p);
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("MODULE_NOT_FOUND") &&
      err.message.includes(p)
    ) {
      return null;
    }
    throw err;
  }
};
