import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { TeamMembers, Tasks } from '../../imports/collections.js';
import ReactTable from 'react-table';
import "react-table/react-table.css";

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
          accessor:'assignedTo'
        },
        {
          Header:'Iteration',
          accessor:'iteration'
        },
        {
          Header: 'Open Date',
          accessor:'openDate'
        },
        {
          Header: 'Close Date',
          accessor:'closeDate'
        }
      ];

      let events = (state, rowInfo, column, instance)=>{
        return {
          onClick: (e)=> this.onRowClick(rowInfo)
        }
      }
      let tasks = this.props.tasks;
      let defaultPageSize = tasks.length < 10? 10 : (tasks.length>20? tasks.length : 20);

      return <ReactTable filterable data={tasks} columns={columns}
          defaultFilterMethod={(filter,row) => row[filter.id].includes(filter.value)}
          defaultPageSize={defaultPageSize} getTrProps={events}
          noDataText='No tasks or bugs found' />;

  }
  render(){
    return <div className="tasks-grid">
      { this.renderGrid() }
    </div>
  }
}
export default withTracker(props => {
  let tasks = Tasks.find().fetch();

  return { tasks };
})(TasksGrid);
