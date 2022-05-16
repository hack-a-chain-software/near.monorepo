import "jest";
import { Account, connect, Contract, KeyPair } from "near-api-js";
import { UrlAccountCreator } from "near-api-js/lib/account_creator";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";
import { v4 } from "uuid";
import { GreetingContract } from "../lib";

const config = {
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  contractName: "dev-1652055476064-95220052886384",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};

describe("Greeting Contract Tests", () => {
  let contract: GreetingContract;
  let account: Account;

  /** @description - Runs Before Everything and initializes the near instances */
  beforeAll(async () => {
    const keyStore = new InMemoryKeyStore();

    const near = await connect({ ...config, keyStore });

    const UrlCreator = new UrlAccountCreator(near.connection, config.helperUrl);

    const accountId = `${v4()}.testnet`;
    const randomKey = await KeyPair.fromRandom("ed25519");

    await UrlCreator.createAccount(accountId, randomKey.getPublicKey());

    keyStore.setKey(config.networkId, accountId, randomKey);

    account = await near.account(accountId);

    contract = await new GreetingContract(
      new Contract(account, config.contractName, {
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
