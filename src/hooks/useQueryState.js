import { useEffect, useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Notyf } from "notyf";

import { myTheme } from "../cssTheme/myTheme";
import { QueryContext } from "../hooks";
import { QUERY_BY_ADDRESS } from "../apolloClient/query";
import { saveLocalAccount } from "../helpers/getLocalStorageData";

export const useQueryState = accountState => {
  const { setState } = useContext(QueryContext);
  const [checkState, setCheckState] = useState(false);

  //   const client = useApolloClient()

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

  // Find account state in the system
  const { data, error } = useQuery(QUERY_BY_ADDRESS, {
    variables: {
      address: accountState && accountState.address
    },
    pollInterval: 10000
  });

  useEffect(() => {
    // Waiting by counting to wait for query to make sure we got latest status of the account

    if (data) {
      if (
        data.queryByAddress &&
        data.queryByAddress.response_items &&
        data.queryByAddress.response_items[0] &&
        data.queryByAddress.response_items[0].get_account_state_response &&
        data.queryByAddress.response_items[0].get_account_state_response
          .account_state_with_proof
      ) {
        const {
          blob: {
            blob: { balance, sequence_number }
          }
        } = data.queryByAddress.response_items[0].get_account_state_response.account_state_with_proof;

        const updatedUser = {
          ...accountState,
          balance,
          sequenceNumber: sequence_number
        };

        if (+balance > +accountState.balance) {
          notyf.open({
            type: "info",
            message: `Received coin${
              (+balance - +accountState.balance) / 1000000 > 1 ? "s" : ""
            }: ${(+balance - +accountState.balance) / 1000000} Libra`
          });
        }

        // Update context
        setState(updatedUser);

        // Confirm that the state is check
        setCheckState(true);

        // Update localStorage
        saveLocalAccount(updatedUser);

        // Update cache
        //   client.writeData({
        //     data: {
        //       user: updatedUser
        //     }
        //   })
      }
    }

    if (error) {
      if (
        error.message ===
        "GraphQL error: Account does not exist in libra database."
      ) {
        // No account found in the system
        const updatedUser = {
          ...accountState,
          balance: "0",
          sequenceNumber: undefined
        };

        setState(updatedUser);

        // Confirm that the state is check
        setCheckState(true);
      }
    }
  }, [data, error]);

  return {
    checkState,
    setCheckState
  };
};
