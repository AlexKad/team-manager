import React from 'react';
import { withRouter } from 'react-router';

class ConfigurePage extends React.Component{
  constructor(props){
    super(props);
    this.state = { };
  }

  render(){
    return <div>Configure Page</div>
 }
}

export default withRouter(ConfigurePage);
