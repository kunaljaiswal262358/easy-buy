import React from 'react'
import Hero from './Hero'
import Products from './Products'

const Main = ({user, products}) => {
  return (
    <div>
      <Hero />
      <Products user={user} products={products} />
    </div>
  )
}

export default Main
