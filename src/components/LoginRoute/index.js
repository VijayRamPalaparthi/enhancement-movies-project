import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginRoute extends Component {
  state = {showError: false, showError2:false, errorMsg2:'', errorMsg: '', username: '', password: "",code:'', loginshow: true,url:'',jwtToken:''}

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangeCode= event =>{
    this.setState({code:event.target.value})
  }

  submitSuccess = () => {
    const {username,jwtToken}=this.state
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    Cookies.set("username", username,{expires:30})
    const {history} = this.props
    history.replace('/')
  }

  submitFailure = errorMsg => {
    this.setState({errorMsg, showError: true})
  }

  generate2mfa= async() =>{
    const{username,password}=this.state
    const url="/login"
    const userDetails = {username, password,}
    const options = {method: 'POST', body: JSON.stringify(userDetails), headers:{"Content-type":"application/json"}}
    const fetchedData=await fetch(url,options)
    const data=await fetchedData.json()
    const token=data.jwt_token

    if (data.status_code===400 || data.status_code===403) {
      this.submitFailure(data.error_msg)
    } 
    else {
      // this.submitSuccess(data.jwt_token)
      //this.setState({jwtToken:data.jwt_token})
      const url = '/generateMfaSecret'
      const userDetails = {username}
      const options = {method: 'POST', body: JSON.stringify(userDetails),headers:{"Content-type":"application/json"}}
      const fetchedData = await fetch(url, options)
      const data = await fetchedData.json()
      if(data.status_code===403){
        this.submitFailure(data.error_msg)
      }else{
        console.log(data)
        this.setState({url:data.image, loginshow:false, jwtToken:token,showError:false})
      }
    }  
  }

  onFormSubmit = async event => {
    event.preventDefault()
    const {username,code} = this.state
    const verifyDetail = {username,code}
    const options = {method: 'POST', body: JSON.stringify(verifyDetail), headers:{"Content-type":"application/json"}}
    const url="/verifyMfa"
    const fetchedData=await fetch(url,options)
    const data=await fetchedData.json()
    console.log(data)

    if (data.status_code===200) {
      this.submitSuccess()
    } 
    else {
      this.setState({showError2:true, errorMsg2:data.error_msg})
    }
    
  }

  render() {
    const {showError, showError2,errorMsg,errorMsg2, username, password,loginshow, url} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container">
        <img
          src="https://res.cloudinary.com/djlwgb6z2/image/upload/v1704261345/Movies%20Mini%20Projects/Group_7399_bzwfor.png"
          className="login-logo"
          alt="login website logo"
        />
        <div className="card-container">
          <div className="login-card">
            <h1 className="login-heading">Login</h1>
            <form className="form-container" onSubmit={this.onFormSubmit}>
              <div className="input-container">
                <label htmlFor="username" className="label">
                  USERNAME
                </label>
                <input
                  type="text"
                  className="input"
                  id="username"
                  value={username}
                  onChange={this.onChangeUsername}
                />
              </div>
              <div className="input-container">
                <label htmlFor="password" className="label">
                  PASSWORD
                </label>
                <input
                  type="password"
                  className="input"
                  id="password"
                  value={password}
                  onChange={this.onChangePassword}
                />
              </div>
              {showError && <p className="error-msg"> {errorMsg} </p>}
              {loginshow ? 
              <button className="login-button" type="button" onClick={this.generate2mfa}>
                Click For 2MFA
              </button> :
              <div className='qr-container'>
              <img src={url} className='qrcode'/>
              <label htmlFor="key" className="label">
                  Scane and Enter Verification Code
                </label>
              <input type="text" className='input' onChange={this.onChangeCode} id="key"/>
              {showError2 && <p className="error-msg"> {errorMsg2} </p>}
              <button className="login-button" type="submit">
                {' '}
                Login{' '}
              </button>
              </div>
              }
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginRoute
