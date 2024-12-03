import Emotions from '../components/Emotions.jsx'
import './Home.css'
import HomeGraph from '../components/HomeGraph.jsx'
import VadMic from '../components/VadMic.jsx'
import History from '../components/History.jsx'
import React, { useState, useEffect } from 'react'

function Home({data, websocket, wsStatus}){
  const transcription = data.transcription
  const emotions = data.sentiments

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
  const chartOptions = {
    getColorFunc: generateColorSets,
    options: options
  }

  const TOP_N = 5;
  const topEmotions = emotions.slice(0, TOP_N);

  // save previous messages
  const [messages, setMessages] = useState([]);
  useEffect(() =>{
    setMessages(m => {
      const messageList = [...m, data];

      // only keep 100 latest messages
      if(messages.length > 100){
        messageList.shift();
      }

      return messageList
    })

  }, [data])

  return (
    <>
      <VadMic websocket={websocket} wsStatus={wsStatus}/>
      <div className="app-wrapper">
        <p className="top-emotion"
          style={{backgroundColor: `rgba(${emotions[0].rgb})`}}
        >{emotions[0].emotion}</p>
        <Emotions topEmotions={topEmotions} transcription={transcription}/>
        <HomeGraph emotions={emotions} chartOptions={chartOptions}/>
        <br /> <br /> <br />
        <History messageList={messages} chartOptions={chartOptions}/>
        <br />
        <br />
      </div>
    </>
  )
}

export default Home