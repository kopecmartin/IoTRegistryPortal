import React from 'react';

import AddNewBtn from '../Buttons/AddNewBtn.jsx';
import NewInfluxDB from './AddNewInfluxDB.jsx';
import ShowInfluxDBs from '../ShowInfluxDBs.jsx';


export default class AssociateDB extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            addNewDatabase: false,
        }
    }

    addNewTrigger() {
        this.setState({addNewDatabase: !this.state.addNewDatabase});
    }

    render() {

        return (
           <div>
                Create a new Influx database or choose one of the databases below.
               <div className='btn-toolbar pull-left' style={{marginTop: 20}}>
                    <AddNewBtn onClick={this.addNewTrigger.bind(this)}/>
               </div>

               {
                   this.state.addNewDatabase ?
                       <NewInfluxDB cancel={this.addNewTrigger.bind(this)}/>
                       :
                       <ShowInfluxDBs/>
               }

           </div>
        )
    }
}
