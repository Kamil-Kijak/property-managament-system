import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useWarningStore} from "../hooks/stores/useScreensStore"
import { useUserStore } from "../hooks/stores/useUserStore";
import { useFormStore } from "../hooks/stores/useFormStore";
import { useOwnersStore } from "../hooks/stores/useResultStores";

export default function Owner({obj, requestDelete, setEditFormData}) {

    const warningUpdate = useWarningStore((state) => state.update)
    const user = useUserStore((state) => state.user);
    const updateForm = useFormStore((state) => state.updateForm);
    const updateID = useOwnersStore((state) => state.updateID);

    return (
        <section>
            <section className="border-b-8 border-b-green-500 flex gap-x-20 py-5 mb-10 items-center">
                <h1 className="text-3xl">{obj.dane_osobowe}</h1>
                <h1 className="text-3xl">tel:{obj.telefon || "BRAK"}</h1>
                <section className="flex gap-x-5">
                    <button className="info-btn" onClick={() => {
                        updateForm("edit")
                        updateID(obj.ID);
                        setEditFormData({
                            personal_data:obj.dane_osobowe,
                            phone:obj.telefon || ""
                        })
                        }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                    {user.rola == "ADMIN" && <button className="warning-btn" onClick={() => {
                        warningUpdate(true, "Uwaga", () => requestDelete(obj.ID), () => warningUpdate(false),
                        <>
                            <p className="text-red-600 font-bold">
                                Kiedy usuniesz tego właściciela jednocześnie zostaną usunięte jego działki w systemie
                            </p>
                            <p className="text-white font-bold text-lg mt-5">
                                Czy napewno chcesz usunąć tego własciciela?
                            </p>
                        </>
                    
                        )
                        }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>}
                </section>
            </section>
            {
                obj.dzialki.map((ele, index) => <section key={index} className="flex shadow-xl shadow-black/25 p-5 gap-x-20 mb-5 text-center">
                    <section className="flex flex-col items-center gap-y-3">
                        <p className="font-bold">ID działki</p>
                        <p>{ele.numer_seryjny_dzialki || "BRAK"}</p>
                    </section>
                    <section className="flex flex-col items-center gap-y-3">
                        <p className="font-bold">Obręb</p>
                        <p>{ele.numer_seryjny_dzialki ? ele.numer_seryjny_dzialki.split(".")[1] : "BRAK"}</p>
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
                        <p>{ele.typ || "BRAK"}</p>
                    </section>
                </section>)
            }
        </section>
    )
}