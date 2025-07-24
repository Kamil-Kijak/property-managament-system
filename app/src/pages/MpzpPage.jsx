

import {useState, useEffect, useRef} from "react";
import NavBar from "../components/NavBar"
import { useRequest } from "../hooks/useRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faPen, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "../hooks/useForm";
import InsertMpzp from "../forms/InsertMpzp";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";
import SimpleInput from "../components/inputs/SimpleInput";
import SimpleTextArea from "../components/inputs/SimpleTextArea"

export default function MpzpPage({}) {
    
    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update);

    const editSectionRef = useRef(null);
    const request = useRequest();

    const [editFormData, editErrors, setEditFormData] = useForm({
        "code":{regexp:/^[A-ZĄĘŚĆŻŹÓŁ]{2}$/, error:"kod musi zawierać 2 duże litery"},
        "description":{regexp:/^.{1,49}$/, error:"opis musi się mieścić od 1 do 50 liter"}
    })

    const [mpzp, setMpzp] = useState([]);
    const [form, setForm] = useState(null);
    const [editMpzpID, setEditMpzpID] = useState(null);

    const getMpzp = () => {
        loadingUpdate(true);
        request("/api/mpzp/get", {}).then(result => {
            if(!result.error) {
                setMpzp(result.data)
            }
            loadingUpdate(false);
        })
    }
    useEffect(() => {
        getMpzp();
    }, [])
    const requestDelete = (ID) => {
        warningUpdate(false);
        loadingUpdate(true);
        request("/api/mpzp/delete", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_mpzp:ID})
            }).then(result => {
                if(!result.error) {
                    getMpzp();
                }
                loadingUpdate(false);
            })
    }
    const requestEditMpzp = () => {
        loadingUpdate(true);
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
                loadingUpdate(false);
            })
    }
    return (
        <main className="flex justify-between">
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
                                        setTimeout(() => editSectionRef.current.scrollIntoView({behavior:"smooth"}), 0)
                                    }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                                    <button className="warning-btn" onClick={() => {
                                        warningUpdate(true, "Uwaga", () => requestDelete(ele.ID), () => warningUpdate(false),
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
                    <section className="base-card my-10" ref={editSectionRef}>
                        <h1 className="text-2xl my-2 text-center">Edycja MPZP</h1>
                        <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                        <section className="py-2 flex-col items-center">
                            <SimpleInput
                                title="Kod MPZP"
                                placeholder="MPZP code..."
                                value={editFormData.code}
                                onChange={(e) => setEditFormData(prev => ({...prev, code:e.target.value}))}
                            />
                            <SimpleTextArea
                                title="Opis MPZP"
                                placeholder="MPZP description..."
                                value={editFormData.description}
                                onChange={(e) => setEditFormData(prev => ({...prev, description:e.target.value}))}
                            />
                        </section>
                        <p className="error-text">{editErrors[Object.keys(editErrors).find(ele => editErrors[ele] != null)]}</p>
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