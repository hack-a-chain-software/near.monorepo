import { Worker, NearAccount } from "near-workspaces";

describe("Greeting Contract Integration Tests", () => {
  let worker: Worker;
  let root: NearAccount;

  let mike: NearAccount;
  let john: NearAccount;

  let greetingContractAccount: NearAccount;

  beforeAll(async () => {
    console.log("Before all trigerred");
    worker = await Worker.init();

    root = worker.rootAccount;

    mike = await root.createAccount("mike");
    john = await root.createAccount("john");

    console.log("Accounts", mike, john);

    greetingContractAccount = await root.createAndDeploy(
      "greeting",
      __dirname + "/../out/contract.wasm"
    );

    console.log("All accounts have been created");
  });

  afterAll(async () => {
    await worker.tearDown();
  });

  it('should get the "Hello" message as default from the contract', async () => {
    const message = await greetingContractAccount.view("get_greeting", {
      account_id: john.accountId,
    });

    expect(message).toBe("Hello");
  });

  it(`should modify the john's message to "Hello John"`, async () => {
    await john.call(greetingContractAccount.accountId, "set_greeting", {
      message: "Hello John",
    });

    const message = await greetingContractAccount.view("get_greeting", {
      account_id: john.accountId,
    });

    expect(message).toBe("Hello John");
  });

  it('should modify only one user data lets change the mike message to "Hello Mike" and john message should remain the same', async () => {
    await mike.call(greetingContractAccount.accountId, "set_greeting", {
      message: "Hello Mike",
    });

    const john_message = await greetingContractAccount.view("get_greeting", {
      account_id: john.accountId,
    });
    const mike_message = await greetingContractAccount.view("get_greeting", {
      account_id: mike.accountId,
    });

    expect(john_message).toBe("Hello John");
    expect(mike_message).toBe("Hello Mike");
  });
});
