import React, { useContext } from 'react'

import { ActivityContext } from '../hooks/activityContext'
import Main from '../components/Main'
import Modal from './../components/modals/Modal'

const MainPage = ({ account, events }) => {
  const { openModal } = useContext(ActivityContext)
  return (
    <>
      {openModal && <Modal />}
      <Main account={account} events={events} />
    </>
  )
}

export default MainPage
