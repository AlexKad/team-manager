import React from 'react';
import { Meteor } from  'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import DashboardPage from './components/dashboard-page';
import DetailsPage from './components/details-page';
import ConfigurePage from './components/configure-page';

class App extends React.Component {
  render() {
    return <BrowserRouter>
      <Switch>
        <Route path='/dashboard' component={DashboardPage}/>
        <Route path='/details' component={DetailsPage}/>
        <Route path='/team' component={ConfigurePage}/>
        <Redirect to='/dashboard'/>
      </Switch>
    </BrowserRouter>
  }
}

Meteor.startup(() =>{
  render(<App></App>, document.getElementById('app'));
});
