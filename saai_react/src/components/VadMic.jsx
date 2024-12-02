import React, { useState, useEffect } from 'react'
import { useMicVAD, utils } from "@ricky0123/vad-react"
import './VadMic.css'

function VadMic({ websocket }){
    const [audioSent, setAudioSent] = useState(false) // indicate whether audio is sent to backend

    const vad = useMicVAD({
        onSpeechStart: () => {
            setAudioSent(false)
        },
        startOnLoad: true,
        positiveSpeechThreshold: 0.5,
        negativeSpeechThreshold: 0.4,
        redemptionFrames: 12,
        preSpeechPadFrames: 5,
        minSpeechFrames: 7,
        onSpeechEnd: (audio) => {
            if (audio.length > 0){
                setAudioSent(true);

                // send audio array to backend
                if (websocket && websocket.readyState === WebSocket.OPEN) {
                    websocket.send(utils.encodeWAV(audio)); // WAV binary
                    console.log("Data sent.")
                }
                else{
                    console.error("Websocket not open. Unable to send audio.")
                }
            }
        },
    })

    return(
        <div className="vad-container">
            {vad.listening && <div>VAD is running</div>}
            {vad.userSpeaking && <span style={{ color: "green" }}>Speech detected.</span>}
            {!vad.userSpeaking && <span style={{ color: "red" }}>Speech not detected.</span>}
            {audioSent && <span style={{ color: "blue", display: "block" }}>Audio sent for processing.</span>}
        </div>
    )

}

export default VadMic