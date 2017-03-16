import React from 'react';


const AdditionalInfo = ({name, number}) => {

    const findIcon = (name) => {
        switch (name) {
            case "Members":
                return "fa fa-user";
            case "Subgroups":
                return "fa fa-users";
            case "Devices":
                return "fa fa-microchip";
            default:
                return "fa fa-question";
        }
    };

    return (
        <div className="list-view-pf-additional-info-item">
            <span className={findIcon(name)}/>
            <strong>{number}</strong> {name}
        </div>
    )
};

export default AdditionalInfo;