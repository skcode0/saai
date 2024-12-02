import React, { useState, useEffect } from 'react';
import './MessageBubble.css';

function MessageBubble({timestamp, newMessage}){
    // Get date 
    const dateOnly = timestamp.split(', ')[0];

    // Get time
    const timeOnly = timestamp.split(', ')[1];

    return(
        <div className="bubble-wrapper"> 
            <div className="timestamp-wrapper">
                <div>{dateOnly}</div>
                <div>{timeOnly}</div>
            </div>
            <p className="bubble">{newMessage}</p>
        </div>
    )
}

export default MessageBubble