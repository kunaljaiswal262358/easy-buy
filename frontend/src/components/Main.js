import React from 'react'
import Hero from './Hero'
import Products from './Products'

const Main = ({user}) => {
  return (
    <div>
      <Hero />
      <Products user={user} />
    </div>
  )
}

export default Main
