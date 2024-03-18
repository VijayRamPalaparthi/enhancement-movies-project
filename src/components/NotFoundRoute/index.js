import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-bg-container">
    <div className="not-found-content-container">
      <h1 className="not-found-title">Lost Your Way</h1>
      <p className="not-found-description">
        we are sorry, the page you requested could not be found Please go back
        to the homepage.
      </p>

      <button type="button" className="go-home-button">
        <Link to="/" className="route-link">
          Go to Home
        </Link>
      </button>
    </div>
  </div>
)

export default NotFound
