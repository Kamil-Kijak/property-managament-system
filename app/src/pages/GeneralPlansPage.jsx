

import {useState, useEffect} from "react";
import NavBar from "../components/NavBar"
import { useRequest } from "../hooks/useRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faPen, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import WarningScreen from "../components/screens/WarningScreen";
import { useForm } from "../hooks/useForm";
import InsertGeneralPlan from "../forms/InsertGeneralPlan";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";

export default function GeneralPlansPage({}) {
    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update);
    const request = useRequest();

    const [editFormData, editErrors, setEditFormData] = useForm({
        "code":{regexp:/^[A-ZĄĘŚĆŻŹÓŁ]{2}$/, error:"kod musi zawierać 2 duże litery"},
        "description":{regexp:/^.{1,69}$/, error:"opis musi się mieścić od 1 do 50 liter"}
    })

    const [generalPlans, setgeneralPlans] = useState([]);
    const [form, setForm] = useState(null);
    const [editGeneralPlanID, setEditGeneralPlanID] = useState(null);


    const getGeneralPlans = () => {
        loadingUpdate(true);
        request("/api/general_plans/get", {}).then(result => {
            if(!result.error) {
                setgeneralPlans(result.data)
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
                    getGeneralPlans();
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
                body:JSON.stringify({ID_general_plan:editGeneralPlanID, ...editFormData})
            }).then(result => {
                if(!result.error) {
                    getGeneralPlans();
                }
                loadingUpdate(false);
            })
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
                                        setEditGeneralPlanID(ele.ID)
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
                {
                    form == "insert" &&
                    <InsertGeneralPlan getGeneralPlans={getGeneralPlans} setForm={setForm}/>
                }
                {
                    form == "edit" &&
                    <section className="base-card my-10">
                        <h1 className="text-2xl my-2 text-center">Edycja planu ogólnego</h1>
                        <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                        <section className="py-2 flex-col items-center">
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Kod planu</h1>
                                <input type="text" placeholder="purpose name..." onChange={(e) => setEditFormData(prev => ({...prev, code:e.target.value}))} value={editFormData.code} className="border-2 border-black p-1 rounded-md" />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Opis planu</h1>
                                <textarea type="text" placeholder="purpose name..." onChange={(e) => setEditFormData(prev => ({...prev, description:e.target.value}))} value={editFormData.description} className="border-2 border-black p-1 rounded-md resize-none w-full h-[6rem]"></textarea>
                            </section>
                        </section>
                        <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{editErrors[Object.keys(editErrors).find(ele => editErrors[ele] != null)]}</p>
                        <button className="base-btn" onClick={() => {
                            if(Object.keys(editFormData).length == 2) {
                                if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                                    requestEditGeneralPlan();
                                }
                                }
                        }}>Zaktualizuj</button>
                    </section>
                }
            </section>
        </main>
    )
}