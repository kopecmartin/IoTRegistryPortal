import React from 'react';
import UpperToolbar from '../components/UpperToolbar.jsx';


const Devices = () => {
    const style = {
        clear: "both",
        paddingTop: 20,
    };

    return (
        <div>
            <h1>Devices</h1>
            <UpperToolbar/>

            <div style={style}>
                <h2>Device Groups</h2>
            </div>
        </div>
    )
};

export default Devices;