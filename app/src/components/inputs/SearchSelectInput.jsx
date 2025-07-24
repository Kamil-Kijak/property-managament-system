
export default function SearchSelectInput({title = "title", value=null, onChange=() => {}, placeholder="Wybierz", options = <></>}) {
    return(
        <section className="flex flex-col items-start mb-2">
            <h1 className="font-bold">{title}</h1>
            <select className="border-2 border-black rounded-md px-2 py-1 bg-white w-full" value={value || ""} onChange={onChange}>
                {placeholder != "" && <option value="">{placeholder}</option>}
                {options}
            </select>
    </section>
    )
}