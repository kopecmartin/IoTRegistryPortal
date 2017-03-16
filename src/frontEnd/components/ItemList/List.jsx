import React from 'react';
import ListItem from './ListItem.jsx';


function CreateItems(props) {
    const items = props.data;
    const createItem = items.map((item) =>
        <ListItem data={item} key={item.name}/>
    );
    return (
        <ul>{createItem}</ul>
    );
}

const List = ({data}) => {

    return (
        <div className="list-group list-view-pf list-view-pf-view">
            <CreateItems data={data}/>
        </div>
    )
};

export default List;

