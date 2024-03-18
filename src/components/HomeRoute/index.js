import {Component} from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import VideoItem from '../VideoItem'
import Header from '../Header'
import TrendingSection from '../TrendingSection'
import './index.css'
import Footer from '../Footer'

class HomeRoute extends Component {
  state = {
    originalMoviesList: [],
    originalApiStatus: 'initial',
  }

  componentDidMount = () => {
    this.getOriginalMovies()
  }

  getOriginalMovies = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({originalApiStatus: 'loader'})
    const url = 'https://apis.ccbp.in/movies-app/originals'

    
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const fetchedData = await fetch(url, options)

    const data = await fetchedData.json()
    if (fetchedData.ok) {
      const updatedData = data.results.map(each => ({
        backdropImageUrl: each.backdrop_path,
        id: each.id,
        overview: each.overview,
        posterUrl: each.poster_path,
        title: each.title,
      }))
      this.setState({
        originalMoviesList: updatedData,
        originalApiStatus: 'success',
      })
    } else {
      this.setState({originalApiStatus: 'failure'})
    }
  }

  renderOriginalSuccessView = () => {
    const {originalMoviesList} = this.state
    const setting = {
      dots: true,
      slidesToShow: 4,
      slidesToScroll: 3,
      infinite: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
      ],
    }

    return (
      <div className="slider-container">
        <Slider {...setting}>
          {originalMoviesList.map(each => (
            <VideoItem obj={each} key={each.id} />
          ))}
        </Slider>
      </div>
    )
  }

  renderBannerSuccessView = () => {
    const {originalMoviesList} = this.state
    const randomNumber = Math.floor(
      Math.random() * (originalMoviesList.length - 1),
    )
    const posterImage = originalMoviesList[randomNumber]

    return (
      <div
        style={{backgroundImage: `url(${posterImage.backdropImageUrl})`}}
        className="banner-image-container"
      >
        <Header isHome />
        <div className="banner-content">
          <h1 className="banner-content-heading">{posterImage.title}</h1>
          <p className="banner-content-desc">{posterImage.overview}</p>
          <button type="button" className="home-play">
            Play
          </button>
        </div>
        <div className="home-banner-foot" />
      </div>
    )
  }

  retryOriginal = () => {
    this.getOriginalMovies()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <div className="failure-desc-container">
        <img
          src="https://res.cloudinary.com/dc2b69ycq/image/upload/v1670040709/Movies%20App/alert-triangle_sc1zom.png"
          alt="failure view"
          className="poster-failure-image"
        />
        <p className="failure-content">
          Something went wrong. Please try again
        </p>
        <button
          className="try-button"
          type="button"
          onClick={this.retryOriginal}
        >
          Try Again{' '}
        </button>
      </div>
    </div>
  )

  renderBannerFailureView = () => (
    <div className="banner failure-container">
      <div className="failure-desc-container">
        <img
          src="https://res.cloudinary.com/dc2b69ycq/image/upload/v1670040709/Movies%20App/alert-triangle_sc1zom.png"
          alt="failure view"
          className="poster-failure-image"
        />
        <p className="failure-content">
          Something went wrong. Please try again
        </p>
        <button
          className="try-button"
          type="button"
          onClick={this.getOriginalMovies}
        >
          Try Again{' '}
        </button>
      </div>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderBannerLoadingView = () => (
    <>
      <Header isHome />
      <div className="banner-loader-container" testid="loader">
        <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
      </div>
    </>
  )

  switchOriginal = () => {
    const {originalApiStatus} = this.state
    switch (originalApiStatus) {
      case 'loader':
        return this.renderLoadingView()

      case 'success':
        return this.renderOriginalSuccessView()

      case 'failure':
        return this.renderFailureView()

      default:
        return null
    }
  }

  switchBanner = () => {
    const {originalApiStatus} = this.state
    switch (originalApiStatus) {
      case 'loader':
        return this.renderBannerLoadingView()

      case 'success':
        return this.renderBannerSuccessView()

      case 'failure':
        return this.renderBannerFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        {this.switchBanner()}
        <TrendingSection />
        <div className="home-slick-container">
          <h1 className="home-movies-type">Originals</h1>
          {this.switchOriginal()}
        </div>

        <Footer />
      </div>
    )
  }
}

export default HomeRoute
