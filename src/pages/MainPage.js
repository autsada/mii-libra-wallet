import React, { useContext } from 'react'

import { ActivityContext } from '../hooks/activityContext'
import Main from '../components/Main'
import Modal from './../components/modals/Modal'

const MainPage = () => {
  const { openModal } = useContext(ActivityContext)
  return (
    <>
      {openModal && <Modal />}
      {/* <Main accountState={accountState} /> */}
      <Main />
    </>
  )
}

export default MainPage
