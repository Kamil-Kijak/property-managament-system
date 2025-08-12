
import {useEffect,useState } from "react"
import SearchBar from "../../components/SearchBar";
import Owner from "../../components/Owner";
import { useForm } from "../../hooks/plain/useForm";
import {useWarningStore } from "../../hooks/stores/useScreensStore";
import SearchInput from "../../components/inputs/SearchInput";
import { useOwnersStore } from "../../hooks/stores/useResultStores";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useApi } from "../../hooks/plain/useApi";
import BasePage from "../plain/BasePage";
import DisplaySection from "../sections/DisplaySection";
import EditOwner from "../../forms/edit/EditOwner";

export default function OwnersPage({}) {

    const warningUpdate = useWarningStore((state) => state.update);
    const {owners, updateOwners} = useOwnersStore();
    const updateForm = useFormStore((state) => state.updateForm);
    const API = useApi();

    const [searchFilters, setSearchFilters] = useState({
        name_filter:"",
        surname_filter:""
    });
    const [editFormData, editErrors, setEditFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "surname":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "phone":{regexp:/^[0-9]{9}$/, error:"Nie ma 9 cyfr"},
    })

    const search = () => {
        const params = new URLSearchParams({
            ...searchFilters,
        });
        API.getOwners(params).then(result => {
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
                updateOwners(owners);
            }
        })
    }

    useEffect(() => {
        updateForm(null);
        search();
    }, []);

    const requestDelete = (ID) => {
        warningUpdate(false);
        API.deleteOwner({ID_owner:ID}).then(result => {
            if(!result.error) {
                updateOwners(owners.filter((obj) => obj.ID != ID));
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
            <DisplaySection
                header={<h1 className="font-bold text-lg mt-5">Znalezione wyniki: {owners.length}</h1>}
                list={owners}
                template={(obj) =>
                    <Owner obj={obj}
                    key={obj.ID}
                    requestDelete={requestDelete} 
                    setEditFormData={setEditFormData}
                    />
                }
            
            />
            <EditOwner
                search={search}
                editErrors={editErrors}
                editFormData={editFormData}
                setEditFormData={setEditFormData}
            />
        </BasePage>
    )
}