import './Emotions.css'

// load in all sentiment gifs
const gifs = import.meta.glob('../assets/sentiments/*.gif', { eager: true });

// home page
function Emotions({topEmotions, transcription}){
    // Change image based on top emotion
    const topEmotion = topEmotions[0].emotion.toLowerCase()
   
    const matchingGif = Object.entries(gifs).find(([path]) =>
        path.includes(`${topEmotion}.gif`)
    );

    return(
        <div className="emotion-wrapper">
            <img src={matchingGif[1].default} alt={topEmotion} className="emotion-visual" />

            {/* transcription */}
            <p className="transcript">"{transcription}"</p>

            {/* Top N emotions list */}
            <div className="top-emotions-wrapper">
                {
                    topEmotions.map((e, index) => (
                        <span key={index}
                            style={{
                                color: `rgba(${e.rgb})`,
                                marginRight: '5px', // Add spacing between emotions
                            }} >
                            
                            {`${e.emotion}: ${Math.round(e.probability * 100)}%`}
                            {index < topEmotions.length - 1 && ','} {/* Add comma unless it's the last element */}
                        </span>
                    ))
                }
            </div>
        </div>
    )
}

export default Emotions