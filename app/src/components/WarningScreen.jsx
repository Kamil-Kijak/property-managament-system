
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faXmark, faCheck} from "@fortawesome/free-solid-svg-icons"

export default function WarningScreen({active = false, icon, title = "Uwaga", description = <p className="text-red-600 font-bold">Ostrzeżenie</p>, acceptCallback, cancelCallback}) {
    return (
        active && <>
            <section className="fixed top-0 bottom-0 right-0 left-0 bg-black/60 z-5"></section>
            <section className="fixed top-0 bottom-0 right-0 left-0 flex justify-center items-center z-10 ">
                <section className="base-card bg-black/75 relative w-[95%] rounded-none">
                    <FontAwesomeIcon icon={icon} className="absolute text-red-700 text-8xl top-[-50%]"/>
                    <h1 className="text-5xl text-red-700 my-2 font-bold">{title}</h1>
                    <div className="bg-red-700 w-[20rem] h-1 rounded-2xl my-3"></div>
                    {description}
                    <section className="flex justify-around my-5">
                        <button onClick={acceptCallback} className="base-btn mx-10"><FontAwesomeIcon icon={faCheck}/> Akceptuje</button>
                        <button onClick={cancelCallback} className="warning-btn mx-10"><FontAwesomeIcon icon={faXmark}/> Odrzucam</button>
                    </section>
                </section>
            </section>
        </>
    )
}