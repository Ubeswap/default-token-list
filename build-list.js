const alfajores = require("./src/alfajores.tokens.json");
const mainnet = require("./src/mainnet.tokens.json");
const baklava = require("./src/baklava.tokens.json");
const fs = require("fs");

const package = require("./package.json");
const version = package.version.split(".");

const result = {
  name: "Ubeswap",
  logoURI:
    "https://raw.githubusercontent.com/Ubeswap/default-token-list/master/logo.svg",
  keywords: ["ubeswap", "defi"],
  timestamp: new Date().toISOString(),
  tokens: [
    ...alfajores.map((el) => ({ ...el, chainId: 44787 })),
    ...baklava.map((el) => ({ ...el, chainId: 62320 })),
    ...mainnet.map((el) => ({ ...el, chainId: 42220 })),
  ]
    .filter((el) => !el.isHidden)
    .map((el) => {
      return {
        ...el,
        decimals: el.decimals || 18,
        logoURI:
          el.logoURI ||
          `https://raw.githubusercontent.com/ubeswap/default-token-list/master/assets/asset_${el.symbol}.png`,
      };
    }),
  version: {
    major: parseInt(version[0]),
    minor: parseInt(version[1]),
    patch: parseInt(version[2]),
  },
};

fs.writeFileSync(
  __dirname + "/ubeswap.token-list.json",
  JSON.stringify(result, null, 2)
);
