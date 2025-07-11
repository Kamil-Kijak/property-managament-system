

import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faUserTie, faPlus, faPen, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar"

import { useState, useContext, useEffect } from "react";
import { useRequest } from "../hooks/useRequest";
import WarningScreen from "../components/WarningScreen";
import { screenContext, userContext } from "../App";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";

export default function UsersPage({}) {
    const screens = useContext(screenContext)
    const user = useContext(userContext)


    const [editUserID, setEditUserID] = useState(null);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(null);
    const [checkingPassword, setCheckingPassword] = useState("");
    
    const request = useRequest();
    const navigate = useNavigate()
    const [insertFormData, insertErrors, setInsertFormData] = useForm({
            "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Imie musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
            "surname":{regexp:/^[A-ZŁĆŚŁŻŹĄĘ][a-ząęłćśóżź]{1,49}$/, error:"Nazwisko musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
            "password":{regexp:/^\w{8,}$/, error:"Hasło powinno mieć minimum 8 znaków"},
            "role":{regexp:/.+/, error:"brak roli"}
        }
    )
    const [editFormData, editErrors, setEditFormData] = useForm({
            "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Imie musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
            "surname":{regexp:/^[A-ZŁĆŚŁŻŹĄĘ][a-ząęłćśóżź]{1,49}$/, error:"Nazwisko musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
            "password":{regexp:/^\w{8,}$/, error:"Hasło powinno mieć minimum 8 znaków"},
            "role":{regexp:/.+/, error:"brak roli"}
        }
    )
    
    const getUsers = () => {
        screens.loading.set(true);
        request("/api/user/get", {}).then(result => {
            if(!result.error) {
                setUsers(result.data)
                screens.loading.set(false);
            }
        })
    }
    useEffect(() => {
        getUsers();
    }, [])

    const requestInsertUser = () => {
        screens.loading.set(true);
        setForm(null);
        request("/api/user/insert", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({...insertFormData})
            }).then(result => {
                if(!result.error) {
                    getUsers();
                }
                screens.loading.set(false);
            })
    }

    const requestEditUser = () => {
        screens.loading.set(true);
        setForm(null);
        request("/api/user/update", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_user:editUserID, ...editFormData})
            }).then(result => {
                if(!result.error) {
                    getUsers();
                    checkActualUserDataChange(editUserID);
                }
                screens.loading.set(false);
            })
    }
    const requestDelete = () => {
        screens.warning.set(false)
        screens.loading.set(true);
        request("/api/user/delete", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_user:editUserID})
            }).then(result => {
                if(!result.error) {
                    getUsers();
                    checkActualUserDataChange(editUserID);
                }
                screens.loading.set(false);
            })
    }

    const checkActualUserDataChange = (editedUserID) => {
        if(editedUserID == user.value.ID) {
            request("/api/user/logout", {credentials:"include"}).then(result => {
                if(!result.error) {
                    navigate("/login")
                }
            });
        }
    }

    return(
        <main className="flex justify-between">
            <WarningScreen
                title="Uwaga"
                cancelCallback={() => screens.warning.set(false)}
                acceptCallback={() => requestDelete()}
                description={
                    <p className="text-white font-bold text-lg mt-5">
                        Czy napewno chcesz usunąć tego użytkownika?
                    </p>
                }
            />
            <NavBar requiredRoles={["ADMIN"]}/>
            <section className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5">
                <section className="my-10">
                    {users.map((ele) => {
                        return (
                            <section className="px-8 py-5 shadow-2xl shadow-black/35 flex items-center justify-between my-5" key={ele.ID}>
                                <FontAwesomeIcon icon={faUserTie} className="text-6xl text-green-600"/>
                                <section className="flex flex-col items-start">
                                    <h1 className="mx-10 text-2xl">{ele.imie + " " + ele.nazwisko}</h1>
                                    <h1 className="mx-10 text-xl font-bold">{ele.rola}</h1>
                                </section>
                                <section className="flex flex-col items-center">
                                    <button className="base-btn" onClick={() => {
                                        setForm("edit");
                                        setEditUserID(ele.ID)
                                        setEditFormData({
                                            name:ele.imie,
                                            surname:ele.nazwisko,
                                            role:ele.rola
                                        })
                                    }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                                    <button className="warning-btn" onClick={() => {
                                        screens.warning.set(true)
                                        setEditUserID(ele.ID);
                                    }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                                </section>
                            </section>
                        )
                    })}
                </section>
                <button className="base-btn text-2xl" onClick={() => {
                    setForm("insert")
                }}><FontAwesomeIcon icon={faPlus}/> Dodaj nowego użytkownika</button>
                {
                    form == "insert" &&
                    <section className="base-card my-10">
                        <h1 className="text-2xl my-2 text-center">Tworzenie nowego użytkownika</h1>
                        <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                        <section className="py-2 flex-col items-center">
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Imie</h1>
                                <input type="text" onChange={(e) => setInsertFormData(prev => ({...prev, name:e.target.value}))} placeholder="name..." className="border-2 border-black p-1 rounded-md" />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Nazwisko</h1>
                                <input type="text" onChange={(e) => setInsertFormData(prev => ({...prev, surname:e.target.value}))} placeholder="surname..." className="border-2 border-black p-1 rounded-md" />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Hasło</h1>
                                <input type="password" onChange={(e) => setInsertFormData(prev => ({...prev, password:e.target.value}))} placeholder="password..." className="border-2 border-black p-1 rounded-md" />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Powtórz hasło</h1>
                                <input type="password" onChange={(e) => setCheckingPassword(e.target.value)} placeholder="repeat password..." className="border-2 border-black p-1 rounded-md" />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Rola</h1>
                                <select className="border-2 border-black p-1 rounded-md w-full" defaultValue={""} onChange={(e) => setInsertFormData(prev => ({...prev, role:e.target.value}))}>
                                    <option value="" className="hidden">Wybierz role</option>
                                    <option value="SEKRETARIAT">Sekretariat</option>
                                    <option value="Ksiegowosc">Ksiegowosc</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </section>
                        </section>
                        {checkingPassword !== (insertFormData.password || "") && <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">Hasła nie są takie same</p>}
                        <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{insertErrors[Object.keys(insertErrors).find(ele => insertErrors[ele] != null)]}</p>
                        <button className="base-btn" onClick={() => {
                            if(Object.keys(insertFormData).length == 4) {
                                if(Object.keys(insertErrors).every(ele => insertErrors[ele] == null)) {
                                    if(checkingPassword === insertFormData.password) {
                                        requestInsertUser();
                                    }
                                }
                                }
                        }}>Stwórz użytkownika</button>
                    </section>
                }
                {
                    form == "edit" &&
                    <section className="base-card my-10">
                        <h1 className="text-2xl my-2 text-center">Edycja użytkownika</h1>
                        <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                        <section className="py-2 flex-col items-center">
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Imie</h1>
                                <input type="text" onChange={(e) => setEditFormData(prev => ({...prev, name:e.target.value}))}  placeholder="name..." className="border-2 border-black p-1 rounded-md" value={editFormData.name} />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Nazwisko</h1>
                                <input type="text" onChange={(e) => setEditFormData(prev => ({...prev, surname:e.target.value}))}  placeholder="surname..." className="border-2 border-black p-1 rounded-md" value={editFormData.surname} />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Rola</h1>
                                <select className="border-2 border-black p-1 rounded-md w-full" defaultValue={editFormData.role} onChange={(e) => setEditFormData(prev => ({...prev, role:e.target.value}))}>
                                    <option value="ADMIN">Administrator</option>
                                    <option value="SEKRETARIAT">Sekretariat</option>
                                    <option value="Ksiegowosc">Ksiegowosc</option>
                                </select>
                            </section>
                        </section>
                        <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{editErrors[Object.keys(editErrors).find(ele => editErrors[ele] != null)]}</p>
                        <button className="base-btn" onClick={() => {
                            if(Object.keys(editFormData).length == 3) {
                                if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                                    requestEditUser()
                                }
                                }
                            }
                        }>Zaktualizuj</button>
                    </section>
                }
            </section>
        </main>
    )
}