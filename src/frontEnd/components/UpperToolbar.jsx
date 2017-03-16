import React from 'react';
import SearchBox from './SearchBox.jsx';


const UpperToolbar = ({addNewItemTrigger}) => {
    return (
        <div>
            <div className='btn-toolbar pull-left' style={{marginTop: 20}}>
                <button type="button" className="btn fa fa-plus" style={{width: 35, height: 35}} onClick={addNewItemTrigger}/>

                <SearchBox placeholder="Search" onChange={null}/>

                <button className="btn btn-link" type="button">
                    <span className="fa fa-sort-alpha-asc" style={{marginLeft: 10, fontSize: 22}}/>
                </button>
            </div>

            <div className="toolbar-pf-action-right" >
                <div className="form-group toolbar-pf-view-selector">
                    <button className="btn btn-link fa fa-th" style={{fontSize: 22}}/>
                    <button className="btn btn-link fa fa-th-large" style={{fontSize: 22}}/>
                    <button className="btn btn-link fa fa-th-list" style={{fontSize: 22}}/>
                </div>
            </div>
        </div>
    )
};

export default UpperToolbar;