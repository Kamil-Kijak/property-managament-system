import { useEffect, useState } from "react";
import SelectInput from "../../components/inputs/SelectInput";
import SimpleInput from "../../components/inputs/SimpleInput";
import { useApi } from "../../hooks/plain/useApi";
import { useForm } from "../../hooks/plain/useForm";
import { useFormStore } from "../../hooks/stores/useFormStore"
import { useRentersStore } from "../../hooks/stores/useResultStores";
import UpdateSection from "../../pages/sections/UpdateSection";
import InsertSection from "../../pages/sections/InsertSection";


export default function EditRent({editRentFormData, editRentErrors, setEditRentFormData, search, invoiceIssueDate, setInvoiceIssueDate}) {
    const {form, updateForm} = useFormStore();
    const editID = useRentersStore((state) => state.editID)

    const API = useApi();

    const [renterFormData, renterErrors, setRenterFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "surname":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "phone":{regexp:/^[0-9]{9}$/, error:"Nie ma 9 cyfr"},
    })
    const [allRenters, setAllRenters] = useState([]);

    useEffect(() => {
        API.getAllRenters().then(result => {
            if(!result.error) {
                setAllRenters(result.data);
            }
        });
    }, []);

    const requestEditRent = () => {
        updateForm(null);
        API.updateRent({...editRentFormData, ID_rent:editID, invoice_issue_date:`0000-${invoiceIssueDate.month.toString().padStart(2, "0")}-${invoiceIssueDate.day.toString().padStart(2, "0")}`}).then(result => {
            if(!result.error) {
                search()
            }
        });
    }

    const validateForm = () => {
        if(Object.keys(editRentFormData).length == 4) {
            if(Object.keys(editRentErrors).every(ele => editRentErrors[ele] == null)) {
                if(invoiceIssueDate.day && invoiceIssueDate.month) {
                    return true;
                }
            }  
        }
        return false;
    }

    const validateRenterForm = () => {
        if(Object.keys(renterFormData).length == 3) {
            if(Object.keys(renterErrors).every(ele => renterErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    const requestInsertRenter = async () => {
        const result = await API.insertRenter({...renterFormData});
        if(!result.error) {
            API.getAllRenters().then(result => {
                if(!result.error) {
                    setAllRenters(result.data);
                }
            });
            setEditRentFormData(prev => ({...prev, ID_renter:result.insertID}));
            setRenterFormData({});
        }
    }

    return (
        form == "edit_rent" &&
        <UpdateSection
            title="Edycja dzierżawy"
            validateForm={validateForm}
            onSubmit={requestEditRent}
            fields={
                <>
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
                    <section className="flex justify-center w-full gap-x-10 my-5 items-center">
                        <section className="w-[200px]">
                            <SelectInput
                                title="Dzierżawca"
                                value={editRentFormData.ID_renter}
                                onChange={(e) => setEditRentFormData(prev => ({...prev, ID_renter:e.target.value}))}
                                options={
                                <>
                                    {
                                        allRenters.map((obj, index) => <option key={index} value={obj.ID}>{obj.nazwisko} {obj.imie} tel:{obj.telefon}</option>)
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
                        value={editRentFormData.rent}
                        onChange={(e) => setEditRentFormData(prev => ({...prev, rent:e.target.value}))}
                        error={editRentErrors.rent}
                    />
                </>
            }
        
        />
    )
}