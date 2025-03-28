import React from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container grid grid--1x2">
      <div className="not-found-content">
        <h2 className="not-found-message"><span>Sorry!</span>, this page isn't available</h2>
        <p className="not-found-submessage">The page you were looking for couldn't be found</p>
        
        <div className="not-found-action">
            Go back to the <Link to={"/"}>home page</Link>
        </div>
      </div>
      <div>
        <img className='not-found-image' src="/images/not-found.jpg" alt="Not found image" />
      </div>
    </div>
  );
};

export default NotFound;