
import {useState, useEffect} from "react";
import NavBar from "../components/NavBar"
import { useRequest } from "../hooks/useRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faPen, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "../hooks/useForm";
import InsertLandPurpose from "../forms/InsertLandPurpose";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";

export default function LandPurposesPage({}) {

    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update)
    const request = useRequest();

    const [editFormData, editErrors, setEditFormData] = useForm({
        "type":{regexp:/^[A-Za-zĄĘŚĆŻŹÓŁąęłćśóżź]{1,49}$/, error:"nazwa musi się mieścić od 1 do 50 liter"}
    })

    const [landPurposes, setLandPurposes] = useState([]);
    const [form, setForm] = useState(null);
    const [editLandPurposeID, setEditLandPurposeID] = useState(null);


    const getLandPurposes = () => {
        loadingUpdate(true);
        request("/api/land_purposes/get", {}).then(result => {
            if(!result.error) {
                setLandPurposes(result.data)
            }
            loadingUpdate(true);
        })
    }

    useEffect(() => {
        getLandPurposes();
    }, [])

    const requestDelete = (ID) => {
        warningUpdate(false);
        loadingUpdate(true);
        request("/api/land_purposes/delete", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_land_purpose:ID})
            }).then(result => {
                if(!result.error) {
                    getLandPurposes();
                }
                loadingUpdate(false);
            })
    }
    const requestEditLandPurpose = () => {
        loadingUpdate(true);
        setForm(null);
        request("/api/land_purposes/update", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_land_purpose:editLandPurposeID, ...editFormData})
            }).then(result => {
                if(!result.error) {
                    getLandPurposes();
                }
                loadingUpdate(false);
            })
    }
    return (
        <main className="flex justify-between">
            <NavBar requiredRoles={["ADMIN"]}/>
            <section className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5">
                <section className="my-10">
                    {landPurposes.map((ele) => {
                        return (
                            <section className="px-8 py-5 shadow-2xl shadow-black/35 flex items-center justify-between my-5" key={ele.ID}>
                                <h1 className="text-4xl text-green-600 font-bold">ID: {ele.ID}</h1>
                                <section className="flex flex-col items-start justify-center">
                                    <h1 className="mx-10 text-2xl">{ele.typ}</h1>
                                </section>
                                <section className="flex flex-col items-center">
                                    <button className="info-btn" onClick={() => {
                                        setForm("edit");
                                        setEditLandPurposeID(ele.ID)
                                        setEditFormData({
                                            type:ele.typ
                                        })
                                    }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                                    <button className="warning-btn" onClick={() => {
                                        warningUpdate(true, "Uwaga", () => requestDelete(ele.ID), () => warningUpdate(false),
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
                        )
                    })}
                </section>
                <button className="base-btn text-2xl" onClick={() => {
                    setForm("insert")
                }}><FontAwesomeIcon icon={faPlus}/> Dodaj nowe przeznaczenie działki</button>
                {
                    form == "insert" &&
                    <InsertLandPurpose setForm={setForm} getLandPurposes={getLandPurposes}/>
                }
                {
                    form == "edit" &&
                    <section className="base-card my-10">
                        <h1 className="text-2xl my-2 text-center">Edycja przeznaczenia działki</h1>
                        <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                        <section className="py-2 flex-col items-center">
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Nazwa przeznaczenia</h1>
                                <input type="text" placeholder="purpose name..." onChange={(e) => setEditFormData(prev => ({...prev, type:e.target.value}))} value={editFormData.type} className="border-2 border-black p-1 rounded-md" />
                            </section>
                        </section>
                        <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{editErrors[Object.keys(editErrors).find(ele => editErrors[ele] != null)]}</p>
                        <button className="base-btn" onClick={() => {
                            if(Object.keys(editFormData).length == 1) {
                                if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                                    requestEditLandPurpose();
                                }
                                }
                        }}>Zaktualizuj</button>
                    </section>
                }
            </section>
        </main>
    )
}