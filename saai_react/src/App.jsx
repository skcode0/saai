import React, { useState, useEffect } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  // id, transcription, sentiments arr
  const [data, setData] = useState({
    id: "20250101_082407_0",
    transcription: "This is just a placeholder text.",
    sentiments: [
      { emotion: 'Admiration', probability: 0.20, rgb: '255, 99, 132' },
      { emotion: 'Amusement', probability: 0.18, rgb: '255, 159, 64' },
      { emotion: 'Anger', probability: 0.12, rgb: '255, 205, 86' },
      { emotion: 'Annoyance', probability: 0.08, rgb: '75, 192, 192' },
      { emotion: 'Approval', probability: 0.06, rgb: '54, 162, 235' },
      { emotion: 'Caring', probability: 0.05, rgb: '153, 102, 255' },
      { emotion: 'Confusion', probability: 0.04, rgb: '201, 203, 207' },
      { emotion: 'Curiosity', probability: 0.03, rgb: '255, 99, 71' },
      { emotion: 'Desire', probability: 0.03, rgb: '124, 252, 0' },
      { emotion: 'Disappointment', probability: 0.03, rgb: '255, 105, 180' },
      { emotion: 'Disapproval', probability: 0.02, rgb: '0, 255, 255' },
      { emotion: 'Disgust', probability: 0.02, rgb: '255, 69, 0' },
      { emotion: 'Embarrassment', probability: 0.02, rgb: '255, 215, 0' },
      { emotion: 'Excitement', probability: 0.02, rgb: '0, 255, 127' },
      { emotion: 'Fear', probability: 0.02, rgb: '255, 20, 147' },
      { emotion: 'Gratitude', probability: 0.02, rgb: '32, 178, 170' },
      { emotion: 'Grief', probability: 0.02, rgb: '255, 165, 0' },
      { emotion: 'Joy', probability: 0.02, rgb: '255, 228, 196' },
      { emotion: 'Love', probability: 0.02, rgb: '255, 105, 180' },
      { emotion: 'Nervousness', probability: 0.02, rgb: '135, 206, 250' },
      { emotion: 'Optimism', probability: 0.02, rgb: '255, 240, 245' },
      { emotion: 'Pride', probability: 0.01, rgb: '100, 149, 237' },
      { emotion: 'Realization', probability: 0.01, rgb: '255, 182, 193' },
      { emotion: 'Relief', probability: 0.01, rgb: '255, 99, 71' },
      { emotion: 'Remorse', probability: 0.01, rgb: '255, 140, 0' },
      { emotion: 'Sadness', probability: 0.01, rgb: '0, 206, 209' },
      { emotion: 'Surprise', probability: 0.01, rgb: '0, 191, 255' },
      { emotion: 'Neutral', probability: 0.01, rgb: '147, 112, 219' }
    ]
  })
  // store websocket connection
  const [ws, setWs] = useState(null);

  useEffect(() => {  
    const websocket = new WebSocket("ws://localhost:8000/ws")

    websocket.onopen = function() {
      console.log("WebSocket connection established.");
    }

    websocket.onerror = function() {
      console.error("WebSocket error!");
    }

    websocket.onclose = function() {
      console.log("WebSocket connection closed.");
    };

    websocket.onmessage = function(event){
      // receive messgae from backend
      const sentimentData = JSON.parse(event.data);
      
      // 28 colors
      const colorBase = [
        '255, 99, 132', // Red
        '255, 159, 64', // Orange
        '255, 205, 86', // Yellow
        '75, 192, 192', // Teal
        '54, 162, 235', // Blue
        '153, 102, 255', // Purple
        '201, 203, 207', // Grey
        '255, 99, 71',  // Tomato Red
        '124, 252, 0',  // Lime Green
        '255, 105, 180', // Hot Pink
        '0, 255, 255',  // Cyan
        '255, 69, 0',    // Orange Red
        '255, 215, 0',   // Gold
        '0, 255, 127',   // Spring Green
        '255, 20, 147',  // Deep Pink
        '32, 178, 170',  // Light Sea Green
        '255, 165, 0',   // Orange
        '255, 228, 196', // Bisque
        '255, 105, 180', // Hot Pink
        '135, 206, 250', // Light Sky Blue
        '255, 240, 245', // Lavender Blush
        '100, 149, 237', // Cornflower Blue
        '255, 182, 193', // Light Pink
        '255, 99, 71',   // Tomato
        '255, 140, 0',   // Dark Orange
        '0, 206, 209',   // Dark Turquoise
        '0, 191, 255',   // Deep Sky Blue
        '147, 112, 219', // Medium Purple
        '186, 85, 211'   // Medium Orchid
      ];

      // add corresponding colors to emotions
      const colorSentiments = sentimentData.sentiments.map((sentiment, index) => ({...sentiment, 'rgb': colorBase[index]}))
    
      // filter prob > 0
      // sort filtered emotions (desc)
      const cleaned_sentiments = [...colorSentiments].filter(emo => Math.round(emo.probability * 100) / 100).sort((a, b) => b.probability - a.probability);


      const cleaned_data = {
        id: sentimentData.id,
        transcription: sentimentData.transcription,
        sentiments: cleaned_sentiments
      }

      setData(cleaned_data)
    }

    setWs(websocket)

    return () => {
      //clean up function when we close page
      websocket.close();
    }

  }, []);
  
  if(data.length == 0){
    return(
      <div>Loading...</div>
    )
  }

  return(
      <BrowserRouter>
        <Routes>
          <Route index element={<Home data={data} websocket={ws}/>} />
          <Route path="/home" element={<Home data={data} websocket={ws} />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
