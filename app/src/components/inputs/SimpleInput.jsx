
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCircleExclamation} from "@fortawesome/free-solid-svg-icons"

export default function SimpleInput({type = "text", title = "title", placeholder="placeholder...", value = "", step = null, min = null, onChange=() =>{}, error=null}) {
    return (
        <section className="flex flex-col items-start mb-5 relative">
            <section className="flex justify-start items-center w-full gap-x-5">
                <h1 className={`font-bold mb-1 ${error && "text-red-700"}`}>{title}</h1>
            </section>
            <input type={type} step={step} min={min} onChange={onChange}  placeholder={placeholder} className={`border-3 ${error ? "border-red-700" : "border-black"} p-2 rounded-md bg-white`} value={value || ""} />
            {error && <h1 className="text-md text-red-700 font-bold absolute top-[100%] max-w-screen whitespace-nowrap overflow-auto"><FontAwesomeIcon icon={faCircleExclamation} className="text-md text-red-700"/> {error}</h1>}
        </section>
    )
}