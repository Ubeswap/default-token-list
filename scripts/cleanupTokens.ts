import { getAddress } from "@ethersproject/address";
import * as fs from "fs/promises";
import * as process from "process";
import {
  CELO_NETWORK_NAMES,
  getNetworkTokens,
  ICeloNetwork,
} from "./utils/rawTokens";

const cleanupTokens = async (network: ICeloNetwork) => {
  const file = `${__dirname}/../src/${network}.tokens.json`;

  const tokens = getNetworkTokens(network)
    .slice()
    .sort((a, b) =>
      a.address.toLowerCase().localeCompare(b.address.toLowerCase())
    );

  await fs.writeFile(
    file,
    JSON.stringify(
      tokens.map((tok) => ({ ...tok, address: getAddress(tok.address) }))
    )
  );
};

const main = async () => {
  console.log("Fixing addresses...");
  await Promise.all(CELO_NETWORK_NAMES.map(cleanupTokens));
  console.log("Fixed and files overwritten");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
