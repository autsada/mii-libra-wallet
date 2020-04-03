import { useContext } from "react";
import { useMutation } from "@apollo/react-hooks";

import { QueryContext } from "./index";
import { MINT_COINS } from "../apolloClient/mutation";
import {
  QUERY_RECEIVED_EVENTS,
  QUERY_SENT_EVENTS,
  QUERY_BY_ADDRESS,
} from "../apolloClient/query";
import { saveLocalAccount } from "../helpers/getLocalStorageData";

export const useMintCoins = (accountState) => {
  const { setState } = useContext(QueryContext);

  //   const client = useApolloClient()

  const [mintCoin, { loading, error }] = useMutation(MINT_COINS, {
    variables: {
      amount: 1000,
      address: accountState && accountState.address,
      authKey: accountState && accountState.authKey,
    },
    onCompleted({ mintCoin }) {
      const {
        blob: {
          blob: { balance, sequence_number },
        },
      } = mintCoin.response_items[0].get_account_state_response.account_state_with_proof;

      // setNewTxnVersion(version)
      const updatedState = {
        ...accountState,
        balance,
        sequenceNumber: sequence_number,
      };

      // Update context
      setState(updatedState);
      // Update localStorage
      saveLocalAccount(updatedState);
      // Update cache
      //   client.writeData({
      //     data: {
      //       user: updatedState
      //     }
      //   })
    },
    refetchQueries: [
      {
        query: QUERY_BY_ADDRESS,
        variables: {
          address: accountState && accountState.address,
        },
      },
      {
        query: QUERY_RECEIVED_EVENTS,
        variables: {
          address: accountState && accountState.address,
        },
      },
      {
        query: QUERY_SENT_EVENTS,
        variables: {
          address: accountState && accountState.address,
        },
      },
    ],
  });

  return {
    mintCoin,
    loading,
    error,
  };
};
