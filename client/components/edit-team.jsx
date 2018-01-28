import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { TeamMembers } from '../../imports/collections.js';

class EditTeam extends React.Component{
  constructor(props){
    super(props);
    this.state={};
    this.onSave = this.onSave.bind(this);
    this.renderMember = this.renderMember.bind(this);
    this.onRemoveMember = this.onRemoveMember.bind(this);
  }
  onSave(){
    let member = { name: this.nameInput.value };
    Meteor.call('saveTeamMember', member, (err)=>{
      if(err) console.warn(err);
      else console.log('saved');
    });
    this.nameInput.value = '';
  }
  onRemoveMember(id){
    let flag = confirm('Are you sure you want to remove this team member?');
    if(flag){
        Meteor.call('removeTeamMember', id, (err)=>{
        if(err) console.warn(err);
        else console.log('removed');
      });
    }
  }
  renderMember(mem){
    return <div key={mem._id}>{mem.name}<i className="action-icon fa fa-times" onClick={()=>this.onRemoveMember(mem._id)}></i></div>;
  }
  render(){
    let {team} = this.props;

    return <div>
      { team.map(el=> this.renderMember(el) ) }
      <input placeholder="John Smith" ref={ x=> this.nameInput = x }/>
      <button onClick={this.onSave}>Save</button>
    </div>
   }
}

export default withTracker(props=>{
  let team = TeamMembers.find().fetch() || [];
  return { team };
})(EditTeam)
