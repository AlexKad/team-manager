import React from 'react';
import { Meteor } from  'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { LoginPage } from  './components/login-page';
import { RegistrationPage } from './components/registration-page';
import DashboardPage from './components/dashboard-page';
import DetailsPage from './components/details-page';
import ConfigurePage from './components/configure-page';

class AuthenticatedRoute extends Route {
  render() {
    if (!Meteor.loggingIn() && !Meteor.userId()) {
      return <Redirect to='/login' />;
    } else {
      return <this.props.component />;
    }
  }
}
class App extends React.Component {
  render() {
    return <BrowserRouter>
      <Switch>
        <Route path='/login' component={LoginPage}/>
        <Route path='/registration/:teamId?' component={RegistrationPage}/>
        <AuthenticatedRoute path='/dashboard' component={DashboardPage}/>
        <AuthenticatedRoute path='/details' component={DetailsPage}/>
        <AuthenticatedRoute path='/team' component={ConfigurePage}/>
        <Redirect to='/login'/>
      </Switch>
    </BrowserRouter>
  }
}

Meteor.startup(() =>{
  render(<App></App>, document.getElementById('app'));
});
