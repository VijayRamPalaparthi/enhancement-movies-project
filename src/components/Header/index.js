import {Link} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import './index.css'

const Header = props => {
  const {
    isHome,
    isPopular,
    isSearch,
    onChangeSearch,
    search,
    searchText,
  } = props
  const home = isHome ? 'header-name home-active' : 'header-name'
  const popular = isPopular ? 'header-name home-active' : 'header-name'

  const onChangeSearchInput = event => {
    onChangeSearch(event.target.value)
  }
  return (
    <div className="header-container">
      <div className="header">
        <div className="header-left-part">
          <Link to="/" className="link-container">
            <img
              src="https://res.cloudinary.com/djlwgb6z2/image/upload/v1704261345/Movies%20Mini%20Projects/Group_7399_bzwfor.png"
              className="header-logo"
              alt="website logo"
            />
          </Link>
          <ul className="header-list">
            <Link to="/" className="link-container">
              <li className={home}>Home</li>
            </Link>

            <Link to="/popular" className="link-container">
              <li className={popular}>Popular</li>
            </Link>
          </ul>
        </div>

        <div className="header-right-part">
          {isSearch && (
            <div className="search-container search-large">
              <input
                type="search"
                value={searchText}
                className="search"
                placeholder="Search"
                onChange={onChangeSearchInput}
              />
            </div>
          )}
          <Link to="/search">
            <button
              className="search-button"
              type="button"
              onClick={search}
              testid="searchButton"
            >
              <HiOutlineSearch size="20" color="#ffffff" />
            </button>
          </Link>

          <Link to="/account" className="link-container">
            <img
              src="https://res.cloudinary.com/djlwgb6z2/image/upload/v1704261450/Movies%20Mini%20Projects/Avatar_wyxhgh.png"
              alt="profile"
              className="profile-image"
            />
          </Link>
        </div>
      </div>
      {isSearch && (
        <div className="search-container search-md">
          <input
            type="search"
            value={searchText}
            className="search"
            placeholder="Search"
            onChange={onChangeSearchInput}
          />
          <button className="search-button" type="button" onClick={search}>
            <HiOutlineSearch size="15" color="#ffffff" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Header
