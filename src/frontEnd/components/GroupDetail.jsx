import React from 'react';

import {connect} from 'react-redux'


const GroupDetail = ({buttons, cancel, content, data}) => {

    return (
        <div>
            <div className={"form-group"}>
                <label className="col-xs-2 col-form-label">
                    {content.ownerEmail}
                </label>
                <div className="col-xs-6">
                    <p>
                        {data.email}
                    </p>
                </div>
            </div>

            <div className={"form-group"} style={{clear: 'both'}}>
                <label className="col-xs-2 col-form-label">
                    {content.description}
                </label>
                <div className="col-xs-6">
                    <p>
                        {data.description}
                    </p>
                </div>
            </div>

            <div className={"form-group"} style={{clear: 'both'}}>
                <label className="col-xs-2 col-form-label">
                    {content.members}
                </label>
                <div className="col-xs-6">
                    <p>
                        {data.members}
                    </p>
                </div>
            </div>

            <div style={{marginTop: 35, clear: 'both'}}>
                <button type="button"
                        className="btn btn-secondary"
                        onClick={cancel}>
                    {buttons.cancel}
                </button>
            </div>
        </div>
    )
};

export default connect(
    (state) => ({
        content: state.switchLanguage.content.page.userGroups,
        buttons: state.switchLanguage.content.buttons,
    }),
    null
)(GroupDetail)
