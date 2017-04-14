import React from 'react';

import CountDownClock from '../components/CountDownClock.jsx';


const ObtainAPIKey = ({getApiKey, deleteApiKey, extendApiKeyLife, APIKeyObject, timedOut}) => {
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
                            Generate
                        </button>
                        :
                        <div>
                            <button className="btn btn-danger btn-lg"
                                    type="button"
                                    onClick={deleteApiKey}>
                                Expire
                            </button>
                            <button className="btn btn-info btn-lg "
                                    type="button"
                                    onClick={extendApiKeyLife}>
                                Extend Expiration
                            </button>
                        </div>
                }
            </div>
        </div>
    )
};

export default ObtainAPIKey;