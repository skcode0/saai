import Emotion from '../components/Emotions'
import Button from '../components/Button'
import './Home.css'
import DetailsGraphOnly from '../components/DetailsGraphOnly.jsx'
import VadMic from '../components/VadMic.jsx'

function Home({sortedEmotions, transcription, websocket}){

  const TOP_N = 5;
  const topEmotions = sortedEmotions.slice(0, TOP_N);

  return (
    <>
      <VadMic websocket={websocket}/>
      <div className="app-wrapper">
        <p className="top-emotion"
          style={{backgroundColor: `rgba(${sortedEmotions[0].rgb})`}}
        >{sortedEmotions[0].emotion}</p>
        <Emotion topEmotions={topEmotions} transcription={transcription}/>
        <DetailsGraphOnly emotions={sortedEmotions}/>
        {/* <Button text="See Details " link='/details'/> */}
      </div>
    </>
  )
}

export default Home