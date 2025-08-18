

import {useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faPen, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "../../hooks/plain/useForm";
import InsertGeneralPlan from "../../forms/insert/InsertGeneralPlan";
import {useWarningStore } from "../../hooks/stores/useScreensStore";
import { useGeneralPlansStore } from "../../hooks/stores/useResultStores";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useApi } from "../../hooks/plain/useApi";
import BasePage from "../plain/BasePage";
import DisplaySection from "../sections/DisplaySection";
import EditGeneralPlan from "../../forms/edit/EditGeneralPlan";

export default function GeneralPlansPage({}) {

    const warningUpdate = useWarningStore((state) => state.update);
    const {generalPlans, updateGeneralPlans, updateID} = useGeneralPlansStore();
    const updateForm = useFormStore((state) => state.updateForm);
    const form = useFormStore((state) => state.form);

    const API = useApi();

    const [editFormData, editErrors, setEditFormData] = useForm({
        "code":{regexp:/^[A-ZĄĘŚĆŻŹÓŁ]{2}$/, error:"Kod 2 litery"},
        "description":{regexp:/^.{0,70}$/, error:"Za długi"}
    })
    
    useEffect(() => {
        API.getGeneralPlans().then(result => {
            if(!result.error) {
                updateGeneralPlans(result.data)
            }
        })
    }, [])

    const requestDelete = (ID) => {
        warningUpdate(false);
        API.deleteGeneralPlan({ID_general_plan:ID}).then(result => {
            if(!result.error) {
                updateGeneralPlans(generalPlans.filter((obj) => obj.ID != ID))
            }
        });
    }
    return (
        <BasePage requiredRoles={["ADMIN"]}>
            <DisplaySection
                list={generalPlans}
                header={
                    <>
                        <h1 className="font-bold text-lg mt-5">Znalezione wyniki: {generalPlans.length}</h1>
                        <button className="base-btn text-2xl" onClick={() => {
                            updateForm("insert")
                        }}><FontAwesomeIcon icon={faPlus}/> Dodaj nowy plan ogólny</button>
                    </>
                }
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
                                            Usunięcie tego planu ogólnego spowoduje że każda działka która ma ten plan ogólny w systemie zostanie usunięta nieodwracalnie
                                            </p>
                                        <p className="text-white font-bold text-lg mt-5">
                                            Czy napewno chcesz usunąć ten plan ogólny?
                                        </p>
                                    </>
                                )
                            }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                        </section>
                    </section>
                }
            />
            {
                form == "insert" && <InsertGeneralPlan/>
            }
            <EditGeneralPlan
                editFormData={editFormData}
                editErrors={editErrors}
                setEditFormData={setEditFormData}
            />
        </BasePage>
    )
}