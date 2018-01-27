import React from 'react';
import { withRouter } from 'react-router';

class DetailsPage extends React.Component{
  constructor(props){
    super(props);
    this.state = { };
  }

  render(){
    return <div>Details Page</div>
 }
}

export default withRouter(DetailsPage);
