import './MessageBubble.css';

function MessageBubble({timestamp, messageText}){
    // Get date 
    const time_split = timestamp.split('_');

    // Get time
    const date_unclean = time_split[0];
    const time_unclean = time_split[1];

    const date = `${date_unclean.slice(0, 4)}-${date_unclean.slice(4, 6)}-${date_unclean.slice(6, 8)}`;

    let hour = Number(time_unclean.slice(0, 2))
    let isPm = false
    // 12-hour format (AM/PM)
    if(hour > 12){
        hour -= 12
        isPm = true
    }
    else{
        isPm = false
    }
    // if hour is not 2-digit, pad 0 in front
    if(hour < 10){
        hour = `0${hour}`
    }

    const time = `${hour}:${time_unclean.slice(2, 4)}:${time_unclean.slice(4, 6)} ${isPm ? "PM" : "AM"}`;

    return(
        <div className="bubble-wrapper"> 
            <div className="timestamp-wrapper">
                <div>{date}</div>
                <div>{time}</div>
            </div>
            <p className="bubble">{messageText}</p>
        </div>
    )
}

export default MessageBubble