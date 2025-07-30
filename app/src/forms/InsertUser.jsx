
import { useState} from "react";
import { useRequest } from "../hooks/useRequest";
import { useForm } from "../hooks/useForm";
import { useLoadingStore } from "../hooks/useScreensStore";
import SimpleInput from "../components/inputs/SimpleInput";
import SelectInput from "../components/inputs/SelectInput"

export default function InsertUser({setForm = () => {}, getUsers = () => {}}) {
    const updateLoading = useLoadingStore((state) => state.update);

    const [checkingPassword, setCheckingPassword] = useState("");

    const [insertFormData, insertErrors, setInsertFormData] = useForm({
            "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
            "surname":{regexp:/^[A-ZŁĆŚŁŻŹĄĘ][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
            "password":{regexp:/^.{8,}$/, error:"Za słabe"},
            "role":{regexp:/.+/, error:"Wybierz role"}
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
                    title="Hasło"
                    placeholder="password..."
                    value={insertFormData.password}
                    onChange={(e) => setInsertFormData(prev => ({...prev, password:e.target.value}))}
                    error={insertErrors.password}
                />
                <SimpleInput
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