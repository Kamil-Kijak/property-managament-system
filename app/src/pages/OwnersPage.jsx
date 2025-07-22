
import {useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import SearchBar from "../components/SearchBar";
import { useRequest } from "../hooks/useRequest";
import Owner from "../components/Owner";

import { useForm } from "../hooks/useForm";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";

export default function OwnersPage({}) {

    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update);

    const [searchFilters, setSearchFilters] = useState({
        name_filter:"",
        surname_filter:""
    });

    const [editFormData, editErrors, setEditFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Imie musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
        "surname":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nazwisko musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
        "phone":{regexp:/^[0-9]{1,15}$/, error:"Telefon musi się mieścić w 15 cyfrach"},
    })

    const [form, setForm] = useState("");

    const [owners, setOwners] = useState([]);

    const [ownerEditID, setOwnerEditID] = useState();

    const request = useRequest();


    const search = () => {
        const params = new URLSearchParams({
            ...searchFilters,
        });
        loadingUpdate(true);
        request(`/api/owners/get?${params.toString()}`, {
                method:"GET",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
            }).then(result => {
                if(!result.error) {
                    const owners = [];
                    result.data.forEach((obj) => {
                        if(!owners.some((ele) => ele.ID == obj.ID)) {
                            owners.push({ID:obj.ID, imie:obj.imie, nazwisko:obj.nazwisko, telefon:obj.telefon, dzialki:[]});
                        }
                        delete obj.nazwisko;
                        delete obj.imie;
                        delete obj.telefon;
                        owners.find(ele => ele.ID == obj.ID).dzialki.push({...obj});
                    })
                    setOwners(owners);
                }
                loadingUpdate(false);
            })
    }

    useEffect(() => {
        search();
    }, [])

    const requestDelete = (ID) => {
        warningUpdate(false);
        loadingUpdate(true);
        request("/api/owners/delete", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_owner:ID})
            }).then(result => {
                if(!result.error) {
                    search();
                }
                loadingUpdate(false);
            })
    }

    const requestEdit = () => {
        setForm("")
        loadingUpdate(true);
        request("/api/owners/update", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_owner:ownerEditID, ...editFormData})
            }).then(result => {
                if(!result.error) {
                    search();
                }
                loadingUpdate(false);
            })
    }

    return (
        <main className="flex justify-between">
            <NavBar requiredRoles={[]}/>
            <section className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5 pb-5 relative">
                <SearchBar
                onSearch={search}
                    elements={
                        <>
                            <section>
                                <h1 className="font-bold">Imie</h1>
                                <input type="text" placeholder="name..." onChange={(e) => setSearchFilters(prev => ({...prev, name_filter:e.target.value.toUpperCase()}))} className="border-2 border-black rounded-md bg-white px-2 py-1"
                                />
                            </section>
                            <section className="ml-2">
                                <h1 className="font-bold">Nazwisko</h1>
                                <input type="text" placeholder="surname..." onChange={(e) => setSearchFilters(prev => ({...prev, surname_filter:e.target.value.toUpperCase()}))} className="border-2 border-black rounded-md bg-white px-2 py-1"
                                />
                            </section>
                        </>
                    }
                
                />
                <section className="my-10">
                    {
                        owners.map((obj, index) => <Owner obj={obj} key={index} requestDelete={requestDelete} editOwner={(ID) => {setForm("edit"); setOwnerEditID(ID)}} setEditFormData={setEditFormData}/>)
                    } 
                </section>
                {
                    form == "edit" &&
                    <>
                        <section className="base-card">
                        <h1 className="text-2xl font-bold">Edycja właściciela</h1>
                        <div className="bg-green-500 w-full h-2 rounded-2xl my-3"></div>
                        <section className="flex flex-col items-start mb-2">
                            <h1 className="font-bold mb-1">Imie</h1>
                            <input type="text" placeholder="name..." className="border-2 border-black p-1 rounded-md" value={editFormData.name} onChange={(e) => setEditFormData(prev => ({...prev, name:e.target.value}))}/>
                        </section>
                        <section className="flex flex-col items-start mb-2">
                            <h1 className="font-bold mb-1">Nazwisko</h1>
                            <input type="text" placeholder="surname..." className="border-2 border-black p-1 rounded-md" value={editFormData.surname} onChange={(e) => setEditFormData(prev => ({...prev, surname:e.target.value}))}/>
                        </section>
                        <section className="flex flex-col items-start mb-2">
                            <h1 className="font-bold mb-1">Telefon</h1>
                            <input type="phone" placeholder="phone..." className="border-2 border-black p-1 rounded-md" value={editFormData.phone} onChange={(e) => setEditFormData(prev => ({...prev, phone:e.target.value}))} />
                        </section>
                        <p className="error-text">{editErrors[Object.keys(editErrors).find(ele => editErrors[ele] != null)]}</p>
                        <button className="base-btn" onClick={() => {
                            if(Object.keys(editFormData).length == 3) {
                                if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                                    requestEdit();
                                }
                            }
                        }}>Zaktualizuj</button>
                        </section>
                    </>
                }
            </section>
        </main>
    )
}