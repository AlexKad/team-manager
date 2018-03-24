import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

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
    //TODO
    this.nameInput.value = '';
  }
  onRemoveMember(id){
    let flag = confirm('Are you sure you want to remove this team member?');
    if(flag){
        //TODO
    }
  }
  renderMember(mem){
    return <div key={mem.id}>{mem.name}<i className="action-icon fa fa-times" onClick={()=>this.onRemoveMember(mem.id)}></i></div>;
  }
  render(){
    let {team} = this.props;

    return <div className="edit-team">
      <h3>Team</h3>
      <div className="team-list">{ team.map(el=> this.renderMember(el) ) }</div>
      <input placeholder="John Smith" ref={ x=> this.nameInput = x }/>
      <button onClick={this.onSave}>Save</button>
    </div>
   }
}

export default withTracker(props=>{
  let team = Meteor.users.find().fetch();
  team = team.map(el=>{ return {id: el._id, name: el.info.name} });
  return { team };
})(EditTeam)
