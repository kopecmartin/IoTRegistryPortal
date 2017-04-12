import React from 'react';
import ListItem from './ListItem.jsx';
import EmptyListItem from './EmptyListItem.jsx';


function CreateItems(props) {
    const items = props.data;
    const additionalInfo = props.additionalInfo;
    const createItem = items.map((item) =>
        <ListItem data={item} key={item.name} additionalInfo={additionalInfo}/>
    );
    return (
        <ul>{createItem}</ul>
    );
}

const List = ({data, additionalInfo=false}) => {

    return (
        <div className="list-group list-view-pf list-view-pf-view">
            {
                data.length === 0 ? <EmptyListItem/> : <CreateItems data={data} additionalInfo={additionalInfo}/>
            }

        </div>
    )
};

export default List;

