
import {useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faPen, faTrashCan, faXmark} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "../../hooks/plain/useForm";
import InsertLandPurpose from "../../forms/insert/InsertLandPurpose";
import {useWarningStore } from "../../hooks/stores/useScreensStore";
import { useLandPurposesStore } from "../../hooks/stores/useResultStores";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useApi } from "../../hooks/plain/useApi";
import BasePage from "../plain/BasePage";
import DisplaySection from "../sections/DisplaySection";
import EditLandPurpose from "../../forms/edit/EditLandPurpose";

export default function LandPurposesPage({}) {

    const warningUpdate = useWarningStore((state) => state.update);
    const updateForm = useFormStore((state) => state.updateForm);
    const form = useFormStore((state) => state.form);
    const {landPurposes, updateLandPurposes, updateID} = useLandPurposesStore();

    const API = useApi();

    const [editFormData, editErrors, setEditFormData] = useForm({
        "type":{regexp:/^[A-Za-zĄĘŚĆŻŹÓŁąęłćśóżź]{0,49}$/, error:"Za długi"}
    })

    useEffect(() => {
        API.getLandPurposes().then(result => {
            if(!result.error) {
                updateLandPurposes(result.data)
            }
        })
    }, [])

    const requestDelete = (ID) => {
        warningUpdate(false);
        API.deleteLandPurpose({ID_land_purpose:ID}).then(result => {
            if(!result.error) {
                updateLandPurposes(landPurposes.filter((obj) => obj.ID != ID))
            }
        });
    }
    return (
        <BasePage requiredRoles={["ADMIN"]}>
            <DisplaySection
                list={landPurposes}
                header={
                    <>
                        <h1 className="font-bold text-lg mt-5">Znalezione wyniki: {landPurposes.length}</h1>
                        <button className="base-btn text-2xl" onClick={() => {
                            updateForm("insert")
                        }}><FontAwesomeIcon icon={faPlus}/> Dodaj nowe przeznaczenie działki</button>
                    </>
                }
                template={(obj) => 
                    <section className="px-8 py-5 shadow-2xl shadow-black/35 flex items-center justify-between my-5" key={obj.ID}>
                        <h1 className="text-4xl text-green-600 font-bold">ID: {obj.ID}</h1>
                        <section className="flex flex-col items-start justify-center">
                            <h1 className="mx-10 text-2xl">{obj.typ}</h1>
                        </section>
                        <section className="flex flex-col items-center">
                            <button className="info-btn" onClick={() => {
                                updateForm("edit");
                                updateID(obj.ID)
                                setEditFormData({
                                    type:obj.typ
                                });
                            }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                            <button className="warning-btn" onClick={() => {
                                warningUpdate(true, "Uwaga", () => requestDelete(obj.ID), () => warningUpdate(false),
                                    <>
                                        <p className="text-red-600 font-bold">
                                            Usunięcie tego przeznaczenia działki spowoduje że każda działka która ma to przeznaczenie w systemie zostanie usunięta nieodwracalnie
                                            </p>
                                        <p className="text-white font-bold text-lg mt-5">
                                            Czy napewno chcesz usunąć to przeznaczenie działki?
                                        </p>
                                    </>
                                )
                            }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                        </section>
                    </section>
                }
            />
            {
                form == "insert" && <InsertLandPurpose/>
            }
            <EditLandPurpose
                editFormData={editFormData}
                editErrors={editErrors}
                setEditFormData={setEditFormData}
            />
        </BasePage>
    )
}