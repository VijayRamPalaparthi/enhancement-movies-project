import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'
import MovieItem from '../MovieItem'

class SearchRoute extends Component {
  state = {
    searchResultMoviesList: [],
    resultApiStatus: 'initial',
    searchText: '',
  }

  onChangeSearchText = text => {
    if (text === '') {
      this.setState({searchText: text}, this.getSearchedMovies)
      //  this.setState({searchText: text}, this.getSearchedMovies())  --> don't write like this
    } else {
      this.setState({searchText: text})
    }
  }

  onClickSearchButton = () => {
    this.getSearchedMovies()
  }

  componentDidMount = () => {
    this.getSearchedMovies()
  }

  getSearchedMovies = async () => {
    const {searchText} = this.state
    const jwtToken = Cookies.get('jwt_token')
    this.setState({resultApiStatus: 'loader'})
    const url = `https://apis.ccbp.in/movies-app/movies-search?search=${searchText}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const fetchedData = await fetch(url, options)

    const data = await fetchedData.json()
    console.log(data)
    if (fetchedData.ok) {
      const updatedData = data.results.map(each => ({
        backdropImageUrl: each.backdrop_path,
        id: each.id,
        overview: each.overview,
        posterUrl: each.poster_path,
        title: each.title,
      }))
      this.setState({
        searchResultMoviesList: updatedData,
        resultApiStatus: 'success',
      })
    } else {
      this.setState({resultApiStatus: 'failure'})
    }
  }

  renderSearchResultSuccessView = () => {
    const {searchResultMoviesList, searchText} = this.state
    const moviesCount = searchResultMoviesList.length

    if (moviesCount === 0) {
      return (
        <div className="no-result-view-container">
          <img
            src="https://res.cloudinary.com/dc2b69ycq/image/upload/v1670000784/Movies%20App/Not_Found_qfz2oz.png"
            alt="no movies"
            className="no-result-image"
          />
          <p className="no-result-text">
            {`
          Your search for ${searchText} did not find any matches.`}
          </p>
        </div>
      )
    }

    return (
      <ul className="search-videoItem-container">
        {searchResultMoviesList.map(each => (
          <MovieItem movieData={each} key={each.id} />
        ))}
      </ul>
    )
  }

  retryPopular = () => {
    this.getSearchedMovies()
  }

  renderFailureView = () => (
    <div className="popular-failure-container">
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

  switchSearchResult = () => {
    const {resultApiStatus} = this.state
    switch (resultApiStatus) {
      case 'loader':
        return this.renderLoadingView()

      case 'success':
        return this.renderSearchResultSuccessView()

      case 'failure':
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    const {searchText} = this.props
    return (
      <div className="popular-bg-container">
        <Header
          isSearch
          onChangeSearch={this.onChangeSearchText}
          search={this.onClickSearchButton}
          searchText={searchText}
        />
        {this.switchSearchResult()}
      </div>
    )
  }
}

export default SearchRoute
