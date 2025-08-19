
import SearchBar from "../../components/SearchBar"
import { useEffect, useRef, useState } from "react";
import { useWarningStore } from "../../hooks/stores/useScreensStore";
import Renter from "../../components/Renter";
import { useForm } from "../../hooks/plain/useForm";
import SearchInput from "../../components/inputs/SearchInput";
import SearchSelectInput from "../../components/inputs/SearchSelectInput";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useRentersStore } from "../../hooks/stores/useResultStores";
import BasePage from "../plain/BasePage";
import DisplaySection from "../sections/DisplaySection";
import EditRenter from "../../forms/edit/EditRenter";
import EditRent from "../../forms/edit/EditRent";
import SumarizeSection from "../sections/SumarizeSection";

export default function RentPage({}) {
    
    const warningUpdate = useWarningStore((state) => state.update);
    const {renters, updateRenters, updateID} = useRentersStore();
    const API = useApi();
    const updateForm = useFormStore((state) => state.updateForm);

    const limitDisplayRef = useRef(null);

    const [searchFilters, setSearchFilters] = useState({
        show_expired:"",
        name_filter:"",
        surname_filter:"",
        owner_name_filter:"",
        owner_surname_filter:"",
        month_filter:"",
        end_year_filter:"",
        limit:"200"
    });

    const [editRenterFormData, editRenterErrors, setEditRenterFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "surname":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "phone":{regexp:/^[0-9]{9}$/, error:"Nie ma 9 cyfr"},
    })

    const [editRentFormData, editRentErrors, setEditRentFormData] = useForm({
        "start_date":{regexp:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, error:"Zły format"},
        "end_date":{regexp:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, error:"Zły formt"},
        "rent":{regexp:/^\d{0,7}$/, error:"Za duża liczba"},
        "ID_renter":{regexp:/.+/, error:"Wybierz dzierżawce"},
    });
    const [invoiceIssueDate, setInvoiceIssueDate] = useState({
        day:1,
        month:1
    });

    const search = () => {
        const params = new URLSearchParams({
            ...searchFilters,
        });
        API.getRenters(params).then(result => {
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
                updateRenters(renters);
                limitDisplayRef.current.innerHTML = `Limit wyników: ${searchFilters.limit || "NIEOGRANICZONY"}`
            }
        })
    }

    useEffect(() => {
        search();
    }, [])

    const requestDeleteRenter = (ID) => {
        warningUpdate(false);
        API.deleteRenter({ID_renter:ID}).then(result => {
            if(!result.error) {
                search();
            }
        });
    }
    const requestDeleteRent = (ID) => {
        warningUpdate(false);
        API.deleteRent({ID_rent:ID}).then(result => {
            if(!result.error) {
                search();
            }
        });
    }
    return (
        <BasePage requiredRoles={[]}>
            <SearchBar
                onSearch={search}
                elements={
                    <>
                        <SearchInput
                            type="number"
                            min={0}
                            title="limit wyników"
                            placeholder="results limit..."
                            value={searchFilters.limit}
                            onChange={(e) => setSearchFilters(prev => ({...prev, limit:e.target.value}))}
                        />
                        <SearchSelectInput
                            title="Pokaż przedawnione"
                            placeholder=""
                            value={searchFilters.show_expired}
                            onChange={(e) => setSearchFilters(prev => ({...prev, show_expired:e.target.value}))}
                            options={
                                <>
                                    <option value="">NIE</option>
                                    <option value="1">TAK</option>
                                </>
                            }
                        />
                        <SearchInput
                            title="Imie dzierżawcy"
                            placeholder="renter name..."
                            value={searchFilters.name_filter}
                            onChange={(e) => setSearchFilters(prev => ({...prev, name_filter:e.target.value}))}
                        />
                        <SearchInput
                            title="Nazwisko dzierżawcy"
                            placeholder="renter surname..."
                            value={searchFilters.surname_filter}
                            onChange={(e) => setSearchFilters(prev => ({...prev, surname_filter:e.target.value}))}
                        />
                        <SearchInput
                            title="Imie właściciela"
                            placeholder="owner name..."
                            value={searchFilters.owner_name_filter}
                            onChange={(e) => setSearchFilters(prev => ({...prev, owner_name_filter:e.target.value}))}
                        />
                        <SearchInput
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
            <DisplaySection
                header={
                    <>
                        <h1 ref={limitDisplayRef} className="font-bold text-lg mt-5">Limit wyników: {searchFilters.limit || "NIEOGRANICZONY"}</h1>
                        <h1 className="font-bold text-lg mt-5">Znalezione wyniki: {renters.reduce((acc, value) => acc + value.dzialki.length, 0)}</h1>
                        <SumarizeSection>
                            <section className="my-10">
                                <h1 className="text-4xl font-bold text-center">Podsumowanie</h1>
                                <div className="bg-green-500 w-full h-2 rounded-2xl my-3"></div>
                                <section className="flex flex-col gap-y-7 justify-center">
                                    <h1 className="text-2xl">Suma czynszu: {(renters.reduce((acc, value) => acc + value.dzialki.reduce((acc, value) => acc + parseFloat((parseFloat(value.wysokosc_czynszu) * parseFloat(value.powierzchnia))), 0), 0)).toFixed(2)}zł</h1>
                                </section>
                            </section>
                        </SumarizeSection>
                    </>
                }
                list={renters}
                template={(obj, index) =>
                    <Renter
                        key={index}
                        obj={obj}
                        deleteRent={requestDeleteRent}
                        deleteRenter={requestDeleteRenter}
                        editRenter={(ID) => {
                            updateForm("edit_renter");
                            updateID(ID);
                            setEditRenterFormData({
                                name:obj.imie,
                                surname:obj.nazwisko,
                                phone:obj.telefon
                            })
                        }}
                        editRent={
                            (ID) => {
                                updateForm("edit_rent");
                                updateID(ID);
                                const data = obj.dzialki.find((dzialka) => dzialka.ID === ID);
                                const start_date = new Date(data.data_rozpoczecia);
                                const end_date = new Date(data.data_zakonczenia);
                                setEditRentFormData({
                                    start_date:start_date.toLocaleDateString("sv-SE"),
                                    end_date:end_date.toLocaleDateString("sv-SE"),
                                    rent:data.wysokosc_czynszu,
                                    ID_renter:data.ID_dzierzawcy
                                });
                                const invoice_date = new Date(data.data_wystawienia_fv_czynszowej);
                                setInvoiceIssueDate({
                                    day:invoice_date.getDate(),
                                    month:invoice_date.getMonth() + 1
                                })
                            }
                        }
                    />
                }
            />
            <EditRenter
                editRenterFormData={editRenterFormData}
                setEditRenterFormData={setEditRenterFormData}
                editRenterErrors={editRenterErrors}
                search={search}
            />
            <EditRent
                editRentFormData={editRentFormData}
                editRentErrors={editRentErrors}
                setEditRentFormData={setEditRentFormData}
                search={search}
                invoiceIssueDate={invoiceIssueDate}
                setInvoiceIssueDate={setInvoiceIssueDate}
            />
        </BasePage>
    )
}