

import {useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPen, faPlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "../../hooks/plain/useForm";
import InsertMpzp from "../../forms/insert/InsertMpzp";
import {useWarningStore } from "../../hooks/stores/useScreensStore";
import { useMpzpStore } from "../../hooks/stores/useResultStores";
import BasePage from "../plain/BasePage";
import DisplaySection from "../sections/DisplaySection";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore";
import EditMpzp from "../../forms/edit/EditMpzp";

export default function MpzpPage({}) {
    
    const warningUpdate = useWarningStore((state) => state.update);
    const {mpzp, updateMpzp, updateID, editID} = useMpzpStore();
    const updateForm = useFormStore((state) => state.updateForm);

    const API = useApi();

    const [editFormData, editErrors, setEditFormData] = useForm({
        "code":{regexp:/^[A-ZĄĘŚĆŻŹÓŁ]{2}$/, error:"Kod 2 litery"},
        "description":{regexp:/^.{0,49}$/, error:"Za długi"}
    })

    useEffect(() => {
        updateForm(null);
        API.getMpzp().then(result => {
            if(!result.error)
                updateMpzp(result.data)
        })
    }, [])
    const requestDelete = (ID) => {
        warningUpdate(false);
        API.deleteMpzp({ID_mpzp:ID}).then(result => {
            if(!result.error) {
                updateMpzp(mpzp.filter((obj) => obj.ID != ID));
            }
        })
    }
    return (
        <BasePage requiredRoles={["ADMIN"]}>
            <DisplaySection
                list={mpzp}
                template={(obj) =>
                    <section className="px-8 py-5 shadow-2xl shadow-black/35 flex items-center justify-between my-5" key={obj.ID}>
                        <h1 className="text-4xl text-green-600 font-bold">{obj.kod}</h1>
                        <section className="flex flex-col items-start justify-center">
                            <p className="mx-10 text-xl">{obj.opis}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <button className="info-btn" onClick={() => {
                                updateForm("edit")
                                updateID(obj.ID)
                                setEditFormData({
                                    code:obj.kod,
                                    description:obj.opis
                                })
                            }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                            <button className="warning-btn" onClick={() => {
                                warningUpdate(true, "Uwaga", () => requestDelete(obj.ID), () => warningUpdate(false),
                                    <>
                                        <p className="text-red-600 font-bold">
                                            Usunięcie tego MPZP spowoduje że każda działka która ma to MPZP w systemie zostanie usunięta nieodwracalnie
                                            </p>
                                        <p className="text-white font-bold text-lg mt-5">
                                            Czy napewno chcesz usunąć to MPZP?
                                        </p>
                                    </>
                                )
                            }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                        </section>
                    </section>
                }
                footer={
                    <button className="base-btn text-2xl" onClick={() => {
                        updateForm("insert")
                    }}><FontAwesomeIcon icon={faPlus}/> Dodaj nowy MPZP</button>
                }
            />
            <InsertMpzp/>
            <EditMpzp
                editFormData={editFormData}
                editErrors={editErrors}
                setEditFormData={setEditFormData}
            />
        
        </BasePage>
    )
}