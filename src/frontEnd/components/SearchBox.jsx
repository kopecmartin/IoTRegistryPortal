import React from 'react';

const SearchBox = ({placeholder, onChange}) => {
    return (
        <div style={{float: "left", marginLeft: 25, lineHeight: 2.4}}>
            <input
                type="text"
                placeholder={placeholder}
                onChange={onChange} />
            <button type="button" className="fa fa-cog" style={{width: 35, height: 35}}/>
        </div>
    )
};

export default SearchBox;