import React from 'react';
import SkyLight from 'react-skylight';


export default class PopupAddNew extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.refs.dialogWithCallBacks.show();
    }

    close() {
        this.props.close();
    }

    render() {
        const style = {
            height: '300px',
            overflow: 'scroll',
        };

        return (
            <div>
                <SkyLight
                    hideOnOverlayClicked
                    afterClose={this.close.bind(this)}
                    ref="dialogWithCallBacks"
                    title={this.props.title}>
                    <div style={style}>
                        {this.props.children}
                    </div>
                </SkyLight>
            </div>
        );
    }
}