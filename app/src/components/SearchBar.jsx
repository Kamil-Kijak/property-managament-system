
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormStore } from "../hooks/stores/useFormStore";
import { useState } from "react";

export default function SearchBar({elements = <h1>Hello world</h1>, onSearch = () => {}}) {

    const form = useFormStore((state) => state.form);
    const [showed, setShowed] = useState(false);

    return (
        !form && 
        <>
        {
            showed ?
            <nav className="h-full top-0 bottom-0 right-0 bg-white fixed px-3 overflow-auto flex-col flex border-l-4 border-l-green-500">
                <section className="flex flex-col justify-center items-center flex-wrap gap-2">
                    <button className="base-btn text-xl mx-5" onClick={() => setShowed(prev => !prev)}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
                </section>
                <section className="flex flex-col justify-start flex-wrap gap-2">
                    <h1 className="text-center p-2 text-2xl font-bold">Wyszukiwarka</h1>
                    <div className="bg-green-500 w-full h-1.5 rounded-2xl my-3"></div>
                </section>
                <section className="flex flex-col justify-start flex-wrap gap-2">
                    {elements}
                </section>
                <section className="flex items-center">
                    <button className="base-btn text-xl" onClick={onSearch}><FontAwesomeIcon icon={faMagnifyingGlass}/> Szukaj</button>
                </section>
            </nav>
            :
            <button className="base-btn text-xl fixed top-0 right-6 " onClick={() => setShowed(prev => !prev)}>Wyszukiwarka</button>
        }
        </>
    )
}