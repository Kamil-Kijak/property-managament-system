
import { useEffect, useState } from "react";
import { useForm } from "../../hooks/plain/useForm";
import SimpleInput from "../../components/inputs/SimpleInput";
import SelectInput from "../../components/inputs/SelectInput";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useLandsStore } from "../../hooks/stores/useResultStores";
import { useApi } from "../../hooks/plain/useApi";
import InsertSection from "../../pages/sections/InsertSection";

export default function InsertRent({search}) {

    const {form, updateForm} = useFormStore();
    const editID = useLandsStore((state) => state.editID);

    const API = useApi();
    const today = new Date();

    const [renterFormData, renterErrors, setRenterFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "surname":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "phone":{regexp:/^[0-9]{9}$/, error:"Nie ma 9 cyfr"},
    });

    const [rentFormData, rentErrors, setRentFormData] = useForm({
        "start_date":{regexp:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, error:"Zły format"},
        "end_date":{regexp:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, error:"Zły formt"},
        "rent":{regexp:/^\d{0,7}$/, error:"Za duża liczba"},
        "ID_renter":{regexp:/.+/, error:"Wybierz dzierżawce"},
    })

    const [invoiceIssueDate, setInvoiceIssueDate] = useState({
        day:today.getDate(),
        month:today.getMonth() + 1
    });

    const [renters, setRenters] = useState([]);

    const fetchAllData = () => {
        API.getAllRenters().then(result => {
            if(!result.error) {
                setRenters(result.data);
            }
        });
    }

    useEffect(() => {
        if(form == "insert_rent")
            fetchAllData();
    }, [form]);

    const requestInsertRenter = () => {
        API.insertRenter({...renterFormData}).then(result => {
            if(!result.error) {
                fetchAllData();
                setRentFormData(prev => ({...prev, ID_renter:result.insertID}));
                setRenterFormData({});
            }
        })
    }

    const requestInsertRent = () => {
        API.insertRent({...rentFormData, ID_land:editID, invoice_issue_date:`0000-${invoiceIssueDate.month.toString().padStart(2, "0")}-${invoiceIssueDate.day.toString().padStart(2, "0")}`}).then(result => {
            if(!result.error) {
                updateForm(null);
                search();
            }
        })
    }

    const validateRenterForm = () => {
        if(Object.keys(renterFormData).length == 3) {
            if(Object.keys(renterErrors).every(ele => renterErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    const validateForm = () => {
        if(Object.keys(rentFormData).length == 4) {
            if(Object.keys(rentErrors).every(ele => rentErrors[ele] == null)) {
                if(invoiceIssueDate.day && invoiceIssueDate.month) {
                    return true;
                }
            }  
        }
        return false;
    }

    return (
        <InsertSection
            title="Tworzenie nowej dzierżawy"
            validateForm={validateForm}
            onSubmit={requestInsertRent}
            fields={
                <>
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
                    <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                        <section className="w-[200px]">
                            <SelectInput
                                title="Dzierżawca"
                                value={rentFormData.ID_renter}
                                onChange={(e) => setRentFormData(prev => ({...prev, ID_renter:e.target.value}))}
                                options={
                                <>
                                    {
                                        renters.map((obj, index) => <option key={index} value={obj.ID}>{obj.nazwisko} {obj.imie} tel:{obj.telefon}</option>)
                                    }
                                </>
                                }
                            />
                        </section>
                        <InsertSection
                            showClose={false}
                            title="Tworzenie nowego dzierżawcy"
                            validateForm={validateRenterForm}
                            onSubmit={requestInsertRenter}
                            fields={
                                <>
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
                                </>
                            }
                        
                        />
                    </section>
                    <SimpleInput
                        type="number"
                        min={0}
                        title="Wysokość czynszu (zł)"
                        placeholder="rent cost (zł)..."
                        value={rentFormData.rent}
                        onChange={(e) => setRentFormData(prev => ({...prev, rent:e.target.value}))}
                        error={rentErrors.rent}
                    />
                </>
            }
        />
    )
}