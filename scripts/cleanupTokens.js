const { getAddress } = require("@ethersproject/address");
const fs = require("fs/promises");

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

(async () => {
  console.log("Fixing addresses...");
  await Promise.all(["alfajores", "mainnet", "baklava"].map(cleanupTokens));
  console.log("Fixed and files overwritten");
})();
