import React from 'react';

import './style.css';


const DropDown = ({items}) => {

    const createItem = items.map((item) =>
        <a key={item.title}
           style={{
               color: item.title === "delete" ? "red" : "black",
           }}
           onClick={item.onClick}>
            {item.title}
        </a>
    );

    return (
        <div className="dropdown">
            <button className="btn btn-link dropdown-toggle">
                <span className="fa fa-ellipsis-v"/>
            </button>
            <div className="dropdown-content">
                {createItem}
            </div>
        </div>
    );
};

export default DropDown;
