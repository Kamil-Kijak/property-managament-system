import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { screenContext, userContext } from "../App";

export default function Owner({obj}) {
    const screens = useContext(screenContext);
    const user = useContext(userContext);

    return (
        <section>
            <section className="border-b-8 border-b-green-500 flex gap-x-20 py-5 mb-10 items-center">
                <h1 className="text-3xl">{obj.imie} {obj.nazwisko}</h1>
                <h1 className="text-3xl">tel:{obj.telefon}</h1>
                <section className="flex gap-x-5">
                    <button className="info-btn"><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                    {user.value.rola == "ADMIN" && <button className="warning-btn"><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>}
                </section>
            </section>
            {
                obj.dzialki.map((ele, index) => <section key={index} className="flex shadow-xl shadow-black/25 p-5 gap-x-20 text-center">
                    <section className="flex flex-col items-center gap-y-3">
                        <p className="font-bold">ID działki</p>
                        <p>{ele.numer_seryjny_dzialki}</p>
                    </section>
                    <section className="flex flex-col items-center gap-y-3">
                        <p className="font-bold">Obręb</p>
                        <p>{ele.numer_seryjny_dzialki.split(".")[1]}</p>
                    </section>
                    <section className="flex flex-col items-center gap-y-3">
                        <p className="font-bold">Numer działki</p>
                        <p>{ele.nr_dzialki}</p>
                    </section>
                    <section className="flex flex-col items-center gap-y-3">
                        <p className="font-bold">Powierzchnia w ha</p>
                        <p>{ele.powierzchnia}ha</p>
                    </section>
                    <section className="flex flex-col items-center">
                        <p className="font-bold mb-3">Lokalizacja</p>
                        <p>{ele.wojewodztwo}, {ele.powiat}</p>
                        <p>{ele.gmina}, {ele.miejscowosc}</p>
                    </section>
                     <section className="flex flex-col items-center gap-y-3">
                        <p className="font-bold">Przeznaczenie</p>
                        <p>{ele.typ}</p>
                    </section>
                </section>)
            }
        </section>
    )
}