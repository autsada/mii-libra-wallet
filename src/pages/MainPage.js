import React, { useContext } from "react";
import { useTransition, animated } from "react-spring";

import { ActivityContext } from "../hooks";
import Main from "../components/Main";
import Modal from "./../components/modals/Modal";

const MainPage = () => {
  const { openModal } = useContext(ActivityContext);
  const transitions = useTransition(openModal, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opactiy: 0 }
  });

  return (
    <>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div key={key} style={props}>
              <Modal />
            </animated.div>
          )
      )}
      <Main />
    </>
  );
};

export default MainPage;
