import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const AccountSection = props => {
  const onClickLogout = () => {
    // removing active user from server
    const name=Cookies.get("username")
    const options = {method: 'POST', body: JSON.stringify({username:name}), headers:{"Content-type":"application/json"}}
    fetch("/logout", options)
    .then(res=>res.text())
    .then(json=>console.log(json))

    const {history} = props
    Cookies.remove('jwt_token')
    Cookies.remove("username")
    history.replace('/login')
  }
  return (
    <div className="account-container">
      <Header />
      <div className="account-section-bg-container">
        <h1 className="account-title">Account</h1>
        <hr className="ruler" />
        <div className="membership-container">
          <p className="account-description">Member ship:</p>
          <div className="user-details-container">
            <p className="account-details">vijayram@gmail.com</p>
            <p className="account-password">Password : ************</p>
          </div>
        </div>
        <hr className="ruler" />
        <div className="membership-container">
          <p className="account-description">Plan details:</p>
          <p className="account-details">Premium</p>{' '}
          <p className="ultra-text">Ultra HD</p>
        </div>
        <hr className="ruler" />
        <div className="button-container">
          <button
            className="Logout-button"
            type="button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AccountSection
