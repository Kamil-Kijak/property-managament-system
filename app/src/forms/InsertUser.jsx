
import { useState} from "react";
import { useRequest } from "../hooks/useRequest";
import { useForm } from "../hooks/useForm";
import { useLoadingStore } from "../hooks/useScreensStore";
import SimpleInput from "../components/inputs/SimpleInput";
import SelectInput from "../components/inputs/SelectInput"

export default function InsertUser({setForm = () => {}, getUsers = () => {}}) {
    const updateLoading = useLoadingStore((state) => state.updateLoading);

    const [checkingPassword, setCheckingPassword] = useState("");

    const [insertFormData, insertErrors, setInsertFormData] = useForm({
            "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Imie musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
            "surname":{regexp:/^[A-ZŁĆŚŁŻŹĄĘ][a-ząęłćśóżź]{1,49}$/, error:"Nazwisko musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
            "password":{regexp:/^\w{8,}$/, error:"Hasło powinno mieć minimum 8 znaków"},
            "role":{regexp:/.+/, error:"brak roli"}
        }
    )
    const request = useRequest();

    const requestInsertUser = () => {
        updateLoading(true);
        setForm(null);
        request("/api/user/insert", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({...insertFormData})
            }).then(result => {
                if(!result.error) {
                    getUsers();
                }
                updateLoading(false);
            })
        }
    return (
        <section className="base-card my-10">
            <h1 className="text-2xl my-2 text-center">Tworzenie nowego użytkownika</h1>
            <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
            <section className="py-2 flex-col items-center">
                <SimpleInput
                    title="Imie"
                    placeholder="name..."
                    value={insertFormData.name}
                    onChange={(e) => setInsertFormData(prev => ({...prev, name:e.target.value}))}
                />
                <SimpleInput
                    title="Nazwisko"
                    placeholder="surname..."
                    value={insertFormData.surname}
                    onChange={(e) => setInsertFormData(prev => ({...prev, surname:e.target.value}))}
                />
                <SimpleInput
                    title="Hasło"
                    placeholder="password..."
                    value={insertFormData.password}
                    onChange={(e) => setInsertFormData(prev => ({...prev, password:e.target.value}))}
                />
                <SimpleInput
                    title="Powtórz hasło"
                    placeholder="repeat password..."
                    value={checkingPassword}
                    onChange={(e) => setCheckingPassword(e.target.value)}
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
            {checkingPassword !== (insertFormData.password || "") && <p className="error-text">Hasła nie są takie same</p>}
            <p className="error-text">{insertErrors[Object.keys(insertErrors).find(ele => insertErrors[ele] != null)]}</p>
            <button className="base-btn" onClick={() => {
                if(Object.keys(insertFormData).length == 4) {
                    if(Object.keys(insertErrors).every(ele => insertErrors[ele] == null)) {
                        if(checkingPassword === insertFormData.password) {
                            requestInsertUser();
                        }
                    }
                    }
            }}>Stwórz użytkownika</button>
        </section>
    )
}