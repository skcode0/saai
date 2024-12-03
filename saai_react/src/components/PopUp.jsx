import {Chart as ChartJS} from 'chart.js/auto' // need this to render graphs; gives error if deleted
import {Bar} from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './PopUp.css'

function PopUp({targetEmotions, closePopUp, chartOptions}){
    const colorBase = targetEmotions.map(data => data.rgb)
    const generateColorSets = chartOptions.getColorFunc
    const options = chartOptions.options

    const { backgroundColor, borderColor } = generateColorSets(colorBase, 0.75);
 
    const sentimentLabels = targetEmotions.map(data => data.emotion)
    const sentimentProbs = targetEmotions.map(data => Math.round(data.probability * 100) / 100)

    // all emotions w/ prob > 0
    const allData = {
        labels: sentimentLabels,
        datasets: [
            {
                data: sentimentProbs,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 0.5,
                borderRadius: 5,
            }
        ]
    }


    return(
        <div className="all-pop-up">
            <div className="pop-up-background" onClick={closePopUp}></div>
            <div className="bar-wrapper">
                <Bar data={allData} options={options}/>
            </div>
        </div>
    )
}

export default PopUp