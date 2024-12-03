import React, { useState, useEffect } from 'react';
import ProbGraph from './ProbGraph.jsx'
import './HomeGraph.css'
import PopUp from './PopUp.jsx'

function HomeGraph({emotions, chartOptions}){
    // pop-up state
    const [showPopUp, setShowPopUp] = useState(false);
    // Pop-up control functions
    const openPopUp = () => setShowPopUp(true);
    const closePopUp = () => setShowPopUp(false);

    return(
        <>
            <div className="details-only-wrapper">
                <ProbGraph emotions={emotions} chartOptions={chartOptions} limit={5}/>
                <button className="detail-only-button" onClick={openPopUp}>Expand Graph</button>
            </div>
            { showPopUp && <PopUp targetEmotions={emotions} closePopUp={closePopUp} chartOptions={chartOptions} />}
        </>
    )
}

export default HomeGraph