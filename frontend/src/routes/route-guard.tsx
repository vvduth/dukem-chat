import React from 'react'
import { Outlet } from 'react-router-dom'

interface Props {
    requireAuth?: boolean
}

const RouteGuard = ({ requireAuth }: Props) => {
    console.log('RouteGuard - requireAuth:', requireAuth)
  return (
    <Outlet />
  )
}

export default RouteGuard
