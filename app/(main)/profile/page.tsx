
import MyProfile from '@/components/ui/Profile/MyProfile'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "Manage your personal account details, preferences, and booking history on LockMyTime.",
};

const page = () => {
  return (
    <div><MyProfile/></div>
  )
}

export default page