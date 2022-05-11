import { GreetingContract as Greeting } from "@near/ts";

/**
 * @name GreetingContract
 * @description - This will handle the interactions
 * with the contract with better TS types
 */
export class GreetingContract {
  private contract: Greeting;

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
    return await this.contract.set_greeting(params);
  }
}
