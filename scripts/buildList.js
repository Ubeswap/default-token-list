const alfajores = require("../src/alfajores.tokens.json");
const mainnet = require("../src/mainnet.tokens.json");
const baklava = require("../src/baklava.tokens.json");
const fs = require("fs/promises");

const package = require("../package.json");
const version = package.version.split(".");
const process = require("process");

const timestamp = process.env.CI
  ? require("../ubeswap.token-list.json").timestamp
  : new Date().toISOString();

const LOGO_URI_BASE =
  "https://raw.githubusercontent.com/ubeswap/default-token-list/master";

const main = async () => {
  const result = {
    name: "Ubeswap",
    logoURI:
      "https://raw.githubusercontent.com/Ubeswap/default-token-list/master/logo.svg",
    keywords: ["celo", "ubeswap", "defi"],
    timestamp,
    tokens: await Promise.all(
      [
        ...alfajores.map((el) => ({ ...el, chainId: 44787 })),
        ...baklava.map((el) => ({ ...el, chainId: 62320 })),
        ...mainnet.map((el) => ({ ...el, chainId: 42220 })),
      ]
        .filter((el) => !el.isHidden)
        .map(async (el) => {
          const logoURI =
            el.logoURI || `${LOGO_URI_BASE}/assets/asset_${el.symbol}.png`;

          // Validate
          if (logoURI.startsWith(LOGO_URI_BASE)) {
            if (logoURI !== `${LOGO_URI_BASE}/assets/asset_${el.symbol}.png`) {
              throw new Error(
                `unexpected logo URI: ${el.symbol} but got ${logoURI.slice(
                  logoURI.lastIndexOf("/")
                )}`
              );
            }
            const stat = await fs.stat(
              `${__dirname}/..${logoURI.slice(LOGO_URI_BASE.length)}`
            );
            if (!stat.isFile()) {
              throw new Error(
                `logo for ${el.address} on ${el.chainId} does not exist`
              );
            }
          }
          return {
            ...el,
            decimals: el.decimals || 18,
            logoURI,
          };
        })
    ),
    version: {
      major: parseInt(version[0]),
      minor: parseInt(version[1]),
      patch: parseInt(version[2]),
    },
  };

  await fs.writeFile(
    __dirname + "/../ubeswap.token-list.json",
    JSON.stringify(result, null, 2)
  );
};

main().catch((err) => {
  console.error("Error", err);
  process.exit(1);
});
