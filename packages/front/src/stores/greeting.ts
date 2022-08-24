import create from "zustand";
import { GreetingContract } from "@near/contracts";
import { Contract, WalletConnection } from "near-api-js";
import { contractName } from "../env/contract";

export const useGreetingStore = create<{
  greeting: string | null;
  contract: GreetingContract | null;
  isFetching: boolean;
  isUpdating: boolean;
  fetchGreeting: (accountID: string) => Promise<void>;
  setNewGreeting: (message: string, accountID: string) => Promise<void>;
  initializeContract: (
    walletConnection: WalletConnection,
    accountID: string
  ) => Promise<void>;
}>((set, get) => ({
  greeting: null,
  contract: null,
  isFetching: false,
  isUpdating: false,

  setNewGreeting: async (message: string, accountID: string) => {
    set({ isUpdating: true });
    try {
      await get().contract!.updateGreeting({
        message,
      });
      const greeting = await get().contract!.getGreeting({
        account_id: accountID,
      });
      set({
        greeting,
      });
    } finally {
      set({
        isUpdating: false,
      });
    }
  },

  fetchGreeting: async (accountID: string) => {
    set({ isFetching: true });
    try {
      const greeting = await get().contract!.getGreeting({
        account_id: accountID,
      });
      set({
        greeting,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isFetching: false });
    }
  },

  initializeContract: async (walletConnection: WalletConnection) => {
    set({ isFetching: true });
    const contract = new GreetingContract(
      new Contract(await walletConnection.account(), contractName, {
        // View methods are read only. They don't modify the state, but usually return some value.
        viewMethods: ["get_greeting"],
        // Change methods can modify the state. But you don't receive the returned value when called.
        changeMethods: ["set_greeting"],
      })
    );

    try {
      set({
        contract,
      });
      const greeting = await contract.getGreeting({
        account_id: await walletConnection.getAccountId(),
      });

      set({
        greeting,
      });
    } finally {
      set({ isFetching: false });
    }
  },
}));
