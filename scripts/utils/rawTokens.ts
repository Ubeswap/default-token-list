import alfajores from "../../src/alfajores.tokens.json";
import mainnet from "../../src/mainnet.tokens.json";
import baklava from "../../src/baklava.tokens.json";

interface IRawToken {
  address: string;
  name: string;
  symbol: string;
  isExperimental?: boolean;
  logoURI?: string;
  decimals?: number;
  chainId: number;
}

type IRawTokenListJson = readonly Omit<IRawToken, "chainId">[];

export const CELO_NETWORK_NAMES = ["alfajores", "baklava", "mainnet"] as const;
export type ICeloNetwork = typeof CELO_NETWORK_NAMES[number];

// assert the JSON is valid
const rawTokensJson: {
  [network in ICeloNetwork]: [number, IRawTokenListJson];
} = {
  alfajores: [44787, alfajores],
  baklava: [62320, baklava],
  mainnet: [42220, mainnet],
};

export const getNetworkTokens = (network: ICeloNetwork): IRawTokenListJson =>
  rawTokensJson[network][1];

export const rawTokens: readonly IRawToken[] = Object.values(
  rawTokensJson
).flatMap(([chainId, tokens]) => tokens.map((tok) => ({ ...tok, chainId })));
