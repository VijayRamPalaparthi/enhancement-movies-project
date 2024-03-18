import {Link} from 'react-router-dom'
import './index.css'

const VideoItem = props => {
  const {obj} = props
  const {posterUrl, title, id} = obj
  return (
    <Link to={`/movies/${id}`}>
      <img src={posterUrl} alt={title} className="movie-poster" />
    </Link>
  )
}

export default VideoItem
