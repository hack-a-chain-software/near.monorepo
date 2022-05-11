import "jest";
import { Account, connect } from "near-api-js";
import { NearConfig } from "near-api-js/lib/near";
import { GreetingContract } from "../lib";

describe("Greeting Contract Tests", () => {
  let contract: GreetingContract;
  let accountId: Account["accountId"];

  /** @description - Runs Before Everything and initializes the near instances */
  beforeAll(async () => {
    // @ts-ignore TODO: find a better way to do this on ts
    const config: NearConfig & { contractName: string } = nearConfig;
    const near = await connect(config);
    accountId = config.contractName;
    contract = await new GreetingContract(
      await near.loadContract(config.contractName as string, {
        viewMethods: ["get_greeting"],
        changeMethods: ["set_greeting"],
        sender: accountId,
      })
    );
  });

  /** @description - Gets the current greeting from the smart contract and checks if it goes okay */
  it("should get the greeting from the contract using the `get_greeting` method", async () => {
    const message = await contract.getGreeting({
      account_id: accountId,
    });
    expect(message).toEqual("Hello");
  });
});
