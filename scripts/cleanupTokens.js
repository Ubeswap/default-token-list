const { getAddress } = require("@ethersproject/address");
const fs = require("fs/promises");
const process = require("process");

const cleanupTokens = async (network) => {
  const file = `${__dirname}/../src/${network}.tokens.json`;
  const tokens = require(file).sort((a, b) =>
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
  await Promise.all(["alfajores", "mainnet", "baklava"].map(cleanupTokens));
  console.log("Fixed and files overwritten");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
