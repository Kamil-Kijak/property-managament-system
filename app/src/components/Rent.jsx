import { faEye, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import { useWarningStore } from "../hooks/stores/useScreensStore";
import { useUserStore } from "../hooks/stores/useUserStore";

export default function Rent({ele, deleteRent, editRent}) {

    const warningUpdate = useWarningStore((state) => state.update);
    const user = useUserStore((state) => state.user);

    const formatDate = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleDateString()
    }

    const showingMoreToggle = useCallback(() => {
        setShowingMore(prev => !prev)
    }, []);

    const [showingMore, setShowingMore] = useState(false);

    return (
        <section className="flex flex-col shadow-xl shadow-black/25 p-5 gap-y-6 mb-5 text-center">
            {
                new Date(ele.data_zakonczenia).getTime() < Date.now() && <p className="text-2xl text-start text-red-700 font-bold">Dzierżawa przedawniona</p>
            }
            <section className="flex items-center justify-start gap-x-5">
                <button className="base-btn" onClick={showingMoreToggle}><FontAwesomeIcon icon={faEye}/> Pokaż {showingMore ? "mniej":"więcej"}</button>
                <button className="info-btn" onClick={() => editRent(ele.ID)}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                {user.rola === "ADMIN" && <button className="warning-btn" onClick={() => {
                    warningUpdate(true, "Uwaga", () => deleteRent(ele.ID), () => warningUpdate(false), <>
                        <p className="text-white font-bold text-lg mt-5">
                            Czy napewno chcesz usunąć tą dzierżawe nieodwracalnie?
                        </p>
                    </>)
                    }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                }
                <p className="text-xl font-bold">Właściciel: {ele.w_dane_osobowe} tel:{ele.w_telefon || "BRAK"}</p>
            </section>
            <section className="flex justify-around gap-x-10">
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">ID działki</p>
                    <p>{ele.numer_seryjny_dzialki || "BRAK"}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">data rozpoczęcia/zakończenia Dzierżawy</p>
                    <p>{formatDate(ele.data_rozpoczecia)} / {formatDate(ele.data_zakonczenia)}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">data wystawenia faktury</p>
                    <p>{formatDate(ele.data_wystawienia_fv_czynszowej).split(".").slice(0, 2).join(".")}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">Powierzchnia w ha</p>
                    <p>{ele.powierzchnia}ha</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">Suma czynszu</p>
                    <p>{(parseFloat(ele.wysokosc_czynszu) * parseFloat(ele.powierzchnia)).toFixed(2)}zł</p>
                </section>
            </section>
            {
                showingMore &&
                <section className="flex justify-around gap-x-10">
                    <section className="flex flex-col items-center gap-y-3">
                        <p className="font-bold">Stawka czynszu za ha</p>
                        <p>{ele.wysokosc_czynszu}zł</p>
                    </section>
                    <section className="flex flex-col items-center">
                        <p className="font-bold mb-3">Lokalizacja działki</p>
                        <p>{ele.wojewodztwo}, {ele.powiat}</p>
                        <p>{ele.gmina}, {ele.miejscowosc}</p>
                    </section>
                </section>
            }
        </section>
    )
}