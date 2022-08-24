import { useState } from "react";
import { useNearWalletSelector } from "../utils/context/near";

/**
 * @route - '/'
 * @description - This is the landing page for the near application
 * @name Home
 */
export const Index = () => {
  const [newGreetingForm, setNewGreetingForm] = useState("");

  const { accountId, toggleModal } = useNearWalletSelector();

  const connectToNear = async () => {
    toggleModal();
  };

  return (
    <div className="p-4 flex min-h-[70vh] flex-1 flex-col items-center justify-center">
      <div className="overflow-hidden">
        <h1 className="h-auto text-center font-[800] text-4xl tracking-[-0.06em] w3-animate-bottom overflow-hidden">
          Welcome to the{" "}
          <strong className="w3-animate-bottom">Near Monorepo</strong>
        </h1>
      </div>
      <h1 className="mb-8 max-w-[600px] text-center font-semibold opacity-[0.6] text-xl tracking-[-0.06em] ">
        A Monorepo that helps you building Dapps on NEAR in the right way,
        Please Sign In to Interact with The Sample Contract
      </h1>
    </div>
  );
};

export default Index;
