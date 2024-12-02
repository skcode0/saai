import React, { useState } from 'react'
import {Chart as ChartJS} from 'chart.js/auto' // need this to render graphs; gives error if deleted
import {Bar} from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './ProbGraph.css'

// Register ChartDataLabels globally
ChartJS.register(ChartDataLabels);

function ProbGraph({ emotions, chartOptions, limit }){
    const colorBase = emotions.map(data => data.rgb)
    const generateColorSets = chartOptions.getColorFunc
    const options = chartOptions.options

    const { backgroundColor, borderColor } = generateColorSets(colorBase, 0.75);

    const sentimentLabels = emotions.map(data => data.emotion)
    const sentimentProbs = emotions.map(data => Math.round(data.probability * 100) / 100)

    // top n emotions
    const topEmotionsLabels = sentimentLabels.slice(0,limit);
    const topEmotionsProbs = sentimentProbs.slice(0,limit);

    // top n
    const topNData = {
        labels: topEmotionsLabels,
        datasets: [
            {
                data: topEmotionsProbs,
                backgroundColor: backgroundColor,
                  borderColor: borderColor,
                  borderWidth: 0.5,
                  borderRadius: 5,
            }
        ]
    }

    return(
        <>
            {/* Top N emotions */}
            <div className="topN-graph-wrapper topN-graph-only">
                <Bar data={topNData} options={options}/>
            </div>
        </>
    )

}

export default ProbGraph