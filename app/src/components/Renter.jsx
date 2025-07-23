
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faEye, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState} from "react";
import { useWarningStore } from "../hooks/useScreensStore";
import { useUserStore } from "../hooks/useUserStore";
import Rent from "./Rent";

export default function Renter({obj, deleteRenter, editRenter, deleteRent}) {

    const warningUpdate = useWarningStore((state) => state.update);
    const user = useUserStore((state) => state.user)

    const [showingMore, setShowingMore] = useState(false);

    const showingMoreToggle = useCallback(() => {
        setShowingMore(prev => !prev)
    }, []);

    return (
        <section>
            <section className="border-b-8 border-b-green-500 flex gap-x-20 py-5 mb-10 items-center w-[1000px]">
                <h1 className="text-3xl">{obj.imie} {obj.nazwisko}</h1>
                <h1 className="text-3xl">tel:{obj.telefon}</h1>
                <section className="flex gap-x-5">
                    <button className="base-btn" onClick={showingMoreToggle}><FontAwesomeIcon icon={faEye}/> Pokaż {showingMore ? "mniej":"więcej"}</button>
                    <button className="info-btn" onClick={() => {editRenter(obj.ID)}}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                    {user.rola === "ADMIN" && <button className="warning-btn" onClick={() => {
                                        warningUpdate(true, "Uwaga", () => deleteRenter(obj.ID), () => warningUpdate(false), <>
                                            <p className="text-red-600 font-bold">
                                                Kiedy usuniesz tego dzierżawce usuniesz jednocześnie jego wszystkie dzierżawy
                                            </p>
                                            <p className="text-white font-bold text-lg mt-5">
                                                Czy napewno chcesz usunąć tego dzierżawce?
                                            </p>
                                        </>)
                                        }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>}
                </section>
            </section>
            {showingMore && obj.dzialki.map((ele, index) => <Rent key={index} ele={ele} deleteRent={deleteRent}/>)}
                <section className="flex gap-x-20 mt-10 items-center">
                    <h1 className="text-3xl font-bold ml-10">Suma czynszu:{obj.dzialki.reduce((acc, value) => acc + parseFloat((parseFloat(value.wysokosc_czynszu) * parseFloat(value.powierzchnia)).toFixed(2)), 0)}zł</h1>
                </section>
        </section>
    )
}