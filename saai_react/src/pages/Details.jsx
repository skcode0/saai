import React, { useState, useEffect } from 'react';
import Button from '../components/Button.jsx'
import MessageBubble from '../components/MessageBubble.jsx'
import ProbGraph from '../components/ProbGraph.jsx'
import './Details.css'
import PopUp from '../components/PopUp.jsx'

// TODO
// rename this to History.jsx; put it in components folder
// import to Home.jsx
// show history transcriptions and corresponding buttons to expand graph
// (don't show graph)

// TODO: URGENT!!! Need to make sure details keep generating even when user's at home page. Data keeps refreshing whenever not at details page 
function Details({emotions, transcription}){
    // TODO: later, implement loading in previous messages if requested

    // get messages
    const [messages, setMessages] = useState([]);

    // chart options
    const [chartOptions, setChartOptions] = useState();

    // pop-up state
    const [showPopUp, setShowPopUp] = useState(false);
    // Pop-up control functions
    const openPopUp = () => setShowPopUp(true);
    const closePopUp = () => setShowPopUp(false);
    // keep track of id for popup
    const [target, setTarget] = useState();

    useEffect(() =>{
        // Prevent adding empty or unchanged messages
        if (!transcription || emotions.length === 0) return;

        // TODO: need to move this. Probably need to set id on backend
        // create new message id (based on current local date/time)
        const messageId = new Date().toLocaleString()
        
        const newMessage = {
                            id: messageId, 
                            content: transcription,
                            sentiments: emotions
                        }
        // append message to list of messages dict
        setMessages(m => [...m, newMessage]);
        
    }, [emotions, transcription]);


    // for chartjs color options
    useEffect(() =>{
    // Function to store color sets
    const generateColorSets = (baseColors, opacity) => {
        const backgroundColor = baseColors.map(color => `rgba(${color}, ${opacity})`); // Add opacity to background colors
        const borderColor = baseColors.map(color => `rgba(${color})`); // No opacity needed for border color
        return { backgroundColor, borderColor };
    };

    // chartjs options
    const options = {

        responsive: true,
        indexAxis: 'y', // Horizontal bars
        scales: {
          x: {
            beginAtZero: true,
            max: 1,
          },
          y:{
            ticks:{
                font:{
                    size: 11
                }
            }
          }
        },
        plugins: {
            title: {
                display: true,
                text: 'Sentiment Probabilities',
            },
            legend: {
                display: false,
            },
            datalabels: {
                anchor: 'end', // Attach the label to the end of the bar
                align: 'end',  // Align the label to the bar's edge
                formatter: (value) => value.toFixed(2), // Format the value
                color: (context) => {
                    // Access background color of the bar
                    return context.dataset.backgroundColor[context.dataIndex];
                },
                font: {
                    weight: 'bold',
                },
            },
        },
    }

    setChartOptions({getColorFunc: generateColorSets, options: options})

    }, [])

    // find the right sentiments when popup button pressed
    function loadTargetSentiments(e){
        const targetId = e.target.id;

        const targetMessage = messages.find(message => message.id === targetId)

        setTarget(targetMessage.sentiments)
        openPopUp()
    }

    // console.log("message:", messages)

    return(
        <div className="details-wrapper">
            <VadMic />
            <div className="message-wrapper">
                {
                    messages.map(message =>(
                        <div key={message.id} className="message-section">
                            <MessageBubble timestamp={message.id} newMessage={message.content}/>
                            <ProbGraph emotions={message.sentiments} chartOptions={chartOptions} limit={5}/>
                            <button id={message.id} className="detail-button" onClick={loadTargetSentiments}>Click for details</button>
                        </div>
                    ))
                }
            </div>
            { showPopUp && <PopUp targetEmotions={target} closePopUp={closePopUp} chartOptions={chartOptions} />}
            <Button text="Go Home" link="/"/>
        </div>
    )
}

export default Details