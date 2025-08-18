

export default function SearchInput({type = "text", title = "title", placeholder="placeholder...", value = "", onChange=() =>{}, min=0}) {
    return (
        <section className="flex flex-col items-start mb-2">
            <h1 className="font-bold">{title}</h1>
            <input autoComplete="off" type={type} min={min} onChange={onChange}  placeholder={placeholder} className="border-2 border-black rounded-md bg-white p-1" value={value || ""} />
        </section>
    )
}