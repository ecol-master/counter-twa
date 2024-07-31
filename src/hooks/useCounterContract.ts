import { useEffect, useState } from "react";
import { Counter } from "../contracts/counter";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "@ton/core";
import { useTonConnect } from "./useTonConnect";

export function useCounterContract() {
  const client = useTonClient();
  const [val, setVal] = useState<null | number>();
  const { sender } = useTonConnect();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const counterContract = useAsyncInitialize(async () => {
    if (!client) {
      return;
    }
    //const counterContractAddress =
    //("EQCZ52LU4PsK71IVjn4Ur599R4ZdsnT9ToAEqysot628BEdo");
    const counterContractAddress =
      "EQDq3A8ZjQN9TCOUOxhC-xICc67nzwbSAEdFrAkilzoX2DBw";

    const contract = new Counter(Address.parse(counterContractAddress));
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) {
        return;
      }

      setVal(null);
      const val = await counterContract.getCounter();
      setVal(Number(val));
      await sleep(5000);
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender);
    },
  };
}
