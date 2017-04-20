import React from 'react';
import ListItem from './ListItem.jsx';
import EmptyListItem from './EmptyListItem.jsx';


function CreateItems(props) {
    const items = props.data;
    const additionalInfo = props.additionalInfo;
    const createItem = items.map((item) =>
        <ListItem data={item} key={item.name} additionalInfo={additionalInfo} onClick={props.onClick}/>
    );
    return (
        <ul>{createItem}</ul>
    );
}

const List = ({data, additionalInfo=false, onClick}) => {

    return (
        <div className="list-group list-view-pf list-view-pf-view">
            {
                data.length === 0 ? <EmptyListItem/> : <CreateItems data={data}
                                                                    onClick={onClick}
                                                                    additionalInfo={additionalInfo}/>
            }

        </div>
    )
};

export default List;

