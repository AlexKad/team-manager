import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../../imports/collections.js';
import { Dropdown } from './dropdown';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { types, statuses, priorities } from '../../imports/constants.js';

class TasksGrid extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
    this.onRowClick = this.onRowClick.bind(this);
  }
  onRowClick(rowInfo){
    this.props.onTaskClick(rowInfo.original._id);
  }
  renderGrid(){
        let noFilter = () => null;

        var columns = [{
          Header:'Type',
          accessor:'type'
        },
        {
          Header: 'Name',
          accessor: 'name'
        },
        {
          Header:'Status',
          accessor:'status'
        },
        {
          Header:'Priority',
          accessor:'priority'
        },
        {
          Header:'Assigned To',
          accessor:'assignedTo',
          Cell: ({ original: task }) => {
            let personName = "";
            if(task.assignedTo){
              let member = Meteor.users.findOne(task.assignedTo);
              if(member) personName = member.info.name;
            }

            return personName;
          }
        },
        {
          Header:'Iteration',
          accessor:'iteration'
        },
        {
          Header: 'Opened',
          accessor:'openDate',
          Cell: ({ original: task }) => {
            if(task.openDate){
              let time = new Date(task.openDate);
              return time.toLocaleDateString();
            }
            else return '';
          }
        },
        {
          Header: 'Closed',
          accessor:'closeDate',
          Cell: ({ original: task }) => {
            if(task.closeDate){
              let time = new Date(task.closeDate);
              return time.toLocaleDateString();
            }
            else return '';
          }
        }
      ];

      let events = (state, rowInfo, column, instance)=>{
        return {
          onClick: (e)=> this.onRowClick(rowInfo)
        }
      }
      let tasks = this.props.tasks;
      let defaultPageSize = tasks.length < 10? 10 : (tasks.length>20? tasks.length : 20);

      return <ReactTable data={tasks} columns={columns}
          defaultFilterMethod={(filter,row) => row[filter.id].includes(filter.value)}
          defaultPageSize={defaultPageSize} getTrProps={events}
          noDataText='No tasks or bugs found' />;

  }
  render(){
    return <div className="tasks-grid">
      {/* <Dropdown items={teamMembers} onChange={this.onAssignedToChanged} selected={''}/> */}
      { this.renderGrid() }
    </div>
  }
}
export default withTracker(props => {
  let tasks = Tasks.find().fetch();

  return { tasks };
})(TasksGrid);
