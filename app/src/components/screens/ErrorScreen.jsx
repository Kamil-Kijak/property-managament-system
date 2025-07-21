
import { faWarning, faXmark} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { useErrorStore } from "../../hooks/useScreensStore"

export default function ErrorScreen() {
    const active = useErrorStore((state) => state.active)
    const update = useErrorStore((state) => state.update)

    return (
        active &&
        <section className="fixed top-0 left-1/12 right-1/12 bg-red-700 z-20 p-3 rounded-b-2xl flex">
            <button onClick={() => update(false)} className=" p-2 rounded-full cursor-pointer bg-red-700 hover:bg-red-600 w-[40px] h-[40px] transition-colors duration-150 ease-in-out"><FontAwesomeIcon icon={faXmark} className="text-2xl text-white"/></button>
            <section className="flex justify-center w-full">
                <p className="text-white font-bold text-lg text-center"><FontAwesomeIcon icon={faWarning}/> Wystąpił nieoczekiwany bład serwera. Sprawdź konsole bo więcej informacji o błędzie</p>
            </section>
        </section>
    )
}