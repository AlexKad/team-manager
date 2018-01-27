import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { TeamMembers, Tasks } from '../../imports/collections.js';
import ReactTable from 'react-table';
import "react-table/react-table.css";

class TasksGrid extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  renderGrid(){
        let noFilter = () => null;

        var columns = [{
          Header:'Type',
          accessor:'type'
        },
        // {
        //   Header:'Description',
        //   accessor:'description'
        // },
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

        return <ReactTable filterable data={this.props.tasks} columns={columns}
          defaultFilterMethod={(filter,row) => row[filter.id].includes(filter.value)}
          noDataText='No tasks or bugs found' />;

  }
  render(){
    return <div>
      { this.renderGrid() }
    </div>
  }
}
export default withTracker(props => {
  let tasks = Tasks.find().fetch();

  return { tasks };
})(TasksGrid);
