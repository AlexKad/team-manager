import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Team } from '../../imports/collections.js';

class EditTeam extends React.Component{
  constructor(props){
    super(props);
    this.state={};
    this.onSave = this.onSave.bind(this);
    this.renderMember = this.renderMember.bind(this);
    this.onRemoveMember = this.onRemoveMember.bind(this);
    this.createNewTeam = this.createNewTeam.bind(this);
  }
  onSave(){
    let member = { name: this.nameInput.value };
    //TODO
    this.nameInput.value = '';
  }
  onRemoveMember(id){
    let flag = confirm('Are you sure you want to remove this team member?');
    if(flag){
        //TODO
    }
  }
  createNewTeam(){
    let teamName=this.teamNameInput.value;
    Meteor.call('createNewTeam', teamName, (err) => {
        if (err) { alert('There was an error trying to create new team.'); console.warn(err); }
        else console.log('team saved');
    });
  }
  renderMember(mem){
    return <div key={mem.id}>{mem.name}<i className="action-icon fa fa-times" onClick={()=>this.onRemoveMember(mem.id)}></i></div>;
  }
  render(){
    let { teamUsers, user, team} = this.props;
    let teamName = team? team.name: null;
    let isAdmin = user && user.info? user.info.isAdmin : false;

    return <div className="edit-team">
      { teamName ? <h3>{teamName}</h3> : <span><i>There is no team associated with the current user.</i></span>}
      { (!teamName && !isAdmin) ? <span><i> Please contact your system administrator.</i></span> : '' }
      { (!teamName &&  isAdmin) ? <div>
                                    <input placeholder='New team' ref={ x=> this.teamNameInput = x }/>
                                    <button onClick={this.createNewTeam}>Create new team</button>
                                  </div> : '' }
      { teamName ? <div className="team-list">{ teamUsers.map(el=> this.renderMember(el) ) }</div> : '' }
      { (teamName && isAdmin) ? <div>
                                  <input placeholder="John Smith" ref={ x=> this.nameInput = x }/>
                                  <button onClick={this.onSave}>Save</button>
                                </div> : ''}
    </div>
   }
}

export default withTracker(props=>{
  Meteor.subscribe('Team');
  let teamUsers = Meteor.users.find().fetch();
  teamUsers = teamUsers.map(el=>{ return {id: el._id, name: el.info? el.info.name: ''} });

  let user = Meteor.users.findOne({ _id: Meteor.userId() });
  let teamId = user.info? user.info.teamId: null;
  let team;
  if(teamId) team = Team.findOne(teamId);
  return { teamUsers, user, team };
})(EditTeam)
