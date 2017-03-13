import React from 'react';
import UpperToolbar from '../components/UpperToolbar.jsx';


const UserGroups = () => {
    const style = {
        clear: "both",
        paddingTop: 20,
    };

    return (
        <div>
            <h1>User Groups</h1>
            <UpperToolbar/>

            <div style={style}>
                <h2>My Groups</h2>

                <h2>Member in</h2>
            </div>
        </div>
    )
};

export default UserGroups;