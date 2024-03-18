import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import MovieItem from '../MovieItem'
import Header from '../Header'
import Footer from '../Footer'

import './index.css'

class PopularRoute extends Component {
  state = {
    popularMoviesList: [],
    popularApiStatus: 'initial',
  }

  componentDidMount = () => {
    this.getPopularMovies()
  }

  getPopularMovies = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({popularApiStatus: 'loader'})
    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
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
        popularMoviesList: updatedData,
        popularApiStatus: 'success',
      })
    } else {
      this.setState({popularApiStatus: 'failure'})
    }
  }

  renderPopularSuccessView = () => {
    const {popularMoviesList} = this.state

    return (
      <ul className="popular-videoItem-container">
        {popularMoviesList.map(each => (
          <MovieItem movieData={each} key={each.id} />
        ))}
      </ul>
    )
  }

  retryPopular = () => {
    this.getPopularMovies()
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
          onClick={this.retryPopular}
        >
          Try Again{' '}
        </button>
      </div>
    </div>
  )

  renderLoadingView = () => (
    <div className="popular-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  switchPopular = () => {
    const {popularApiStatus} = this.state
    switch (popularApiStatus) {
      case 'loader':
        return this.renderLoadingView()

      case 'success':
        return this.renderPopularSuccessView()

      case 'failure':
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="popular-bg-container">
        <Header isPopular />
        {this.switchPopular()}
        <Footer />
      </div>
    )
  }
}

export default PopularRoute
