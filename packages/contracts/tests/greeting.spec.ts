import "jest";
import fs from "fs";
import { Account, connect, Contract, KeyPair, Near } from "near-api-js";
import { UrlAccountCreator } from "near-api-js/lib/account_creator";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";
import { NearConfig } from "near-api-js/lib/near";
import { v4 } from "uuid";
import { GreetingContract } from "../lib";

const CONTRACTS_PATH = "../out/";

const config: NearConfig = {
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
};

const createTestAccount = async (params: {near: Near, config: NearConfig, keyStore: InMemoryKeyStore}): Promise<Account> => {
    const UrlCreator = new UrlAccountCreator(params.near.connection, params.config.helperUrl!);

    const accountId = `${v4()}.testnet`;
    const randomKey = KeyPair.fromRandom("ed25519");

    await UrlCreator.createAccount(accountId, randomKey.getPublicKey());

    params.keyStore.setKey(config.networkId, accountId, randomKey);

    const account = await params.near.account(accountId);
    return account;
}

describe("Greeting Contract Tests", () => {
  let contract: GreetingContract;
  let account: Account;

  /** @description - Runs Before Everything and initializes the near instances */
  beforeAll(async () => {
    const keyStore = new InMemoryKeyStore();

    const near = await connect({ ...config, keyStore });

    const contractAccount = await createTestAccount({near, config, keyStore});
    const account = await createTestAccount({near, config, keyStore});

    await contractAccount.deployContract(fs.readFileSync(CONTRACTS_PATH + "contract.wasm"));

    //change contract config here to contracts in the project
    contract = new GreetingContract(
      new Contract(account, contractAccount.accountId, {
        viewMethods: ["get_greeting"],
        changeMethods: ["set_greeting"],
      })
    );
  });

  /** @description - Gets the current greeting from the smart contract and checks if it goes okay */
  it("should get the greeting from the contract using the `get_greeting` method", async () => {
    // Gets the current message for that account id on the contract
    const message = await contract.getGreeting({
      account_id: account.accountId,
    });

    console.log(message);

    expect(message).toEqual("Hello");
  });

  it("should change the greeting from the contract using the `set_greeting` method", async () => {
    // Gets the current message for that account id on the contract
    await contract.updateGreeting({
      message: "Whats Up Darling!",
    });

    const message = await contract.getGreeting({
      account_id: account.accountId,
    });

    expect(message).toEqual("Whats Up Darling!");
  });
});
