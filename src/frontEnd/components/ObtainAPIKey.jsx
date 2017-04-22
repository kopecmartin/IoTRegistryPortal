import React from 'react';

import CountDownClock from '../components/CountDownClock.jsx';

import { connect } from 'react-redux'


const ObtainAPIKey = ({APIKeyObject, buttons, deleteApiKey, extendApiKeyLife, getApiKey, timedOut}) => {
    const buttonStyle = {
        marginTop: 40
    };

    const textStyle = {
        fontSize: 25,
    };

    const countDownStyle = {
        marginLeft: "75%"
    };


    return (
        <div>
            {
                APIKeyObject === null ?
                    null
                    :
                    <div>
                        <p>Your API key is:</p>
                        <p style={textStyle}>{APIKeyObject.api_key}</p>
                        <div style={countDownStyle}>
                            <CountDownClock APIKeyObject={APIKeyObject}
                                            timedOut={timedOut}/>
                        </div>
                    </div>
            }

            <div style={buttonStyle}>
                {
                    APIKeyObject === null ?
                        <button className="btn btn-primary btn-lg "
                                type="button"
                                onClick={getApiKey}>
                            {buttons.generate}
                        </button>
                        :
                        <div>
                            <button className="btn btn-danger btn-lg"
                                    type="button"
                                    onClick={deleteApiKey}>
                                {buttons.expire}
                            </button>
                            <button className="btn btn-info btn-lg "
                                    type="button"
                                    onClick={extendApiKeyLife}>
                                {buttons.extendExpiration}
                            </button>
                        </div>
                }
            </div>
        </div>
    )
};

export default connect(
    (state) => ({
        buttons: state.switchLanguage.content.buttons,
    }),
   null
)(ObtainAPIKey)