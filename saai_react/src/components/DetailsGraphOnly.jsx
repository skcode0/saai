import React, { useState, useEffect } from 'react';
import ProbGraph from './ProbGraph.jsx'
import './DetailsGraphOnly.css'
import PopUp from './PopUp.jsx'

function DetailsGraphOnly({emotions}){
    // chart options
    const [chartOptions, setChartOptions] = useState(null);

    // pop-up state
    const [showPopUp, setShowPopUp] = useState(false);
    // Pop-up control functions
    const openPopUp = () => setShowPopUp(true);
    const closePopUp = () => setShowPopUp(false);


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

    // Prevent rendering of ProbGraph until chartOptions is ready
    if (!chartOptions) {
        return <div>Loading...</div>;
    }

    return(
        <>
            <div className="details-only-wrapper">
                <ProbGraph emotions={emotions} chartOptions={chartOptions} limit={5}/>
                <button className="detail-only-button" onClick={openPopUp}>Click for details</button>
            </div>
            { showPopUp && <PopUp targetEmotions={emotions} closePopUp={closePopUp} chartOptions={chartOptions} />}
        </>
    )
}

export default DetailsGraphOnly