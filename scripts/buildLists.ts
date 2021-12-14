import fs from "fs/promises";
import * as process from "process";
import packageJSON from "../package.json";
import { rawTokens } from "./utils/rawTokens";
import { TokenInfo, TokenList } from "@uniswap/token-lists";

import { requireOrNull } from "./utils/requireOrNull";

const version = packageJSON.version.split(".");

const LOGO_URI_BASE =
  "https://raw.githubusercontent.com/ubeswap/default-token-list/master";

const makeTokenList = (
  previousTokenList: TokenList | null,
  tokens: TokenInfo[]
): TokenList => {
  let timestamp: string = new Date().toISOString();
  if (process.env.CI) {
    if (!previousTokenList) {
      throw new Error("Token list not found");
    }
    // if in CI, use the timestamp generated from the previous process
    timestamp = previousTokenList.timestamp;
  }
  return {
    name: previousTokenList?.name ?? "Unknown List",
    logoURI: `${LOGO_URI_BASE}/logo.svg`,
    keywords: ["celo", "ubeswap", "defi"],
    timestamp,
    tokens,
    version: {
      major: parseInt(version[0]),
      minor: parseInt(version[1]),
      patch: parseInt(version[2]),
    },
  };
};

const main = async () => {
  const allTokens = await Promise.all(
    rawTokens.map(async ({ logoURI: elLogoURI, logoFile, ...el }) => {
      const logoURI =
        elLogoURI ||
        (logoFile ? `${LOGO_URI_BASE}/assets/${logoFile}` : null) ||
        `${LOGO_URI_BASE}/assets/asset_${el.symbol.replace("xV1", "")}.png`;

      // Validate
      if (logoURI.startsWith(LOGO_URI_BASE)) {
        const logoPath = `${__dirname}/..${logoURI.substring(
          LOGO_URI_BASE.length
        )}`;
        const stat = await fs.stat(logoPath);
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
        isExperimental: el.isExperimental,
      };
    })
  );

  const [mainTokenListTokens, experimentalTokenListTokens] = allTokens.reduce(
    ([mainTokens, experimentalTokens], { isExperimental, ...tok }) => {
      if (isExperimental !== true && tok.chainId === 42220) {
        return [
          [...mainTokens, tok],
          [...experimentalTokens, tok],
        ];
      } else {
        return [mainTokens, [...experimentalTokens, tok]];
      }
    },
    [[] as TokenInfo[], [] as TokenInfo[]]
  );

  const previousTokenList = requireOrNull(
    __dirname,
    "../ubeswap.token-list.json"
  );
  const previousExperimentalTokenList = requireOrNull(
    __dirname,
    "../ubeswap-experimental.token-list.json"
  );

  const tokenList = makeTokenList(previousTokenList, mainTokenListTokens);
  const experimentalTokenList = makeTokenList(
    previousExperimentalTokenList,
    experimentalTokenListTokens
  );

  await fs.writeFile(
    __dirname + "/../ubeswap.token-list.json",
    JSON.stringify(tokenList, null, 2)
  );

  await fs.writeFile(
    __dirname + "/../ubeswap-experimental.token-list.json",
    JSON.stringify(experimentalTokenList, null, 2)
  );
};

main().catch((err) => {
  console.error("Error", err);
  process.exit(1);
});
