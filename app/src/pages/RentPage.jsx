

import NavBar from "../components/NavBar"
import SearchBar from "../components/SearchBar"
import { useEffect, useRef, useState } from "react";
import { useRequest } from "../hooks/useRequest";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";
import Renter from "../components/Renter";
import { useForm } from "../hooks/useForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function RentPage({}) {
    
    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update);

    const editSectionRef = useRef(null);

    const [searchFilters, setSearchFilters] = useState({
        name_filter:"",
        surname_filter:"",
        owner_name_filter:"",
        owner_surname_filter:"",
        month_filter:"",
        end_year_filter:""
    });

    const [editRenterFormData, editRenterErrors, setEditRenterFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Imie musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
        "surname":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nazwisko musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
        "phone":{regexp:/^[0-9]{1,15}$/, error:"Telefon musi się mieścić w 15 cyfrach"},
    })

    const [renters, setRenters] = useState([]);
    const [form, setForm] = useState("");
    const [renterEditID, setRenterEditID] = useState(null);

    const request = useRequest();



    const search = () => {
        loadingUpdate(true);
        const params = new URLSearchParams({
            ...searchFilters,
        });
        request(`/api/rents/get?${params.toString()}`, {
                method:"GET",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
            }).then(result => {
                if(!result.error) {
                    const renters = [];
                    result.data.forEach((obj) => {
                        if(!renters.some((ele) => ele.ID == obj.ID_dzierzawcy)) {
                            renters.push({ID:obj.ID_dzierzawcy, imie:obj.d_imie, nazwisko:obj.d_nazwisko, telefon:obj.d_telefon, dzialki:[]});
                        }
                        delete obj.d_nazwisko;
                        delete obj.d_imie;
                        delete obj.d_telefon;
                        renters.find(ele => ele.ID == obj.ID_dzierzawcy).dzialki.push({...obj});
                    });
                    setRenters(renters);
                }
                loadingUpdate(false);
            })
    }

    useEffect(() => {
        search();
    }, [])

    const requestDeleteRenter = (ID) => {
        warningUpdate(false);
        loadingUpdate(true);
        request("/api/renters/delete", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_renter:ID})
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
        request("/api/renters/update", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_renter:renterEditID, ...editRenterFormData})
            }).then(result => {
                if(!result.error) {
                    search();
                }
                loadingUpdate(false);
            })
    }
    const requestDeleteRent = (ID) => {
        warningUpdate(false);
        loadingUpdate(true);
        request("/api/rents/delete", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({ID_rent:ID})
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
                                <h1 className="font-bold">Imie dzierżawcy</h1>
                                <input type="text" placeholder="renter name..." onChange={(e) => setSearchFilters(prev => ({...prev, name_filter:e.target.value.toUpperCase()}))} className="border-2 border-black rounded-md bg-white px-2 py-1"
                                />
                            </section>
                            <section className="ml-2">
                                <h1 className="font-bold">Nazwisko dzierżawcy</h1>
                                <input type="text" placeholder="renter surname..." onChange={(e) => setSearchFilters(prev => ({...prev, surname_filter:e.target.value.toUpperCase()}))} className="border-2 border-black rounded-md bg-white px-2 py-1"
                                />
                            </section>
                            <section className="ml-2">
                                <h1 className="font-bold">Imie właściciela</h1>
                                <input type="text" placeholder="owner name..." onChange={(e) => setSearchFilters(prev => ({...prev, owner_name_filter:e.target.value.toUpperCase()}))} className="border-2 border-black rounded-md bg-white px-2 py-1"
                                />
                            </section>
                            <section className="ml-2">
                                <h1 className="font-bold">Nazwisko właściciela</h1>
                                <input type="text" placeholder="owner surname..." onChange={(e) => setSearchFilters(prev => ({...prev, owner_surname_filter:e.target.value.toUpperCase()}))} className="border-2 border-black rounded-md bg-white px-2 py-1"
                                />
                            </section>
                            <section className="ml-2">
                                <h1 className="font-bold">Miesiąc wystawienia faktury</h1>
                                <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-[200px]" onChange={(e) => setSearchFilters(prev => ({...prev, month_filter:e.target.value}))}>
                                    <option value="" className="hidden">Wybierz</option>
                                    <option value="1">Styczeń</option>
                                    <option value="2">Luty</option>
                                    <option value="3">Marzec</option>
                                    <option value="4">Kwiecień</option>
                                    <option value="5">Maj</option>
                                    <option value="6">Czerwiec</option>
                                    <option value="7">Lipiec</option>
                                    <option value="8">Sierpień</option>
                                    <option value="9">Wrzesień</option>
                                    <option value="10">Październik</option>
                                    <option value="11">Listopad</option>
                                    <option value="12">Grudzień</option>
                                </select>
                            </section>
                            <section className="ml-2">
                                <h1 className="font-bold">Dzierżawy przed końcem</h1>
                                <input type="number" placeholder="end year..." onChange={(e) => setSearchFilters(prev => ({...prev, end_year_filter:e.target.value}))} className="border-2 border-black rounded-md bg-white px-2 py-1"
                                />
                            </section>
                        </>
                    }
                
                />
                {
                    form != "edit_rent" &&
                    renters.map((obj, index) => <Renter key={index} obj={obj} deleteRent={requestDeleteRent} deleteRenter={requestDeleteRenter} editRenter={(ID) => {
                        setForm("edit_renter");
                        setRenterEditID(ID);
                        setTimeout(() => editSectionRef.current.scrollIntoView({ behavior: 'smooth' }), 0);
                        setEditRenterFormData({
                            name:obj.imie,
                            surname:obj.nazwisko,
                            phone:obj.telefon
                        })
                    }}
                    />)
                }
                {/* {
                    form == "edit_rent" && 
                } */}
                {
                    form == "edit_renter" &&
                     <section ref={editSectionRef} className="mt-5">
                        <section className="base-card">
                        <h1 className="text-2xl font-bold">Edycja Dzierżawcy</h1>
                        <div className="bg-green-500 w-full h-2 rounded-2xl my-3"></div>
                        <section className="flex flex-col items-start mb-2">
                            <h1 className="font-bold mb-1">Imie</h1>
                            <input type="text" placeholder="name..." className="border-2 border-black p-1 rounded-md" value={editRenterFormData.name} onChange={(e) => setEditRenterFormData(prev => ({...prev, name:e.target.value}))}/>
                        </section>
                        <section className="flex flex-col items-start mb-2">
                            <h1 className="font-bold mb-1">Nazwisko</h1>
                            <input type="text" placeholder="surname..." className="border-2 border-black p-1 rounded-md" value={editRenterFormData.surname} onChange={(e) => setEditRenterFormData(prev => ({...prev, surname:e.target.value}))}/>
                        </section>
                        <section className="flex flex-col items-start mb-2">
                            <h1 className="font-bold mb-1">Telefon</h1>
                            <input type="phone" placeholder="phone..." className="border-2 border-black p-1 rounded-md" value={editRenterFormData.phone} onChange={(e) => setEditRenterFormData(prev => ({...prev, phone:e.target.value}))} />
                        </section>
                        <p className="error-text">{editRenterErrors[Object.keys(editRenterErrors).find(ele => editRenterErrors[ele] != null)]}</p>
                        <button className="base-btn" onClick={() => {
                            if(Object.keys(editRenterFormData).length == 3) {
                                if(Object.keys(editRenterErrors).every(ele => editRenterErrors[ele] == null)) {
                                    requestEdit();
                                }
                            }
                        }}>Zaktualizuj</button>
                        </section>
                    </section>
                }
            </section>
        </main>
    )
}