import Emotions from '../components/Emotions'
import './Home.css'
import HomeGraph from '../components/HomeGraph.jsx'
import VadMic from '../components/VadMic.jsx'
import Button from '../components/Button.jsx'
import History from '../components/History.jsx'

function Home({sortedEmotions, transcription, websocket, id}){

  const TOP_N = 5;
  const topEmotions = sortedEmotions.slice(0, TOP_N);

  // TODO: add History jsx --> pass down data with useContext
  return (
    <>
      <VadMic websocket={websocket}/>
      <div className="app-wrapper">
        <p className="top-emotion"
          style={{backgroundColor: `rgba(${sortedEmotions[0].rgb})`}}
        >{sortedEmotions[0].emotion}</p>
        <Emotions topEmotions={topEmotions} transcription={transcription}/>
        <HomeGraph emotions={sortedEmotions} id={id}/>
        <History />
      </div>
    </>
  )
}

export default Home