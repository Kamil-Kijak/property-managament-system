
import { useContext, useState, useEffect} from "react";
import NavBar from "../components/NavBar"
import { useRequest } from "../hooks/useRequest";
import { screenContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faPen, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import WarningScreen from "../components/WarningScreen";
import { useForm } from "../hooks/useForm";

export default function LandTypesPage({}) {
    const screens = useContext(screenContext)
    const request = useRequest();

    const [insertFormData, insertErrors, setInsertFormData] = useForm({
        "name":{regexp:/^[A-Za-zĄĘŚĆŻŹÓŁąęłćśóżź]{1,49}$/, error:"nazwa musi się mieścić od 1 do 50 liter"}
    })
    const [editFormData, editErrors, setEditFormData] = useForm({
        "name":{regexp:/^[A-Za-zĄĘŚĆŻŹÓŁąęłćśóżź]{1,49}$/, error:"nazwa musi się mieścić od 1 do 50 liter"}
    })

    const [landTypes, setLandTypes] = useState([]);
    const [form, setForm] = useState(null);
    const [editLandTypeID, setEditLandTypeID] = useState(null);


    const getLandTypes = () => {
            screens.loading.set(true);
            request("/api/land_types/get", {}).then(result => {
                if(!result.error) {
                    setLandTypes(result.data)
                    screens.loading.set(false);
                }
            })
        }
        useEffect(() => {
            getLandTypes();
        }, [])
    const requestDelete = () => {
        screens.warning.set(false)
        screens.loading.set(true);
        request("/api/land_types/delete", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_land_type:editLandTypeID})
            }).then(result => {
                if(!result.error) {
                    getLandTypes();
                }
                screens.loading.set(false);
            })
    }
    const requestInsertLandType = () => {
        screens.loading.set(true);
        setForm(null);
        request("/api/land_types/insert", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({...insertFormData})
            }).then(result => {
                if(!result.error) {
                    getLandTypes();
                }
                screens.loading.set(false);
            })
    }
    const requestEditLandType = () => {
        screens.loading.set(true);
        setForm(null);
        request("/api/land_types/update", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_land_type:editLandTypeID, ...editFormData})
            }).then(result => {
                if(!result.error) {
                    getLandTypes();
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
                            Usunięcie tego typu działki spowoduje że każda działka która ma ten typ w systemie zostanie usunięta nieodwracalnie
                            </p>
                        <p className="text-white font-bold text-lg mt-5">
                            Czy napewno chcesz usunąć ten typ działki?
                        </p>
                    </>
                }
            />
            <NavBar requiredRoles={["ADMIN"]}/>
            <section className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5">
                <section className="my-10">
                    {landTypes.map((ele) => {
                        return (
                            <section className="px-8 py-5 shadow-2xl shadow-black/35 flex items-center justify-between my-5" key={ele.ID}>
                                <h1 className="text-4xl text-green-600 font-bold">ID: {ele.ID}</h1>
                                <section className="flex flex-col items-start justify-center">
                                    <h1 className="mx-10 text-2xl">{ele.nazwa}</h1>
                                </section>
                                <section className="flex flex-col items-center">
                                    <button className="base-btn" onClick={() => {
                                        setForm("edit");
                                        setEditLandTypeID(ele.ID)
                                        setEditFormData({
                                            name:ele.nazwa
                                        })
                                    }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                                    <button className="warning-btn" onClick={() => {
                                        screens.warning.set(true)
                                        setEditLandTypeID(ele.ID);
                                    }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                                </section>
                            </section>
                        )
                    })}
                </section>
                <button className="base-btn text-2xl" onClick={() => {
                    setForm("insert")
                }}><FontAwesomeIcon icon={faPlus}/> Dodaj nowy rodzaj działki</button>
                {
                    form == "insert" &&
                    <section className="base-card my-10">
                        <h1 className="text-2xl my-2 text-center">Tworzenie rodzaju działki</h1>
                        <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                        <section className="py-2 flex-col items-center">
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Nazwa rodzaju</h1>
                                <input type="text" placeholder="type name..." onChange={(e) => setInsertFormData(prev => ({...prev, name:e.target.value}))} className="border-2 border-black p-1 rounded-md" />
                            </section>
                        </section>
                        <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{insertErrors[Object.keys(insertErrors).find(ele => insertErrors[ele] != null)]}</p>
                        <button className="base-btn" onClick={() => {
                            if(Object.keys(insertFormData).length == 1) {
                                if(Object.keys(insertErrors).every(ele => insertErrors[ele] == null)) {
                                    requestInsertLandType();
                                }
                                }
                        }}>Stwórz rodzaj działki</button>
                    </section>
                }
                {
                    form == "edit" &&
                    <section className="base-card my-10">
                        <h1 className="text-2xl my-2 text-center">Edycja rodzaju działki</h1>
                        <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                        <section className="py-2 flex-col items-center">
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Nazwa rodzaju</h1>
                                <input type="text" placeholder="type name..." onChange={(e) => setEditFormData(prev => ({...prev, name:e.target.value}))} value={editFormData.name} className="border-2 border-black p-1 rounded-md" />
                            </section>
                        </section>
                        <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{editErrors[Object.keys(editErrors).find(ele => editErrors[ele] != null)]}</p>
                        <button className="base-btn" onClick={() => {
                            if(Object.keys(editFormData).length == 1) {
                                if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                                    requestEditLandType();
                                }
                                }
                        }}>Zaktualizuj</button>
                    </section>
                }
            </section>
        </main>
    )
}