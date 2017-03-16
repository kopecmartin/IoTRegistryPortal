import React from 'react';
import ImageLoader from 'react-imageloader';


export default class Loading extends React.Component {

    render() {

        let type = this.props.form || null;

        let toRender = (
            <div className="table-responsive" style={{clear: "both", margin: "auto"}}>
                <p style={{textAlign: "center", marginTop: 100}}>
                    <ImageLoader src={require("../../../public/img/loading.gif")}/>
                </p>
            </div>
        );

        if (type) {
            toRender = (
                <div className="table-responsive">
                    <p style={{width: 30, height: 30, marginLeft: 30}}>
                        <ImageLoader src={require("../../../public/img/loadingForm.gif")}/>
                    </p>
                </div>
            )
        }

        return (
            <div>
                {toRender}
            </div>
        );
    }
}
