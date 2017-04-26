import React from 'react';

import './style.css';


export default class DropDown extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showMenu: "",
        }
    }

    onClick() {
        this.setState({
            showMenu: this.state.showMenu === "showMenu" ? "" : "showMenu"
        });
    }

    render() {

        const createItem = this.props.items.map((item) =>
            <a key={item.title}
               style={{
                   color: item.title === "Delete" ? "red" : "black",
               }}
               onClick={item.onClick}>
                {item.title}
            </a>
        );

        return (
            <div className={"dropdown " + this.state.showMenu}>
                <div onClick={this.onClick.bind(this)}>
                    {this.props.button}
                </div>
                <div className="dropdown-content" onMouseLeave={this.onClick.bind(this)}>
                    {createItem}
                </div>
            </div>
        );
    }
};

