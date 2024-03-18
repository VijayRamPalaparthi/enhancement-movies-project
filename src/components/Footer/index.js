import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <div className="footer-container">
    <div className="logos-container">
      <FaGoogle size="15" color="#fff" />
      <FaTwitter size="15" color="#fff" />
      <FaInstagram size="15" color="#fff" />
      <FaYoutube size="15" color="#fff" />
    </div>
    <p className="contact">Contact us</p>
  </div>
)
export default Footer
