import { useEffect, useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";

import { QueryContext } from "../hooks";
import { QUERY_BY_ADDRESS } from "../apolloClient/query";
import { saveLocalAccount } from "../helpers/getLocalStorageData";

export const useQueryState = accountState => {
  const { setState } = useContext(QueryContext);
  const [checkState, setCheckState] = useState(false);

  //   const client = useApolloClient()

  const { data, error } = useQuery(QUERY_BY_ADDRESS, {
    variables: {
      address: accountState && accountState.address
    },
    pollInterval: 10000
  });

  // const queryState = () => {
  //   return new Promise((resolve, reject) => {
  //     let state;
  //     let count = 0;

  //     const query = setInterval(() => {
  //       count++;
  //       if (data) {
  //         if (
  //           data.queryByAddress &&
  //           data.queryByAddress.response_items &&
  //           data.queryByAddress.response_items[0] &&
  //           data.queryByAddress.response_items[0].get_account_state_response &&
  //           data.queryByAddress.response_items[0].get_account_state_response
  //             .account_state_with_proof
  //         ) {
  //           const {
  //             blob: {
  //               blob: { balance, sequence_number }
  //             }
  //           } = data.queryByAddress.response_items[0].get_account_state_response.account_state_with_proof;

  //           state = { balance, sequence_number };

  //           clearInterval(query);
  //           resolve(state);
  //         }
  //       }

  //       if (count > 10) {
  //         console.log("Error -->", count);
  //         state = null;

  //         clearInterval(query);
  //         reject(state);
  //       }
  //     }, 100);

  //     console.log(count);
  //   });
  // };

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

        // Find account state in the system
        const updatedUser = {
          ...accountState,
          balance,
          sequenceNumber: sequence_number
        };

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
      console.log("Catch error", error.message);
      // No account found in the system
      const updatedUser = {
        ...accountState,
        balance: "0",
        sequenceNumber: undefined
      };

      setState(updatedUser);

      // Confirm that the state is check
      setCheckState(true);

      // queryState()
      //   .then(res => {
      //     if (res) {
      //       const { balance, sequence_number } = res;

      //       // Find account state in the system
      //       const updatedUser = {
      //         ...accountState,
      //         balance,
      //         sequenceNumber: sequence_number
      //       };

      //       // Update context
      //       setState(updatedUser);

      //       // Confirm that the state is check
      //       setCheckState(true);

      //       // Update localStorage
      //       saveLocalAccount(updatedUser);
      //     }
      //   })
      //   .catch(err => {
      //     console.log("Catch error");
      //     // No account found in the system
      //     const updatedUser = {
      //       ...accountState,
      //       balance: "0",
      //       sequenceNumber: undefined
      //     };

      //     setState(updatedUser);

      //     // Confirm that the state is check
      //     setCheckState(true);
      //   });
    }
  }, [data, error]);

  return {
    checkState,
    setCheckState
  };
};
