import ReactCountdownClock from 'react-countdown-clock';
import React from 'react';


export default class CountDownClock extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            counter:  <ReactCountdownClock seconds={this.props.APIKeyObject.ttl}
                                           color="#0048bc"
                                           alpha={0.9}
                                           onComplete={this.props.timedOut}
                                           size={150}/>
        };
    }

    componentWillReceiveProps() {
        this.setState({counter: null}, function () {
            this.setState({counter: <ReactCountdownClock seconds={this.props.APIKeyObject.ttl}
                                                         color="#0048bc"
                                                         alpha={0.9}
                                                         onComplete={this.props.timedOut}
                                                         size={150}/>})
        });
    }

    render() {
        return (
            <div>
                {this.state.counter}
            </div>
        )
    }
};
