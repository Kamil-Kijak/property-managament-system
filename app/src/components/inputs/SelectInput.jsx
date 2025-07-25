
export default function SelectInput({title = "title", value=null, onChange=() => {}, placeholder="Wybierz", options = <></>}) {
    return(
        <section className="flex flex-col items-start mb-2">
            <h1 className="font-bold mb-1">{title}</h1>
            <select className="border-3 border-black rounded-md p-2 bg-white w-full" value={(value ?? "")} onChange={onChange}>
                {placeholder != "" && <option value="" className="hidden">{placeholder}</option>}
                {options}
            </select>
    </section>
    )
}