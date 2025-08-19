import { faList} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"


export default function SumarizeSection({children}) {

    const [showed, setShowed] = useState(false);
    return (
        <section className="flex flex-col gap-y-5 items-center">
            <button className="base-btn text-2xl" onClick={() => {
                setShowed(prev => !prev);
            }}><FontAwesomeIcon icon={faList}/> {showed ? "Ukryj" : "Pokaż"} podsumowanie</button>
            <section>
                {showed && children}
            </section>
        </section>
    )
}