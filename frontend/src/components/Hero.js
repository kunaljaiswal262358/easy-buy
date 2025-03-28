import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section>
        <div className="hero grid grid--1x2">
            <div className="hero__content">
                <h1>Find Everything You Need, All in One Place!</h1>
                <p>Discover a wide range of top-quality products at the best prices. Fast delivery, secure payments, and hassle-free shopping!</p>
                <div className="hero__btns">
                    <Link className="btn btn--primary btn--big btn--link" to={"/shop"}>Shop Now</Link>
                    {/* <button className="btn btn--big">Explore Deals</button> */}
                </div>
            </div>
            <img src="images/hero.avif" alt="an image of sales data"/>
        </div>
    </section>
  )
}

export default Hero
