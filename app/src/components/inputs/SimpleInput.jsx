

export default function SimpleInput({type = "text", title = "title", placeholder="placeholder...", value = "", step = null, min = null, onChange=() =>{}, width=null}) {
    return (
        <section className="flex flex-col items-start mb-2">
            <h1 className="font-bold mb-1">{title}</h1>
            <input type={type} step={step} min={min} onChange={onChange}  placeholder={placeholder} className="border-2 border-black p-2 rounded-md bg-white" value={value || ""} />
        </section>
    )
}