import './Button.css'

function Button({text, link}){

    return(
        <>
            <a href={link} className="button">{text}</a>
        </>
    )
}

export default Button