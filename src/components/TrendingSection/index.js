import {Component} from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import VideoItem from '../VideoItem'

import './index.css'

class TrendingSection extends Component {
  state = {
    trendingMoviesList: [],
    trendingApiStatus: 'initial',
  }

  componentDidMount = () => {
    this.getTrendingMovies()
  }

  getTrendingMovies = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({trendingApiStatus: 'loader'})
    const url = 'https://apis.ccbp.in/movies-app/trending-movies'
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
        trendingMoviesList: updatedData,
        trendingApiStatus: 'success',
      })
    } else {
      this.setState({trendingApiStatus: 'failure'})
    }
  }

  renderTrendingSuccessView = () => {
    const {trendingMoviesList} = this.state
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
          {trendingMoviesList.map(each => (
            <VideoItem obj={each} key={each.id} />
          ))}
        </Slider>
      </div>
    )
  }

  tryAgain = () => {
    this.getTrendingMovies()
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
        <button className="try-button" type="button" onClick={this.tryAgain}>
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

  switchTrending = () => {
    const {trendingApiStatus} = this.state
    switch (trendingApiStatus) {
      case 'loader':
        return this.renderLoadingView()

      case 'success':
        return this.renderTrendingSuccessView()

      case 'failure':
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-slick-container">
        <h1 className="home-movies-type">Trending Now</h1>
        {this.switchTrending()}
      </div>
    )
  }
}

export default TrendingSection
