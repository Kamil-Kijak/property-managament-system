
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useRequest } from "../hooks/useRequest";
import { useForm } from "../hooks/useForm";
import { useLoadingStore } from "../hooks/useScreensStore";

export default function InsertRent({onClose = () => {}, landID}) {

    const updateLoading = useLoadingStore((state) => state.update);
    const request = useRequest();

    const renterSelectRef = useRef(null);
    const renterInputRefs = useRef({});
    const today = new Date();

    const [renterFormData, renterErrors, setRenterFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Imie musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
        "surname":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nazwisko musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
        "phone":{regexp:/^[0-9]{1,15}$/, error:"Telefon musi się mieścić w 15 cyfrach"},
    });

    const [rentFormData, rentErrors, setRentFormData] = useForm({
        "start_date":{regexp:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, error:"Podaj date w dobrym formacie"},
        "end_date":{regexp:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, error:"Podaj date w dobrym formacie"},
        "rent":{regexp:/^\d{0,5}\.\d{2}$/, error:"Wysokość czynszu musi być liczbą z 2 miejscami po przecinku poniżej 100 000"},
        "ID_renter":{regexp:/.+/, error:"Wybierze dzierżawce"},
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
            renterSelectRef.current.value = result.insertID;
            setRenterFormData({});
            renterInputRefs.current["name"].value = ""
            renterInputRefs.current["surname"].value = ""
            renterInputRefs.current["phone"].value = ""
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
                    <section className="flex flex-col items-start my-2">
                        <h1 className="font-bold mb-1">Data rozpoczęcia</h1>
                        <input type="date" className="border-2 border-black p-1 rounded-md" onChange={(e) => setRentFormData(prev => ({...prev, start_date:e.target.value}))}/>
                    </section>
                    <section className="flex flex-col items-start my-2">
                        <h1 className="font-bold mb-1">Data zakończenia</h1>
                        <input type="date" className="border-2 border-black p-1 rounded-md" onChange={(e) => setRentFormData(prev => ({...prev, end_date:e.target.value}))}/>
                    </section>
                </section>
                <section className="flex flex-col items-start my-2">
                    <h1 className="font-bold mb-1">Data wystawienia faktury czynszowej</h1>
                    <section className="flex justify-center items-center gap-x-1 w-full">
                        <input type="number" className="border-2 border-black p-1 rounded-md" placeholder="day..." min={1} max={31} value={invoiceIssueDate.day} onChange={(e) => setInvoiceIssueDate(prev => ({...prev, day:e.target.value}))}/>
                        <span className="text-3xl">-</span>
                        <input type="number" className="border-2 border-black p-1 rounded-md" placeholder="month..." min={1} max={12} value={invoiceIssueDate.month} onChange={(e) => setInvoiceIssueDate(prev => ({...prev, month:e.target.value}))}/>
                    </section>
                </section>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex flex-col items-start my-2">
                    <h1 className="font-bold mb-1">Wysokość czynszu (zł)</h1>
                    <input step={"any"} type="number" placeholder="rent cost (zł)..." className="border-2 border-black p-1 rounded-md" min={0} onChange={(e) => setRentFormData(prev => ({...prev, rent:e.target.value}))} />
                </section>
                <p className="error-text">{rentErrors[Object.keys(rentErrors).find(ele => rentErrors[ele] != null)]}</p>
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