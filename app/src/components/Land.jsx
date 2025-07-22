import { faEye, faPen, faTrashCan, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { useState } from "react";
import {useUserStore} from "../hooks/useUserStore"
import { useWarningStore } from "../hooks/useScreensStore";

export default function Land({obj, editLand, requestDelete, addRent}) {

    const warningUpdate = useWarningStore((state) => state.update)
    const user = useUserStore((state) => state.user)
    const [showingMore, setShowingMore] = useState(false);
    const showingMoreToggle = useCallback(() => {
        setShowingMore(prev => !prev)
    }, []);


    return (
        <section className="flex flex-col shadow-xl shadow-black/25 p-5 gap-y-6 text-center">
            <section className="flex items-center justify-start gap-x-5">
                <button className="base-btn" onClick={showingMoreToggle}><FontAwesomeIcon icon={faEye}/> Pokaż {showingMore ? "mniej":"więcej"}</button>
                {!obj.ID_dzierzawy && obj.przeznaczenie == "Dzierżawa" && <button className="base-btn" onClick={() => addRent(obj.ID)}><FontAwesomeIcon icon={faUser}/> Dodaj dzierżawe</button>}
                <button className="info-btn" onClick={() => editLand(obj.ID)}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                {user.rola === "ADMIN" && <button className="warning-btn" onClick={() => {
                    warningUpdate(true, "Uwaga", () => requestDelete(obj.ID), () => warningUpdate(false), <>
                        <p className="text-red-600 font-bold">
                            Kiedy usuniesz tą działkę utracisz wszystkie dane na temat tej działki
                        </p>
                        <p className="text-white font-bold text-lg mt-5">
                            Czy napewno chcesz usunąć tą działkę?
                        </p>
                    </>)
                    }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>}
            </section>
            <section className="flex justify-around gap-x-5">
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">ID działki</p>
                    <p>{obj.numer_seryjny_dzialki}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">Obręb</p>
                    <p>{obj.numer_seryjny_dzialki.split(".")[1]}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">Numer działki</p>
                    <p>{obj.nr_dzialki}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">Numer księgi wieczystej</p>
                    <p>{obj.nr_kw}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">Powierzchnia w ha</p>
                    <p>{obj.powierzchnia}ha</p>
                </section>
                <section className="flex flex-col items-center">
                    <p className="font-bold mb-3">Lokalizacja</p>
                    <p>{obj.wojewodztwo}, {obj.powiat}</p>
                    <p>{obj.gmina}, {obj.miejscowosc}</p>
                </section>
            </section>
            {
                showingMore &&
                <>
                    <section className="flex justify-around gap-x-5">
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Spółka wodna</p>
                            <p>{obj.spolka_wodna == 1 ? "TAK" : "NIE"}</p>
                        </section>
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Hipoteka</p>
                            <p>{obj.hipoteka == 1 ? "TAK" : "NIE"}</p>
                        </section>
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">MPZP</p>
                            <p>{obj.mpzp}</p>
                        </section>
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Plan ogólny</p>
                            <p>{obj.plan_ogolny}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Przeznaczenie</p>
                            <p>{obj.przeznaczenie}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Rodzaj</p>
                            <p>{obj.rodzaj}</p>
                        </section>
                    </section>
                    <section className="flex justify-around gap-x-5">
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Dzierżawiona</p>
                            <p>{obj.ID_dzierzawy ? "TAK" : "NIE"}</p>
                        </section>
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Właściciel</p>
                            <p>{obj.w_imie} {obj.w_nazwisko}</p>
                        </section>
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Data nabycia</p>
                            <p>{new Date(obj.data_nabycia).toLocaleDateString()}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Numer aktu nabycia</p>
                            <p>{obj.nr_aktu}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Od kogo</p>
                            <p>{obj.sprzedawca}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Cena zakupu</p>
                            <p>{obj.cena_zakupu}zł</p>
                        </section>
                    </section>
                    <section className="flex flex-col items-center gap-y-3 px-10">
                        <p className="font-bold">Opis</p>
                        <p>{obj.opis} </p>
                    </section>
                
                </>
            }
        </section>
    )
}