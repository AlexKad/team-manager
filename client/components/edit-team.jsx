import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Team } from '../../imports/collections.js';
import ModalWnd from './modal-wnd';

class EditTeam extends React.Component{
  constructor(props){
    super(props);
    this.state={};
    this.onSave = this.onSave.bind(this);
    this.renderMember = this.renderMember.bind(this);
    this.onRemoveMember = this.onRemoveMember.bind(this);
    this.createNewTeam = this.createNewTeam.bind(this);
    this.onInviteUser = this.onInviteUser.bind(this);
    this.state = { team: props.team };
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.team && !this.state.team){
      this.setState({ team: nextProps.team });
    }
  }
  onSave(){
    let member = { name: this.nameInput.value };
    //TODO
    this.nameInput.value = '';
  }
  onInviteUser(){
    let userMail = this.nameInput.value;
    Meteor.call('inviteNewTeamUser', userMail, (err, msg)=>{
      if(err){ alert('There was an error trying to invite new team user.'); console.warn(err); }
      else if(msg) { alert('invitation was sent!'); console.log(msg); }
      else alert('User is added to your team!');
    });
    this.setState({showInviteWindow: false});
  }
  onRemoveMember(id){
    let flag = confirm('Are you sure you want to remove this team member?');
    if(flag){
        Meteor.call('removeUserFromTeam', id, (err)=>{
          if(err){ alert('There was an error trying to remove this user.'); console.warn(err); }
          else alert('User was removed from your team.');
        });
    }
  }
  createNewTeam(){
    let teamName=this.teamNameInput.value;
    Meteor.call('createNewTeam', teamName, (err, team) => {
        if (err) { alert('There was an error trying to create new team.'); console.warn(err); }
        else {
          this.setState({team});
          console.log('team saved');
        }
    });
  }
  renderMember(mem,isAdmin){
    return <div key={mem.id}>
      {mem.name} {isAdmin && <i className="action-icon fa fa-times" onClick={()=>this.onRemoveMember(mem.id)}></i> }
    </div>;
  }
  render(){
    let { teamUsers, user } = this.props;
    let { team, showInviteWindow } = this.state;
    let teamName = team? team.name: null;
    let isAdmin = user && user.info && user.info.isAdmin;
    teamUsers = teamUsers.filter((el)=>{ return el.id!=Meteor.userId() });

    return <div className="edit-team">
      { teamName ? <h3>{teamName}</h3> : <span><i>There is no team associated with the current user.</i></span>}
      { (!teamName && !isAdmin) ? <span><i> Please contact your system administrator.</i></span> : ''}
      { (!teamName &&  isAdmin) ?  <div>
                                    <input placeholder='New team' ref={ x=> this.teamNameInput = x }/>
                                    <button onClick={this.createNewTeam}>Create new team</button>
                                  </div> : ''}
      { teamName ? <div className="team-list">{ teamUsers.map(el=> this.renderMember(el,isAdmin) ) }</div> : '' }
      { teamName && isAdmin ? <div>
                                  <button onClick={()=>this.setState({showInviteWindow: !this.state.showInviteWindow})}>
                                    <i className="fa fa-user"></i> Invite new user
                                  </button>
                                </div> : ''}
        { showInviteWindow?
          <ModalWnd title='Invite new user' onClose={()=>this.setState({showInviteWindow:false})}>
            <input placeholder="John Smith" ref={ x=> this.nameInput = x }/>
            <button onClick={this.onInviteUser}>Add</button>
          </ModalWnd> : ''
        }
    </div>
   }
}

export default withTracker(props=>{
  Meteor.subscribe('Team');
  let teamUsers = Meteor.users.find().fetch();
  teamUsers = teamUsers.map(el=>{ return {id: el._id, name: el.info? el.info.name: ''} });

  let user = Meteor.users.findOne({ _id: Meteor.userId() });
  let teamId = user && user.info? user.info.teamId: null;
  let team;
  if(teamId) team = Team.findOne(teamId);
  return { teamUsers, user, team };
})(EditTeam)
