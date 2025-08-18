
import {useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPen, faPlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "../../hooks/plain/useForm";
import InsertLandType from "../../forms/insert/InsertLandType";
import {useWarningStore } from "../../hooks/stores/useScreensStore";
import { useLandTypesStore } from "../../hooks/stores/useResultStores";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore";
import BasePage from "../plain/BasePage";
import DisplaySection from "../sections/DisplaySection";
import EditLandType from "../../forms/edit/EditLandType";

export default function LandTypesPage({}) {
    
    const warningUpdate = useWarningStore((state) => state.update)
    const {landTypes, updateLandTypes, updateID} = useLandTypesStore();
    const updateForm = useFormStore((state) => state.updateForm);
    const form = useFormStore((state) => state.form);
    
    const API = useApi();

    const [editFormData, editErrors, setEditFormData] = useForm({
        "name":{regexp:/^[A-Za-zĄĘŚĆŻŹÓŁąęłćśóżź]{0,49}$/, error:"Za długi"}
    })

    useEffect(() => {
        API.getLandTypes().then(result => {
            if(!result.error) {
                updateLandTypes(result.data);
            }
        })
    }, [])

    const requestDelete = (ID) => {
        warningUpdate(false);
        API.deleteLandType({ID_land_type:ID}).then(result => {
            if(!result.error) {
                updateLandTypes(landTypes.filter((obj) => obj.ID != ID));
            }
        })
    }
    return (
        <BasePage requiredRoles={["ADMIN"]}>
            <DisplaySection
                list={landTypes}
                header={
                    <>
                        <h1 className="font-bold text-lg mt-5">Znalezione wyniki: {landTypes.length}</h1>
                        <button className="base-btn text-2xl" onClick={() => {
                            updateForm("insert")
                        }}><FontAwesomeIcon icon={faPlus}/> Dodaj nowy rodzaj działki</button>
                    
                    </>
                }
                template={(obj) =>
                    <section className="px-8 py-5 shadow-2xl shadow-black/35 flex items-center justify-between my-5" key={obj.ID}>
                        <h1 className="text-4xl text-green-600 font-bold">ID: {obj.ID}</h1>
                        <section className="flex flex-col items-start justify-center">
                            <h1 className="mx-10 text-2xl">{obj.nazwa}</h1>
                        </section>
                        <section className="flex flex-col items-center">
                            <button className="info-btn" onClick={() => {
                                updateForm("edit");
                                updateID(obj.ID)
                                setEditFormData({
                                    name:obj.nazwa
                                });
                            }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                            <button className="warning-btn" onClick={() => {
                                warningUpdate(true, "Uwaga", () => requestDelete(obj.ID), () => warningUpdate(false),
                                    <>
                                        <p className="text-red-600 font-bold">
                                            Usunięcie tego typu działki spowoduje że każda działka która ma ten typ w systemie zostanie usunięta nieodwracalnie
                                            </p>
                                        <p className="text-white font-bold text-lg mt-5">
                                            Czy napewno chcesz usunąć ten typ działki?
                                        </p>
                                    </>
                                )
                            }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                        </section>
                    </section>
                }
            />
            {
                form == "insert" &&
                <InsertLandType/>  
            }
            <EditLandType
                editFormData={editFormData}
                editErrors={editErrors}
                setEditFormData={setEditFormData}
            />
        </BasePage>
    )
}