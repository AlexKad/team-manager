import React from 'react';

export default class Navigation extends React.Component{
  constructor(props){
    super(props);
    this.onNavChanged = this.onNavChanged.bind(this);
  }
  onNavChanged(view){
    this.props.onChanged(view);
  }

  render(){
    let activeView = this.props.activeView || 'current-sprint';

    return <div className="nav">
      <button onClick={()=>this.onNavChanged('current-sprint')} className={activeView=='current-sprint'? 'active': ''}>
        <i className="fa fa-calendar-o"/>
        <span>Current Sprint</span>
      </button>
      <button onClick={()=>this.onNavChanged('next-sprint')} className={activeView=='next-sprint'? 'active': ''}>
        <i className="fa fa-calendar" />
        <span>Plan Next Sprint</span>
      </button>
      <button onClick={()=>this.onNavChanged('team')} className={activeView=='team'? 'active': ''}>
        <i className="fa fa-users" />
        <span>Team & Workload</span>
      </button>
      <button onClick={()=>this.onNavChanged('gantt-chart')} className={activeView=='gantt-chart'? 'active': ''}>
        <i className="fa fa-bar-chart-o" />
        <span>Gantt Chart</span>
      </button>
    </div>
  }
}
