import { WalletConnection } from "near-api-js";
import { useEffect, useMemo, useState } from "react";
import { useNearUser, useNearWallet } from "react-near";
import { LoadingLottie } from "../assets/animations";
import { Button } from "../components/button";
import { If } from "../components/if";
import { NearLogo } from "../components/nearLogo";
import { contractName } from "../env/contract";
import { useGreetingStore } from "../stores/greeting";

/**
 * @route - '/'
 * @description - This is the landing page for the near application
 * @name Home
 */
export function Home() {
  const [newGreetingForm, setNewGreetingForm] = useState("");
  const wallet = useNearWallet();
  const user = useNearUser(contractName);
  const {
    initializeContract,
    greeting,
    setNewGreeting,
    fetchGreeting,
    isUpdating,
  } = useGreetingStore();

  useEffect(() => {
    if (user.account && user.isConnected)
      initializeContract(
        wallet as WalletConnection,
        user.account?.accountId as string
      ).then(() => {
        fetchGreeting(user.account?.accountId as string);
      });
  }, [user.isConnected]);

  const connectToNear = async () => {
    await wallet?.requestSignIn();
    await user.connect();
  };

  const walletConnected = useMemo(() => !!wallet?.isSignedIn(), [wallet]);

  const submit = async () => {
    if (isUpdating && user.account?.accountId) {
      return;
    }

    await setNewGreeting(newGreetingForm, user.account?.accountId as string);

    setNewGreetingForm("");
  };

  return (
    <div className="p-4 flex min-h-[70vh] flex-1 flex-col items-center justify-center">
      <If fallback={<LoadingLottie />} condition={!user.loading && !!wallet}>
        <div className="flex flex-col justify-between items-center mb-[-80px] px-4">
          <div className="mb-[-180px]">
            <NearLogo size={200} />
          </div>
          <LoadingLottie />
        </div>
        <If
          fallback={
            <>
              <div className="overflow-hidden">
                <h1 className="h-auto text-center font-[800] text-4xl tracking-[-0.06em] w3-animate-bottom overflow-hidden">
                  Welcome to the{" "}
                  <strong className="w3-animate-bottom">Near Monorepo</strong>
                </h1>
              </div>
              <h1 className="mb-8 max-w-[600px] text-center font-semibold opacity-[0.6] text-xl tracking-[-0.06em] ">
                A Monorepo that helps you building Dapps on NEAR in the right
                way, Please Sign In to Interact with The Sample Contract
              </h1>
              <Button onClick={connectToNear}>
                Click Here to Connect Your Wallet
              </Button>
            </>
          }
          condition={walletConnected}
        >
          <div className="overflow-hidden">
            <If
              fallback={
                <h1 className="h-auto text-center font-[800] text-4xl tracking-[-0.06em]  overflow-hidden delay-75 w3-animate-bottom">
                  Changing Greeting...
                </h1>
              }
              condition={!isUpdating}
            >
              <h1 className="h-auto text-center font-[800] text-4xl tracking-[-0.06em]  overflow-hidden delay-75">
                <strong className="w3-animate-bottom mr-2">
                  {greeting || "Hello"}
                </strong>
                {user.account?.accountId}
              </h1>
            </If>
          </div>
          <div className="overflow-hidden">
            <h1 className="h-auto text-center font-[800] text-3xl tracking-[-0.06em] w3-animate-bottom overflow-hidden">
              Welcome to the Near Monorepo
            </h1>
          </div>
          <h1 className="mt-3 max-w-[600px] text-center font-semibold opacity-[0.6] text-xl tracking-[-0.06em] w3-animate-fading-in">
            A Monorepo that helps you building Dapps on NEAR in the right way,
            Interact with the sample contract that works this way the user can
            configure a greeting on the website for him so go ahead!
          </h1>
          <div className="flex gap-2 mt-4 flex-row items-center">
            <input
              value={newGreetingForm}
              onChange={(e) => setNewGreetingForm(e.target.value)}
              placeholder="New Greeting"
              className="input bg-gray-900 border-[2px] border-gray-900 focus:border-white outline-none duration-75 text-white px-5 py-2.5 size-[16px] tracking-[-0.03em] flex rounded-2xl"
            />
            <Button loading={isUpdating} onClick={submit}>
              Update Greeting
            </Button>
          </div>
        </If>
      </If>
    </div>
  );
}
