import probe from "probe-image-size";
import fs from "fs";
import tokenList from "../ubeswap.token-list.json";

console.info("Validating Image Type and Sizes");

function validateList(list: typeof tokenList) {
  const NEED_RESIZING: string[] = [];
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
    if (noErrors) {
      console.log("✅", token.name);
    } else {
      NEED_RESIZING.push(relative);
    }
    anyErrors = anyErrors || noErrors;
  });

  if (anyErrors) {
    console.info("NEED RESIZING");
    NEED_RESIZING.forEach((image) => console.info(image));
  } else {
    console.info("complete 🚀");
  }
}

validateList(tokenList);

function checkSize(
  side: "height" | "width",
  token: { symbol: string },
  data: probe.ProbeResult
) {
  if (data.type == "svg") {
    return true;
  }
  if ((data[side] || 0) > 200) {
    console.error(
      "⚠️",
      token.symbol,
      side,
      "is",
      data[side],
      "should be less than or equal to 200"
    );
    return false;
  }
  return true;
}

function checkType(token: { symbol: string }, data: probe.ProbeResult) {
  if ("png" !== data.type && "svg" !== data.type) {
    console.error(
      "⛔️",
      token.symbol,
      "is",
      data.type,
      ". Tokens must be png or svg."
    );
    return false;
  }
  return true;
}
