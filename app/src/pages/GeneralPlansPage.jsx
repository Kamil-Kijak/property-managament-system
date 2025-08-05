

import {useState, useEffect, useRef} from "react";
import NavBar from "../components/NavBar"
import { useRequest } from "../hooks/useRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faPen, faTrashCan, faXmark} from "@fortawesome/free-solid-svg-icons";
import WarningScreen from "../components/screens/WarningScreen";
import { useForm } from "../hooks/useForm";
import InsertGeneralPlan from "../forms/InsertGeneralPlan";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";
import SimpleInput from "../components/inputs/SimpleInput";
import SimpleTextArea from "../components/inputs/SimpleTextArea"
import { useGeneralPlansStore } from "../hooks/useResultStores";

export default function GeneralPlansPage({}) {
    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update);
    const {generalPlans, updateGeneralPlans, updateID, editID} = useGeneralPlansStore();

    const request = useRequest();

    const [editFormData, editErrors, setEditFormData] = useForm({
        "code":{regexp:/^[A-ZĄĘŚĆŻŹÓŁ]{2}$/, error:"Kod 2 litery"},
        "description":{regexp:/^.{0,70}$/, error:"Za długi"}
    })
    const [form, setForm] = useState(null);
    const getGeneralPlans = () => {
        loadingUpdate(true);
        request("/api/general_plans/get", {}).then(result => {
            if(!result.error) {
                updateGeneralPlans(result.data)
            }
            loadingUpdate(false);
        })
    }
    
    useEffect(() => {
        getGeneralPlans();
    }, [])

    const requestDelete = (ID) => {
        warningUpdate(false);
        loadingUpdate(true);
        request("/api/general_plans/delete", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_general_plan:ID})
            }).then(result => {
                if(!result.error) {
                    updateGeneralPlans(generalPlans.filter((obj) => obj.ID != ID))
                }
                loadingUpdate(false);
            })
    }
    const requestEditGeneralPlan = () => {
        loadingUpdate(true);
        setForm(null);
        request("/api/general_plans/update", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_general_plan:editID, ...editFormData})
            }).then(result => {
                if(!result.error) {
                    getGeneralPlans();
                }
                loadingUpdate(false);
            })
    }
    const validateForm = () => {
        if(Object.keys(editFormData).length == 2) {
            if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    return (
        <main className="flex justify-between">
            <WarningScreen
                title="Uwaga"
                cancelCallback={() => screens.warning.set(false)}
                acceptCallback={() => requestDelete()}
                description={
                    <>
                         <p className="text-red-600 font-bold">
                            Usunięcie tego planu ogólnego spowoduje że każda działka która ma ten plan ogólny w systemie zostanie usunięta nieodwracalnie
                            </p>
                        <p className="text-white font-bold text-lg mt-5">
                            Czy napewno chcesz usunąć ten plan ogólny?
                        </p>
                    </>
                }
            />
            <NavBar requiredRoles={["ADMIN"]}/>
            <section className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5">
                {!form &&
                <>
                    <section className="my-10">
                        {generalPlans.map((ele) => {
                            return (
                                <section className="px-8 py-5 shadow-2xl shadow-black/35 flex items-center justify-between my-5" key={ele.ID}>
                                    <h1 className="text-4xl text-green-600 font-bold">{ele.kod}</h1>
                                    <section className="flex flex-col items-start justify-center">
                                        <p className="mx-10 text-xl">{ele.opis}</p>
                                    </section>
                                    <section className="flex flex-col items-center">
                                        <button className="info-btn" onClick={() => {
                                            setForm("edit");
                                            updateID(ele.ID)
                                            setEditFormData({
                                                code:ele.kod,
                                                description:ele.opis
                                            })
                                        }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                                        <button className="warning-btn" onClick={() => {
                                            warningUpdate(true, "Uwaga", () => requestDelete(ele.ID), () => warningUpdate(false),
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
                            )
                        })}
                    </section>
                    <button className="base-btn text-2xl" onClick={() => {
                        setForm("insert")
                    }}><FontAwesomeIcon icon={faPlus}/> Dodaj nowy plan ogólny</button>
                </>}
                {
                    form == "insert" &&
                    <InsertGeneralPlan getGeneralPlans={getGeneralPlans} setForm={setForm}/>
                }
                {
                    form == "edit" && <>
                        <section className="my-10">
                            <button className="base-btn text-2xl" onClick={() => setForm(null)}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
                        </section>
                        <section className="base-card">
                            <h1 className="text-2xl my-2 text-center">Edycja planu ogólnego</h1>
                            <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                            <section className="py-2 flex-col items-center">
                                <SimpleInput
                                    title="Kod planu"
                                    placeholder="plan code..."
                                    value={editFormData.code}
                                    onChange={(e) => setEditFormData(prev => ({...prev, code:e.target.value}))}
                                    error={editErrors.code}
                                />
                                <SimpleTextArea
                                    title="Opis planu"
                                    placeholder="plan descrption..."
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData(prev => ({...prev, description:e.target.value}))}
                                    error={editErrors.description}
                                />
                            </section>
                            <button className={validateForm() ? "base-btn" : "unactive-btn"} onClick={() => {
                                if(validateForm()) {
                                    requestEditGeneralPlan();
                                }
                            }}>Zaktualizuj</button>
                        </section>
                    </>
                }
            </section>
        </main>
    )
}