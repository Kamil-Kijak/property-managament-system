

import NavBar from "../components/NavBar"
import SearchBar from "../components/SearchBar"
import { useEffect, useRef, useState } from "react";
import { useRequest } from "../hooks/useRequest";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";
import Renter from "../components/Renter";
import { useForm } from "../hooks/useForm";
import SimpleInput from "../components/inputs/SimpleInput"
import SelectInput from "../components/inputs/SelectInput";
import SearchInput from "../components/inputs/SearchInput";
import SearchSelectInput from "../components/inputs/SearchSelectInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function RentPage({}) {
    
    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update);

    const [searchFilters, setSearchFilters] = useState({
        name_filter:"",
        surname_filter:"",
        owner_name_filter:"",
        owner_surname_filter:"",
        month_filter:"",
        end_year_filter:""
    });

    const [editRenterFormData, editRenterErrors, setEditRenterFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "surname":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "phone":{regexp:/^[0-9]{9}$/, error:"Nie ma 9 cyfr"},
    })

    const [renterFormData, renterErrors, setRenterFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "surname":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "phone":{regexp:/^[0-9]{9}$/, error:"Nie ma 9 cyfr"},
    })

    const [editRentFormData, editRentErrors, setEditRentFormData] = useForm({
        "start_date":{regexp:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, error:"Zły format"},
        "end_date":{regexp:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, error:"Zły formt"},
        "rent":{regexp:/^\d{0,5}\.\d{2}$/, error:"Nie ma 2 po , lub za duża liczba"},
        "ID_renter":{regexp:/.+/, error:"Wybierz dzierżawce"},
    });
    const [invoiceIssueDate, setInvoiceIssueDate] = useState({
        day:1,
        month:1
    });

    const [renters, setRenters] = useState([]);
    const [allRenters, setAllRenters] = useState([]);
    const [form, setForm] = useState(null);
    const [renterEditID, setRenterEditID] = useState(null);
    const [rentEditID, setRentEditID] = useState(null);

    const request = useRequest();

    const fetchAllData = async () => {
        loadingUpdate(true)
        const rentersResult = await request("/api/renters/get_all", {credentials:"include"});
        if(!rentersResult.error) {
            setAllRenters(rentersResult.data);
        }
        loadingUpdate(false);
    }


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
        fetchAllData();
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
    const requestEditRenter = () => {
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

    const requestEditRent = () => {
        loadingUpdate(true)
        setForm(null);
        request("/api/rents/update", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({...editRentFormData, ID_rent:rentEditID, invoice_issue_date:`0000-${invoiceIssueDate.month.toString().padStart(2, "0")}-${invoiceIssueDate.day.toString().padStart(2, "0")}`})
            }).then(result => {
                if(!result.error) {
                    search()
                }
                loadingUpdate(false)
            })
    }

    const requestInsertRenter = async () => {
        loadingUpdate(true)
        const result = await request("/api/renters/insert", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({...renterFormData})
            })
        if(!result.error) {
            await fetchAllData();
            setEditRentFormData(prev => ({...prev, ID_renter:result.insertID}));
            setRenterFormData({});
        }
        loadingUpdate(false)
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
                                    type="text"
                                    title="Imie dzierżawcy"
                                    placeholder="renter name..."
                                    value={searchFilters.name_filter}
                                    onChange={(e) => setSearchFilters(prev => ({...prev, name_filter:e.target.value}))}
                                />
                                <SearchInput
                                    type="text"
                                    title="Nazwisko dzierżawcy"
                                    placeholder="renter surname..."
                                    value={searchFilters.surname_filter}
                                    onChange={(e) => setSearchFilters(prev => ({...prev, surname_filter:e.target.value}))}
                                />
                                <SearchInput
                                    type="text"
                                    title="Imie właściciela"
                                    placeholder="owner name..."
                                    value={searchFilters.owner_name_filter}
                                    onChange={(e) => setSearchFilters(prev => ({...prev, owner_name_filter:e.target.value}))}
                                />
                                <SearchInput
                                    type="text"
                                    title="Nazwisko właściciela"
                                    placeholder="owner surname..."
                                    value={searchFilters.owner_surname_filter}
                                    onChange={(e) => setSearchFilters(prev => ({...prev, owner_surname_filter:e.target.value}))}
                                />
                                <SearchSelectInput
                                    title="Miesiąc wystawienia faktury"
                                    placeholder="Wybierz miesiąc"
                                    value={searchFilters.month_filter}
                                    onChange={(e) => setSearchFilters(prev => ({...prev, month_filter:e.target.value}))}
                                    options={
                                    <>
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
                                    </>
                                    }
                                />
                                <SearchInput
                                    type="number"
                                    min={2000}
                                    title="Dzierżawy przed końcem"
                                    placeholder="rents before end..."
                                    value={searchFilters.end_year_filter}
                                    onChange={(e) => setSearchFilters(prev => ({...prev, end_year_filter:e.target.value}))}
                                />
                            </>
                        }
                        />
                        <h1 className="font-bold text-lg mt-5">Znalezione wyniki: {renters.length}</h1>
                        {
                            renters.map((obj, index) => <Renter key={index} obj={obj} deleteRent={requestDeleteRent} deleteRenter={requestDeleteRenter} editRenter={(ID) => {
                                setForm("edit_renter");
                                setRenterEditID(ID);
                                setEditRenterFormData({
                                    name:obj.imie,
                                    surname:obj.nazwisko,
                                    phone:obj.telefon
                                })
                            }}
                            editRent={
                                (ID) => {
                                    setForm("edit_rent");
                                    setRentEditID(ID);
                                    const data = obj.dzialki.find((dzialka) => dzialka.ID === ID);
                                    console.log(data);
                                    const start_date = new Date(data.data_rozpoczecia);
                                    const end_date = new Date(data.data_zakonczenia);
                                    setEditRentFormData({
                                    start_date:start_date.toLocaleDateString("sv-SE"),
                                    end_date:end_date.toLocaleDateString("sv-SE"),
                                    rent:data.wysokosc_czynszu,
                                    ID_renter:data.ID_dzierzawcy
                                    })
                                    const invoice_date = new Date(data.data_wystawienia_fv_czynszowej);
                                    setInvoiceIssueDate({
                                        day:invoice_date.getDate(),
                                        month:invoice_date.getMonth() + 1
                                    })
                                }
                            }
                            />)
                        }
                    
                    
                    </>
                }
                {
                    form == "edit_rent" && 
                    <>
                        <section className="my-4">
                            <button className="base-btn text-2xl" onClick={() => setForm(null)}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
                        </section>
                        <section className="base-card w-full">
                            <h1 className="text-3xl font-bold">Edycja dzierżawy</h1>
                            <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                            <section className="flex justify-center w-full gap-x-5">
                                <SimpleInput
                                    type="date"
                                    title="Data rozpoczęcia"
                                    value={editRentFormData.start_date}
                                    onChange={(e) => setEditRentFormData(prev => ({...prev, start_date:e.target.value}))}
                                    error={editRentErrors.start_date}
                                />
                                <SimpleInput
                                    type="date"
                                    title="Data zakończenia"
                                    value={editRentFormData.end_date}
                                    onChange={(e) => setEditRentFormData(prev => ({...prev, end_date:e.target.value}))}
                                    error={editRentErrors.end_date}
                                />
                            </section>
                            <section className="flex flex-col items-start my-2">
                                <h1 className="font-bold mb-1">Data wystawienia faktury czynszowej</h1>
                                <section className="flex justify-center items-center gap-x-1 w-full">
                                    <input type="number" className="border-2 border-black p-1 rounded-md" placeholder="day..." min={1} max={31} value={invoiceIssueDate.day} onChange={(e) => setInvoiceIssueDate(prev => ({...prev, day:e.target.value}))}/>
                                    <span className="text-3xl">-</span>
                                    <input type="number" className="border-2 border-black p-1 rounded-md" placeholder="month..." min={1} max={12} value={invoiceIssueDate.month} onChange={(e) => setInvoiceIssueDate(prev => ({...prev, month:e.target.value}))}/>
                                </section>
                            </section>
                            <div className="bg-green-500 w-[50%] h-2 rounded-2xl my-3"></div>
                            <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                                <SelectInput
                                    title="Dzierżawca"
                                    value={editRentFormData.ID_renter}
                                    onChange={(e) => setEditRentFormData(prev => ({...prev, ID_renter:e.target.value}))}
                                    options={
                                    <>
                                        {
                                            allRenters.map((obj, index) => <option key={index} value={obj.ID}>{obj.nazwisko} {obj.imie} {obj.telefon}</option>)
                                        }
                                    </>
                                    }
                                />
                                <section className="base-card">
                                    <h1 className="text-2xl font-bold">Tworzenie nowego dzierżawcy</h1>
                                    <div className="bg-green-500 w-full h-2 rounded-2xl my-3"></div>
                                    <SimpleInput
                                        title="Imie"
                                        placeholder="name..."
                                        value={renterFormData.name}
                                        onChange={(e) => setRenterFormData(prev => ({...prev, name:e.target.value}))}
                                        error={renterErrors.name}
                                    />
                                    <SimpleInput
                                        title="Nazwisko"
                                        placeholder="surname..."
                                        value={renterFormData.surname}
                                        onChange={(e) => setRenterFormData(prev => ({...prev, surname:e.target.value}))}
                                        error={renterErrors.surname}
                                    />
                                    <SimpleInput
                                        type="phone"
                                        title="Telefon"
                                        placeholder="phone..."
                                        value={renterFormData.phone}
                                        onChange={(e) => setRenterFormData(prev => ({...prev, phone:e.target.value}))}
                                        error={renterErrors.phone}
                                    />
                                    <button className="base-btn" onClick={() => {
                                        if(Object.keys(renterFormData).length == 3) {
                                            if(Object.keys(renterErrors).every(ele => renterErrors[ele] == null)) {
                                                requestInsertRenter();
                                            }
                                        }
                                    }}>Stwórz dzierżawce</button>
                                </section>
                            </section>
                            <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                            <SimpleInput
                                type="number"
                                step="any"
                                min={0}
                                title="Wysokość czynszu (zł)"
                                placeholder="rent cost (zł)..."
                                value={editRentFormData.rent}
                                onChange={(e) => setEditRentFormData(prev => ({...prev, rent:e.target.value}))}
                                error={editRentErrors.rent}
                            />
                            <button className="base-btn text-2xl" onClick={() => {
                                if(Object.keys(editRentFormData).length == 4) {
                                    if(Object.keys(editRentErrors).every(ele => editRentErrors[ele] == null)) {
                                        requestEditRent()
                                    }  
                                }
                            }}>Zaktualizuj</button>
                        </section>
                    
                    </>
                }
                {
                    form == "edit_renter" &&
                    <>
                        <section className="my-10">
                            <button className="base-btn text-2xl" onClick={() => setForm(null)}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
                        </section>
                        <section className="base-card">
                            <h1 className="text-2xl font-bold">Edycja Dzierżawcy</h1>
                            <div className="bg-green-500 w-full h-2 rounded-2xl my-3"></div>
                            <SimpleInput
                                title="Imie"
                                placeholder="name..."
                                value={editRenterFormData.name}
                                onChange={(e) => setEditRenterFormData(prev => ({...prev, name:e.target.value}))}
                                error={editRenterErrors.name}
                            />
                            <SimpleInput
                                title="Nazwisko"
                                placeholder="surname..."
                                value={editRenterFormData.surname}
                                onChange={(e) => setEditRenterFormData(prev => ({...prev, surname:e.target.value}))}
                                error={editRenterErrors.surname}
                            />
                            <SimpleInput
                                text="phone"
                                title="Telefon"
                                placeholder="phone..."
                                value={editRenterFormData.phone}
                                onChange={(e) => setEditRenterFormData(prev => ({...prev, phone:e.target.value}))}
                                error={editRenterErrors.phone}
                            />
                            <button className="base-btn" onClick={() => {
                                if(Object.keys(editRenterFormData).length == 3) {
                                    if(Object.keys(editRenterErrors).every(ele => editRenterErrors[ele] == null)) {
                                        requestEditRenter();
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