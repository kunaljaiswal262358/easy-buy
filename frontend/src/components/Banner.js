import React, { useEffect, useState } from 'react'
const images = [
  "https://media.istockphoto.com/id/1824217014/photo/small-business-woman-and-tablet-for-e-commerce-startup-and-inventory-management-of-online.jpg?b=1&s=612x612&w=0&k=20&c=KSEkYNiRYLiDJ7ndnYu6xQexlq8xbG9LMOMCV4GZTOw=",
  "https://media.istockphoto.com/id/923079848/photo/online-shopping.jpg?b=1&s=612x612&w=0&k=20&c=AGCCQmFNfirZcsK0_PhPqrhydUs_ISrK6VvTp-ahIb8=",
  "https://media.istockphoto.com/id/1165069915/photo/shopping-bags-in-shopping-cart-and-credit-card-on-laptop-with-paper-boxes-on-table-and-sales.jpg?b=1&s=612x612&w=0&k=20&c=Kyppjnce6EW9T_cbKcnNZyJjIsvjtmGVxlryMCBN2Kc=",
  "https://media.istockphoto.com/id/1305615921/photo/young-man-shopping-online.jpg?b=1&s=612x612&w=0&k=20&c=KL5jDn1hwJO3SxZot68JVIoodRcIXR85Ce6EzRbOgbA=",
  "https://media.istockphoto.com/id/1249219777/photo/shopping-online-concept-parcel-or-paper-cartons-with-a-shopping-cart-logo-in-a-trolley-on-a.jpg?b=1&s=612x612&w=0&k=20&c=Z3RsrcQm2G19uOggBLXRtJZ_2mwvHyJikV4Ib3mqgd0="
];

const Banner = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <section className="banner" style={{ backgroundImage: `url(${images[currentImage]})` }}>
      <div className="overlay">
        <h1>Welcome to <span>Easy Buy!</span></h1>
        <p>Explore the latest products at the best prices</p>
        <a href="#products" className="shop-btn">Shop Now</a>
      </div>
    </section>
    </>
  )
}

export default Banner
