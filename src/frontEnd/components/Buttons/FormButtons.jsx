import React from 'react';
import Loading from '../Loading.jsx';


export default class FormButtons extends React.Component {
    render() {

        let errorMsg = null;
        if (this.props.errorMsg !== null) {
            errorMsg = <strong className="form-text alert alert-danger"
                               style={{marginLeft: 50}}>
                {this.props.errorMsg}
            </strong>;
        }

        return (
            <div className='btn-toolbar form-actions' style={{marginTop: 35}}>
                <button type="button" className="btn btn-secondary" onClick={this.props.cancel}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={this.props.submit}>Submit</button>
                {this.props.pending ? <Loading form={true}/> : null}
                {errorMsg}
            </div>
        )
    }
}
