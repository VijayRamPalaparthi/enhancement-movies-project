import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import LoginRoute from './components/LoginRoute'
import HomeRoute from './components/HomeRoute'
import ProtectedRoute from './components/ProtectedRoute'
import MovieItemDetailRoute from './components/MovieItemDetailRoute'
import NotFoundRoute from './components/NotFoundRoute'
import SearchRoute from './components/SearchRoute'
import PopularRoute from './components/PopularRoute'
import AccountRoute from './components/AccountRoute'
import './App.css'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/login" component={LoginRoute} />
        <ProtectedRoute exact path="/" component={HomeRoute} />
        <ProtectedRoute exact path="/popular" component={PopularRoute} />
        <ProtectedRoute exact path="/search" component={SearchRoute} />
        <ProtectedRoute exact path="/account" component={AccountRoute} />
        <ProtectedRoute
          exact
          path="/movies/:id"
          component={MovieItemDetailRoute}
        />
        <Route path="/not-found" component={NotFoundRoute} />
        <Redirect to="/not-found" />
      </Switch>
    )
  }
}

export default App
