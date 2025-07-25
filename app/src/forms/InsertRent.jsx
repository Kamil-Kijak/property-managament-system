
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useRequest } from "../hooks/useRequest";
import { useForm } from "../hooks/useForm";
import { useLoadingStore } from "../hooks/useScreensStore";
import SimpleInput from "../components/inputs/SimpleInput";
import SelectInput from "../components/inputs/SelectInput";

export default function InsertRent({onClose = () => {}, landID}) {

    const updateLoading = useLoadingStore((state) => state.update);
    const request = useRequest();
    const today = new Date();

    const [renterFormData, renterErrors, setRenterFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "surname":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "phone":{regexp:/^[0-9]{9}$/, error:"Nie ma 9 cyfr"},
    });

    const [rentFormData, rentErrors, setRentFormData] = useForm({
        "start_date":{regexp:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, error:"Zły format"},
        "end_date":{regexp:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, error:"Zły formt"},
        "rent":{regexp:/^\d{0,5}\.\d{2}$/, error:"Podaj z 2 po przecinku"},
        "ID_renter":{regexp:/.+/, error:"Wybierz dzierżawce"},
    })

    const [invoiceIssueDate, setInvoiceIssueDate] = useState({
        day:today.getDate(),
        month:today.getMonth() + 1
    });
    const [renters, setRenters] = useState([]);

    const fetchAllData = async () => {
        updateLoading(true);
        const rentersResult = await request("/api/renters/get_all", {credentials:"include"});
        if(!rentersResult.error) {
            setRenters(rentersResult.data);
        }
        updateLoading(false);
    }

    useEffect(() => {
        fetchAllData();
    }, []);

    const requestInsertRenter = async () => {
        updateLoading(true)
        const result = await request("/api/renters/insert", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({...renterFormData})
            })
        if(!result.error) {
            await fetchAllData();
            setRentFormData(prev => ({...prev, ID_renter:result.insertID}));
            setRenterFormData({});
        }
        updateLoading(false);
    }

    const requestInsertRent = () => {
        updateLoading(true);
        request("/api/rents/insert", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({...rentFormData, ID_land:landID, invoice_issue_date:`0000-${invoiceIssueDate.month.toString().padStart(2, "0")}-${invoiceIssueDate.day.toString().padStart(2, "0")}`})
            }).then(result => {
                if(!result.error) {
                    onClose();
                }
                updateLoading(false);
            })
    }

    return (
        <>
            <section className="my-4">
                <button className="base-btn text-2xl" onClick={onClose}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
            </section>
            <section className="base-card w-full">
                <h1 className="text-3xl font-bold">Tworzenie nowej dzierżawy</h1>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex justify-center w-full gap-x-5">
                    <SimpleInput
                        type="date"
                        title="Data rozpoczęcia"
                        value={rentFormData.start_date}
                        onChange={(e) => setRentFormData(prev => ({...prev, start_date:e.target.value}))}
                        error={rentErrors.start_date}
                    />
                    <SimpleInput
                        type="date"
                        title="Data zakończenia"
                        value={rentFormData.end_date}
                        onChange={(e) => setRentFormData(prev => ({...prev, end_date:e.target.value}))}
                        error={rentErrors.end_date}
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
                        value={rentFormData.ID_renter}
                        onChange={(e) => setRentFormData(prev => ({...prev, ID_renter:e.target.value}))}
                        options={
                        <>
                            {
                                renters.map((obj, index) => <option key={index} value={obj.ID}>{obj.nazwisko} {obj.imie} {obj.telefon}</option>)
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
                        <p className="error-text">{renterErrors[Object.keys(renterErrors).find(ele => renterErrors[ele] != null)]}</p>
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
                    value={rentFormData.rent}
                    onChange={(e) => setRentFormData(prev => ({...prev, rent:e.target.value}))}
                    error={renterErrors.rent}
                />
                <button className="base-btn text-2xl" onClick={() => {
                    if(Object.keys(rentFormData).length == 4) {
                        if(Object.keys(rentErrors).every(ele => rentErrors[ele] == null)) {
                            requestInsertRent();
                        }  
                    }
                }}>Stwórz nową dzierżawe</button>
            </section>
        </>
    )
}