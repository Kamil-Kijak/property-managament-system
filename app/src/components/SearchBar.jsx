
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SearchBar({elements = <h1>Hello world</h1>}) {
    return (
        <nav className="w-full bg-green-500 flex justify-between py-3 px-2 rounded-b-lg">
            <section className="flex justify-start flex-wrap">
                {elements}
            </section>
            <section>
                <button className="base-btn text-xl"><FontAwesomeIcon icon={faMagnifyingGlass}/> Szukaj</button>
            </section>
        </nav>
    )
}