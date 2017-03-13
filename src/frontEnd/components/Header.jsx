import React from 'react';


const Header = () => {
    const iconStyle = {
        "color": "#fff",
        "fontSize": 20,
        "margin": 3,
    };

    const userInfoStyle = {
        "float": "right",
        "marginRight": 25,
        "marginTop": 10,
        "cursor": "pointer",
    };

    return (
        <nav className="navbar navbar-pf-vertical">
            <div className="navbar-header">
                <a href="/" className="navbar-brand">
                    <img className="navbar-brand-name" alt="IoT Registry Portal" />
                </a>
            </div>
            <div style={userInfoStyle}>
                <span className="fa fa-user" style={iconStyle}/>
                <span className="fa fa-angle-down" style={iconStyle}/>
            </div>
        </nav>
    )
};

export default Header;