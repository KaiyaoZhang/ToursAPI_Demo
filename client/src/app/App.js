import React, {Component, Fragment} from 'react';
import { Container } from 'semantic-ui-react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from '../features/Navbar/Navbar';
import AllTours from '../features/ToursDashboard/allTours';
import TourDetailsPage from '../features/TourDetails/TourDetailsPage';

class App extends Component{
  render() {
    return(
      <Fragment>
        <Router>
          <NavBar/>
            
              <Switch>
                <Route exact path='/' render={() => (
                    <AllTours/>
                )}>
                </Route>
                <Route exact path='/tour/:name' render={(props) => (
                    <TourDetailsPage
                      {...props}
                    />
                )}>
                </Route>
              </Switch>
            
        </Router>
      </Fragment>
    )
  }
}

export default App;
