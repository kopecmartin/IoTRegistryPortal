import React from 'react';


const AddNewBtn = ({onClick}) => {

    return (
        <button type="button"
                className="btn fa fa-plus"
                style={{
                    width: 35,
                    height: 35
                }}
                onClick={onClick}/>
    )
};

export default AddNewBtn;