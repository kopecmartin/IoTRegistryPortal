import React from 'react';
import AdditionalInfo from './AdditionalInfo.jsx';


const ListItem = ({data, additionalInfo=false}) => {

    return (
        <div className="list-group-item">
            <div className="list-view-pf-checkbox">
                <input type="checkbox"/>
            </div>
            <div className="list-view-pf-actions">
                <div className="dropdown pull-right dropdown-kebab-pf">
                    <button className="btn btn-link dropdown-toggle" type="button" id="dropdownKebabRight9"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        <span className="fa fa-ellipsis-v"/>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebabRight9">
                        <li><a href="#">Action</a></li>
                        <li><a href="#">Another action</a></li>
                        <li><a href="#">Something else here</a></li>
                        <li role="separator" className="divider"/>
                        <li><a href="#">Separated link</a></li>
                    </ul>
                </div>
            </div>
            <div className="list-view-pf-main-info">
                <div className="list-view-pf-left">
                    <span className="fa fa-plane list-view-pf-icon-sm"/>
                </div>
                <div className="list-view-pf-body">
                    <div className="list-view-pf-description">
                        <div className="list-group-item-heading">
                            {data.name}
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