import {Link} from 'react-router-dom'
import './index.css'

const MovieItem = props => {
  const {movieData} = props
  const {id, title, posterUrl} = movieData

  return (
    <li className="movie-item">
      <Link to={`/movies/${id}`}>
        <img src={posterUrl} alt={title} className="movie-item-image" />
      </Link>
    </li>
  )
}

export default MovieItem
