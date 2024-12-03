import React, { useState } from 'react';
import MessageBubble from './MessageBubble.jsx';
import PopUp from './PopUp.jsx';
import './History.css'

// show 100 most recent messages
function History({messageList, chartOptions}){
    // keep track of of target sentiments
    const [target, setTarget] = useState([]);

    // pop-up state
    const [showPopUp, setShowPopUp] = useState(false);
    // Pop-up control functions
    const openPopUp = () => setShowPopUp(true);
    const closePopUp = () => setShowPopUp(false);

    // find the right sentiments when popup button pressed
    function loadTargetSentiments(e){
        const targetId = e.target.id;

        const targetMessage = messageList.find(message => message.id === targetId)

        setTarget(targetMessage.sentiments)
        openPopUp()
    }

    return(
        <div className="history-wrapper">
            <h2>100 Most recent Messages</h2>
            <div className="message-wrapper">
                {
                    messageList.map(message =>(
                        <div key={message.id} className="message-section">
                            <MessageBubble timestamp={message.id} messageText={message.transcription}/>
                            <button id={message.id} className="detail-button" onClick={loadTargetSentiments}>Click for details</button>
                        </div>
                    ))
                }
            </div>
            { showPopUp && <PopUp targetEmotions={target} closePopUp={closePopUp} chartOptions={chartOptions} />}
        </div>
    )
}

export default History
