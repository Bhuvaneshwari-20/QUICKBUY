import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>Discover delicious meals from your favorite restaurants. QuickBuy brings quality food right to your doorstep with fast, reliable delivery and exceptional customer service.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li onClick={scrollToTop} style={{cursor: 'pointer'}}>Home</li>
                <li onClick={() => scrollToSection('explore-menu')} style={{cursor: 'pointer'}}>Menu</li>
                <li onClick={() => scrollToSection('app-download')} style={{cursor: 'pointer'}}>Mobile App</li>
                <li onClick={() => scrollToSection('footer')} style={{cursor: 'pointer'}}>Contact Us</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+1-212-456-7890</li>
                <li>contact@QuickBuy.com</li>
            </ul>
            <div className="footer-links">
                <Link to="/myorders" className="footer-link">My Orders</Link>
                <Link to="/profile" className="footer-link">Profile</Link>
            </div>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © QuickBuy.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
