
import { useState} from "react";
import { useForm } from "../../hooks/plain/useForm";
import {useUsersStore} from "../../hooks/stores/useResultStores"
import SimpleInput from "../../components/inputs/SimpleInput";
import SelectInput from "../../components/inputs/SelectInput"
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useApi } from "../../hooks/plain/useApi";
import InsertSection from "../../pages/sections/InsertSection";

export default function InsertUser({}) {
    const {updateForm} = useFormStore();
    const updateUsers = useUsersStore((state) => state.updateUsers);

    const API = useApi();
    
    const [insertFormData, insertErrors, setInsertFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "surname":{regexp:/^[A-ZŁĆŚŁŻŹĄĘ][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "password":{regexp:/^.{8,}$/, error:"Za słabe"},
        "role":{regexp:/.+/, error:"Wybierz role"}
    }
)
    const [checkingPassword, setCheckingPassword] = useState("");

    const requestInsertUser = () => {
        updateForm(null);
        API.insertUser({...insertFormData}).then(result => {
            if(!result.error) {
                API.getUsers().then(result => updateUsers(result.data));
            }
        })
    }

    const validateForm = () => {
        if(Object.keys(insertFormData).length == 4) {
            if(Object.keys(insertErrors).every(ele => insertErrors[ele] == null)) {
                if(checkingPassword === insertFormData.password) {
                    return true;
                }
            }
        }
        return false;
    }
    return (
        <InsertSection
            title="Tworzenie nowego użytkownika"
            validateForm={validateForm}
            onSubmit={requestInsertUser}
            fields={
                <section className="py-2 flex-col items-center">
                <SimpleInput
                    title="Imie"
                    placeholder="name..."
                    value={insertFormData.name}
                    onChange={(e) => setInsertFormData(prev => ({...prev, name:e.target.value}))}
                    error={insertErrors.name}
                />
                <SimpleInput
                    title="Nazwisko"
                    placeholder="surname..."
                    value={insertFormData.surname}
                    onChange={(e) => setInsertFormData(prev => ({...prev, surname:e.target.value}))}
                    error={insertErrors.surname}
                />
                <SimpleInput
                    type="password"
                    title="Hasło"
                    placeholder="password..."
                    value={insertFormData.password}
                    onChange={(e) => setInsertFormData(prev => ({...prev, password:e.target.value}))}
                    error={insertErrors.password}
                />
                <SimpleInput
                    type="password"
                    title="Powtórz hasło"
                    placeholder="repeat password..."
                    value={checkingPassword}
                    onChange={(e) => setCheckingPassword(e.target.value)}
                    error={checkingPassword !== (insertFormData.password || "") && "Hasła nie są jednakowe"}
                />
                <SelectInput
                    title="Rola"
                    placeholder="Wybierz role"
                    value={insertFormData.role}
                    onChange={(e) => setInsertFormData(prev => ({...prev, role:e.target.value}))}
                    options={
                    <>
                        <option value="SEKRETARIAT">Sekretariat</option>
                        <option value="Ksiegowosc">Ksiegowosc</option>
                        <option value="ADMIN">Administrator</option>
                    </>}
                />
            </section>
            }
        />
    )
}