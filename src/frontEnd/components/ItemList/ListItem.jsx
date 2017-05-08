import React from 'react';
import AdditionalInfo from './AdditionalInfo.jsx';
import DropDown from '../Dropdown/DropDown.jsx';


const ListItem = ({data, additionalInfo = false, onClick, dropDownOptions}) => {

    const clickedItem = () => {
        if (onClick !== undefined && onClick !== null) {
            onClick(data);
        }
    };

    const clickedDropDownItem = (func) => {
        // call items function with data variable
        // so that the row on which was action called cab be identified
        func(data)
    };

    let arr = [];
    if (dropDownOptions !== null) {
        for (let i = 0; i < dropDownOptions.length; i++) {
            arr.push(
                {title: dropDownOptions[i].title, onClick: clickedDropDownItem.bind(this, dropDownOptions[i].onClick)}
            )

        }
    }

    /*
    <div className="list-view-pf-checkbox">
        <input type="checkbox"/>
    </div>
    */

    return (
        <div className="list-group-item" onClick={clickedItem}>

            {
                dropDownOptions !== null ?
                    <div className="list-view-pf-actions">
                        <DropDown button={
                            <button className="btn btn-link dropdown-toggle">
                                <span className="fa fa-ellipsis-v"/>
                            </button>
                        } items={arr}/>
                    </div>
                    :
                    null
            }

            <div className="list-view-pf-main-info">
                <div className="list-view-pf-left">
                    <span className="fa fa-plane list-view-pf-icon-sm"/>
                </div>
                <div className="list-view-pf-body">
                    <div className="list-view-pf-description">
                        <div className="list-group-item-heading">
                            {data.name || data.id}
                        </div>
                        <div className="list-group-item-text">
                            {data.description}
                        </div>
                    </div>
                    <div className="list-view-pf-additional-info">
                        {additionalInfo ?
                            <AdditionalInfo name={data.additionalInfoLst[0].name}
                                            number={data.additionalInfoLst[0].number}/>
                            :
                            null
                        }

                    </div>
                </div>
            </div>
        </div>
    )
};

export default ListItem;