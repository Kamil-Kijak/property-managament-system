
import {useEffect, useRef, useState } from "react"
import NavBar from "../components/NavBar"
import SearchBar from "../components/SearchBar";
import { useRequest } from "../hooks/useRequest";
import Owner from "../components/Owner";

import { useForm } from "../hooks/useForm";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";
import SearchInput from "../components/inputs/SearchInput";
import SimpleInput from "../components/inputs/SimpleInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function OwnersPage({}) {

    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update);

    const [searchFilters, setSearchFilters] = useState({
        name_filter:"",
        surname_filter:""
    });

    const [editFormData, editErrors, setEditFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "surname":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "phone":{regexp:/^[0-9]{9}$/, error:"Nie ma 9 cyfr"},
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
                {
                    !form && 
                    <>
                        <SearchBar
                            onSearch={search}
                                elements={
                                    <>
                                        <SearchInput
                                            title="Imie właściciela"
                                            placeholder="name..."
                                            value={searchFilters.name_filter}
                                            onChange={(e) => setSearchFilters(prev => ({...prev, name_filter:e.target.value}))}
                                        />
                                        <SearchInput
                                            title="Nazwisko właściciela"
                                            placeholder="surname..."
                                            value={searchFilters.surname_filter}
                                            onChange={(e) => setSearchFilters(prev => ({...prev, surname_filter:e.target.value}))}
                                        />
                                    </>
                                }
                            
                            />
                            <h1 className="font-bold text-lg mt-5">Znalezione wyniki: {owners.length}</h1>
                            <section className="my-5">
                                {
                                    owners.map((obj, index) => <Owner obj={obj} key={index} requestDelete={requestDelete} editOwner={(ID) => {
                                        setForm("edit");
                                        setOwnerEditID(ID);
                                        }} setEditFormData={setEditFormData}/>)
                                } 
                            </section>
                    </>
                }
                {
                    form == "edit" &&
                    <>
                        <section className="my-10">
                            <button className="base-btn text-2xl" onClick={() => setForm(null)}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
                        </section>
                        <section className="base-card">
                            <h1 className="text-2xl font-bold">Edycja właściciela</h1>
                            <div className="bg-green-500 w-full h-2 rounded-2xl my-3"></div>
                            <SimpleInput
                                title="Imie"
                                placeholder="name..."
                                value={editFormData.name}
                                onChange={(e) => setEditFormData(prev => ({...prev, name:e.target.value}))}
                                error={editErrors.name}
                            />
                            <SimpleInput
                                title="Nazwisko"
                                placeholder="surname..."
                                value={editFormData.surname}
                                onChange={(e) => setEditFormData(prev => ({...prev, surname:e.target.value}))}
                                error={editErrors.surname}
                            />
                            <SimpleInput
                                title="Telefon"
                                placeholder="phone..."
                                value={editFormData.phone}
                                onChange={(e) => setEditFormData(prev => ({...prev, phone:e.target.value}))}
                                error={editErrors.phone}
                            />
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