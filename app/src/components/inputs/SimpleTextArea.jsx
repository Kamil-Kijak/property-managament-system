


export default function SimpleTextArea({type = "text", title = "title", placeholder="placeholder...", value = "", onChange=() =>{}}) {
    return (
        <section className="flex flex-col items-start mb-2">
            <h1 className="font-bold mb-1">{title}</h1>
            <textarea type={type} onChange={onChange}  placeholder={placeholder} className="border-2 border-black p-1 rounded-md bg-white h-[6rem] w-full resize-none" value={value || ""}></textarea>
        </section>
    )
}