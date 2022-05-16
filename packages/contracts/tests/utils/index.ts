import { KeyPair, connect } from "near-api-js";
import { NearConfig } from "near-api-js/lib/near";
import { v4 } from "uuid";

export async function createFullAccessKey(config: NearConfig) {
  const account_id = `${v4()}`;
  const keyPair = KeyPair.fromRandom("ed25519");
  const publicKey = keyPair.getPublicKey().toString();
  const near = await connect(config);
  const account = await near.account(account_id);
  await config.keyStore?.setKey(config.networkId, publicKey, keyPair);
  await account.addKey(publicKey);
  return {
    near,
    account,
  };
}
