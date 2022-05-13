import "jest";
import { Account, connect, Contract } from "near-api-js";
import { KeyStore } from "near-api-js/lib/key_stores";
import { NearConfig } from "near-api-js/lib/near";

/**
 * @name GreetingContract
 * @description - This will handle the interactions
 * with the contract with better TS types
 */
export class GreetingContract {
  private contract: any;

  /**
   * @constructor
   * @param contract
   */
  constructor(contract: any) {
    this.contract = contract as any;
  }

  /**
   * @description - This method gets the message on chain to the user account_id
   */
  public async getGreeting(params: { account_id: string }): Promise<string> {
    return await this.contract.get_greeting(params);
  }

  /**
   * @description - This method updates the message for the account on NEAR
   */
  public async updateGreeting(params: { message: string }) {
    return await this.contract.set_greeting(params, "300000000000000");
  }
}

describe("Greeting Contract Tests", () => {
  let contract: GreetingContract;
  let account: Account;
  let config: NearConfig & {
    contractName: string;
    accountId: string;
    deps: { keyStore: KeyStore };
    testAccountId: string;
  };

  /** @description - Runs Before Everything and initializes the near instances */
  beforeAll(async () => {
    // @ts-ignore
    config = nearConfig;

    const near = await connect(config);

    account = await near.account(config.accountId as string);

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

  // it("should change the greeting from the contract using the `set_greeting` method", async () => {
  //   // Gets the current message for that account id on the contract
  //   await contract.updateGreeting({
  //     message: "Whats Up Darling!",
  //   });

  //   const message = await contract.getGreeting({
  //     account_id: account.accountId,
  //   });

  //   expect(message).toEqual("Whats Up Darling!");
  // });
});
