

import { useContext, useState, useEffect} from "react";
import NavBar from "../components/NavBar"
import { useRequest } from "../hooks/useRequest";
import { screenContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faPen, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import WarningScreen from "../components/screens/WarningScreen";
import { useForm } from "../hooks/useForm";
import InsertMpzp from "../forms/InsertMpzp";

export default function MpzpPage({}) {
    const screens = useContext(screenContext)
    const request = useRequest();

    const [editFormData, editErrors, setEditFormData] = useForm({
        "code":{regexp:/^[A-ZĄĘŚĆŻŹÓŁ]{2}$/, error:"kod musi zawierać 2 duże litery"},
        "description":{regexp:/^.{1,49}$/, error:"opis musi się mieścić od 1 do 50 liter"}
    })

    const [mpzp, setMpzp] = useState([]);
    const [form, setForm] = useState(null);
    const [editMpzpID, setEditMpzpID] = useState(null);

    const getMpzp = () => {
            screens.loading.set(true);
            request("/api/mpzp/get", {}).then(result => {
                if(!result.error) {
                    setMpzp(result.data)
                    screens.loading.set(false);
                }
            })
        }
    useEffect(() => {
        getMpzp();
    }, [])
    const requestDelete = () => {
        screens.warning.set(false)
        screens.loading.set(true);
        request("/api/mpzp/delete", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_mpzp:editMpzpID})
            }).then(result => {
                if(!result.error) {
                    getMpzp();
                }
                screens.loading.set(false);
            })
    }
    const requestEditMpzp = () => {
        screens.loading.set(true);
        setForm(null);
        request("/api/mpzp/update", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_mpzp:editMpzpID, ...editFormData})
            }).then(result => {
                if(!result.error) {
                    getMpzp();
                }
                screens.loading.set(false);
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
                            Usunięcie tego MPZP spowoduje że każda działka która ma to MPZP w systemie zostanie usunięta nieodwracalnie
                            </p>
                        <p className="text-white font-bold text-lg mt-5">
                            Czy napewno chcesz usunąć to MPZP?
                        </p>
                    </>
                }
            />
            <NavBar requiredRoles={["ADMIN"]}/>
            <section className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5">
                <section className="my-10">
                    {mpzp.map((ele) => {
                        return (
                            <section className="px-8 py-5 shadow-2xl shadow-black/35 flex items-center justify-between my-5" key={ele.ID}>
                                <h1 className="text-4xl text-green-600 font-bold">{ele.kod}</h1>
                                <section className="flex flex-col items-start justify-center">
                                    <p className="mx-10 text-xl">{ele.opis}</p>
                                </section>
                                <section className="flex flex-col items-center">
                                    <button className="info-btn" onClick={() => {
                                        setForm("edit");
                                        setEditMpzpID(ele.ID)
                                        setEditFormData({
                                            code:ele.kod,
                                            description:ele.opis
                                        })
                                    }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                                    <button className="warning-btn" onClick={() => {
                                        screens.warning.set(true)
                                        setEditMpzpID(ele.ID);
                                    }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                                </section>
                            </section>
                        )
                    })}
                </section>
                <button className="base-btn text-2xl" onClick={() => {
                    setForm("insert")
                }}><FontAwesomeIcon icon={faPlus}/> Dodaj nowy MPZP</button>
                {
                    form == "insert" &&
                    <InsertMpzp getMpzp={getMpzp} setForm={setForm}/>
                }
                {
                    form == "edit" &&
                    <section className="base-card my-10">
                        <h1 className="text-2xl my-2 text-center">Edycja MPZP</h1>
                        <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                        <section className="py-2 flex-col items-center">
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Kod MPZP</h1>
                                <input type="text" placeholder="purpose name..." onChange={(e) => setEditFormData(prev => ({...prev, code:e.target.value}))} value={editFormData.code} className="border-2 border-black p-1 rounded-md" />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Opis MPZP</h1>
                                <textarea type="text" placeholder="purpose name..." onChange={(e) => setEditFormData(prev => ({...prev, description:e.target.value}))} value={editFormData.description} className="border-2 border-black p-1 rounded-md resize-none w-full h-[6rem]"></textarea>
                            </section>
                        </section>
                        <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{editErrors[Object.keys(editErrors).find(ele => editErrors[ele] != null)]}</p>
                        <button className="base-btn" onClick={() => {
                            if(Object.keys(editFormData).length == 2) {
                                if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                                    requestEditMpzp();
                                }
                                }
                        }}>Zaktualizuj</button>
                    </section>
                }
            </section>
        </main>
    )
}