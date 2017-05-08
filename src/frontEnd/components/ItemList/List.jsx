import React from 'react';
import ListItem from './ListItem.jsx';
import EmptyListItem from './EmptyListItem.jsx';


function CreateItems(props) {
    const items = props.data;
    const additionalInfo = props.additionalInfo;
    const dropDownOptions = props.dropDownOptions;
    const createItem = items.map((item) =>
        <ListItem data={item}
                  key={item._id}
                  additionalInfo={additionalInfo}
                  dropDownOptions={dropDownOptions}
                  onClick={props.onClick}/>
    );
    return (
        <ul>{createItem}</ul>
    );
}

const List = ({data, additionalInfo=false, onClick, dropDownOptions=null}) => {

    return (
        <div className="list-group list-view-pf list-view-pf-view">
            {
                data.length === 0 ? <EmptyListItem/> : <CreateItems data={data}
                                                                    onClick={onClick}
                                                                    dropDownOptions={dropDownOptions}
                                                                    additionalInfo={additionalInfo}/>
            }

        </div>
    )
};

export default List;

