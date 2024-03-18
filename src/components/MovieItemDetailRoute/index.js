import {Component} from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import MovieItem from '../MovieItem'
import Header from '../Header'
import './index.css'
import Footer from '../Footer'

class MovieItemDetail extends Component {
  state = {
    movieItemDetail: {},
    movieDetailApiStatus: 'initial',
    similarMoviesList: [],
    languageList: [],
  }

  componentDidMount = () => {
    this.getMovieDetail()
  }

  getMovieDetail = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    this.setState({movieDetailApiStatus: 'loader'})
    const url = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const fetchedData = await fetch(url, options)

    const data = await fetchedData.json()
    if (fetchedData.ok) {
      const moviesObject = data.movie_details
      const updatedObject = {
        adult: moviesObject.adult,
        budget: moviesObject.budget,
        genresList: moviesObject.genres,
        backdropImageUrl: moviesObject.backdrop_path,
        id: moviesObject.id,
        overview: moviesObject.overview,
        posterUrl: moviesObject.poster_path,
        title: moviesObject.title,
        runtime: moviesObject.runtime,
        releaseDate: moviesObject.release_date,
        ratingAverage: moviesObject.vote_average,
        ratingCount: moviesObject.vote_count,
      }

      const updatedSimilarMoviesList = moviesObject.similar_movies.map(
        each => ({
          backdropImageUrl: each.backdrop_path,
          id: each.id,
          overview: each.overview,
          posterUrl: each.poster_path,
          title: each.title,
        }),
      )

      const updatedLanguage = moviesObject.spoken_languages.map(each => ({
        id: each.id,
        name: each.english_name,
      }))

      this.setState({
        movieItemDetail: updatedObject,
        movieDetailApiStatus: 'success',
        similarMoviesList: updatedSimilarMoviesList,
        languageList: updatedLanguage,
      })
    } else {
      this.setState({movieDetailApiStatus: 'failure'})
    }
  }

  renderMovieItemSuccessView = () => {
    const {similarMoviesList} = this.state

    return (
      <div className="slider-container">
        {this.renderBannerSuccessView()}
        {this.allDetailSection()}
        <h1 className="detail-movie-type">More like this</h1>
        <ul className="popular-videoItem-container">
          {similarMoviesList.map(each => (
            <MovieItem movieData={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  allDetailSection = () => {
    const {movieItemDetail, languageList} = this.state

    return (
      <div className="all-movie-detail-container">
        <div className="detail-1-container">
          <h1 className="all-detail-heading">genres</h1>
          <ul className="all-detail-list">
            {movieItemDetail.genresList.map(each => (
              <li key={each.id}>
                <p className="list">{each.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-1-container">
          <h1 className="all-detail-heading">Audio Available</h1>
          <ul className="all-detail-list">
            {languageList.map(each => (
              <li key={each.id}>
                <p className="list">{each.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-1-container">
          <h1 className="all-detail-heading">Rating Count</h1>
          <p className="list">{movieItemDetail.ratingCount}</p>
          <h1 className="all-detail-heading">Rating Average</h1>
          <p className="list">{movieItemDetail.ratingAverage}</p>
        </div>

        <div className="detail-1-container">
          <h1 className="all-detail-heading">Budget</h1>
          <p className="list">{movieItemDetail.budget} </p>
          <h1 className="all-detail-heading">Release Date</h1>
          <p className="list">{movieItemDetail.releaseDate}</p>
        </div>
      </div>
    )
  }

  renderBannerSuccessView = () => {
    const {movieItemDetail} = this.state
    const time = movieItemDetail.runtime / 60
    const timeInHr = parseInt(time)
    const timeInMin = parseInt((time - timeInHr) * 60)

    const date = new Date(movieItemDetail.releaseDate)
    const year = date.getFullYear()

    return (
      <div
        style={{backgroundImage: `url(${movieItemDetail.backdropImageUrl})`}}
        className="banner-image-container"
      >
        <Header />
        <div className="banner-content">
          <h1 className="banner-content-heading">{movieItemDetail.title}</h1>
          <div className="movie-details-container">
            <p className="time">
              {timeInHr}h {timeInMin}m
            </p>
            <p className="sensor"> {movieItemDetail.adult ? 'A' : 'U/A'}</p>
            <p className="time">{year}</p>
          </div>
          <p className="banner-content-desc">{movieItemDetail.overview}</p>
          <button type="button" className="home-play">
            Play
          </button>
        </div>
        <div className="home-banner-foot" />
      </div>
    )
  }

  retryOriginal = () => {
    this.getMovieDetail()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <div className="failure-desc-container">
        <img
          src="https://res.cloudinary.com/dc2b69ycq/image/upload/v1670002135/Movies%20App/Failure_l6kgfg.png"
          alt="failure view"
          className="failure-image"
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

  renderLoadingView = () => (
    <>
      <Header />
      <div className="banner-loader-container" testid="loader">
        <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
      </div>
    </>
  )

  switchMovieItem = () => {
    const {movieDetailApiStatus} = this.state
    switch (movieDetailApiStatus) {
      case 'loader':
        return this.renderLoadingView()

      case 'success':
        return this.renderMovieItemSuccessView()

      case 'failure':
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        {this.switchMovieItem()}
        <Footer />
      </div>
    )
  }
}

export default MovieItemDetail
