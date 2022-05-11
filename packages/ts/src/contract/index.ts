import { Account, Contract } from "near-api-js";

export interface GreetingContract extends Contract {
  get_greeting: (params: {
    account_id: Account["accountId"];
  }) => Promise<string>;
  set_greeting: (params: { message: string }) => Promise<void>;
}
