import React from 'react'
import { FaStar } from 'react-icons/fa'

export default function StarStr({ isToRight = false }) {
  return (
    <div style={isToRight ? { animationDirection: 'reverse' } : {}}>
      <FaStar />
      <FaStar />
      <FaStar />
    </div>
  )
}
