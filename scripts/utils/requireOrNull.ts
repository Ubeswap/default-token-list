import * as path from "path";

export const requireOrNull = (dirname: string, p: string): null => {
  if (p.startsWith(`.${path.sep}`) || p.startsWith(`..${path.sep}`)) {
    p = path.resolve(dirname, p);
  }

  try {
    return require(p);
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND" && ~err.message.indexOf(p)) {
      return null;
    }
    throw err;
  }
};
