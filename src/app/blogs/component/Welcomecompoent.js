'use client';

import React from 'react'
import useUserStore from '../../../../store/userStore';

const Welcomecompoent = () => {
  const { user } = useUserStore();
  return (
    // <div>Welcome {user.name}</div>
    <div>Welcome home </div>
  )
}

export default Welcomecompoent