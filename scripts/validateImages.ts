import probe from "probe-image-size";
import fs from "fs";
import tokenList from "../ubeswap.token-list.json";

console.info("Validating Image Type and Sizes");

function validateList(list: typeof tokenList) {
  let anyErrors = false;
  list.tokens.forEach((token) => {
    const relative = token.logoURI.replace(
      "https://raw.githubusercontent.com/ubeswap/default-token-list/master/",
      "./"
    );
    const image = fs.readFileSync(relative);
    const data = probe.sync(image);
    let noErrors = true;
    if (data) {
      const invalidHeight = checkSize("height", token, data);
      const invalidWidth = checkSize("width", token, data);
      const invalidType = checkType(token, data);
      noErrors = invalidHeight && invalidWidth && invalidType;
    }
    noErrors && console.log("✅", token.name);
    anyErrors = anyErrors || noErrors;
  });

  if (anyErrors) {
    throw new Error("Images Larger than 200px or not PNG/SVG found");
  }
}

validateList(tokenList);

function checkSize(
  side: "height" | "width",
  token: { name: string },
  data: probe.ProbeResult
) {
  if ((data[side] || 0) > 200) {
    console.error(
      "⚠️",
      token.name,
      side,
      "is",
      data[side],
      "should be less than or equal to 200"
    );
    return false;
  }
  return true;
}

function checkType(token: { name: string }, data: probe.ProbeResult) {
  if ("png" !== data.type && "svg" !== data.type) {
    console.error(
      "⛔️",
      token.name,
      "is",
      data.type,
      ". Tokens must be png or svg."
    );
    return false;
  }
  return true;
}
