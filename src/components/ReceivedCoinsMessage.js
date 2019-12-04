import { useEffect, useContext } from "react";
import { useApolloClient, useSubscription } from "@apollo/react-hooks";
import { Notyf } from "notyf";
import { myTheme } from "../cssTheme/myTheme";

import { RECEIVED_COINS_NOTIFIER } from "../apolloClient/subscription";
import { QueryContext } from "../hooks";
import { saveLocalAccount } from "../helpers/getLocalStorageData";

const ReceivedCoinsMessage = () => {
  const { accountState, setState } = useContext(QueryContext);

  const client = useApolloClient();

  const { data } = useSubscription(RECEIVED_COINS_NOTIFIER, {
    variables: { receiverAddress: accountState && accountState.address }
  });

  const notyf = new Notyf({
    duration: 5000,
    types: [
      {
        type: "info",
        backgroundColor: `${myTheme.teal}`,
        className: "toast",
        icon: false
      }
    ]
  });

  useEffect(() => {
    if (
      data &&
      data.receivedCoins &&
      data.receivedCoins.transaction &&
      data.receivedCoins.transaction.transaction
    ) {
      const {
        transaction: {
          transaction: { amount, from_account }
        }
      } = data.receivedCoins;

      const updatedState = {
        ...accountState,
        balance: (+accountState.balance + +amount).toString()
      };

      notyf.open({
        type: "info",
        message: `Received coin${+amount / 1000000 > 1 ? "s" : ""}: ${amount /
          1000000} Libra`
      });

      saveLocalAccount(updatedState);
      setState(updatedState);
      client.writeData({
        data: {
          user: updatedState
        }
      });
    }
  }, [data]);

  return null;
};

export default ReceivedCoinsMessage;
