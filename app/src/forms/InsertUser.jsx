
import { useState} from "react";
import { useRequest } from "../hooks/useRequest";
import { useForm } from "../hooks/useForm";
import { useLoadingStore } from "../hooks/useScreensStore";

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
                <section className="flex flex-col items-start mb-2">
                    <h1 className="font-bold mb-1">Imie</h1>
                    <input type="text" onChange={(e) => setInsertFormData(prev => ({...prev, name:e.target.value}))} placeholder="name..." className="border-2 border-black p-1 rounded-md" />
                </section>
                <section className="flex flex-col items-start mb-2">
                    <h1 className="font-bold mb-1">Nazwisko</h1>
                    <input type="text" onChange={(e) => setInsertFormData(prev => ({...prev, surname:e.target.value}))} placeholder="surname..." className="border-2 border-black p-1 rounded-md" />
                </section>
                <section className="flex flex-col items-start mb-2">
                    <h1 className="font-bold mb-1">Hasło</h1>
                    <input type="password" onChange={(e) => setInsertFormData(prev => ({...prev, password:e.target.value}))} placeholder="password..." className="border-2 border-black p-1 rounded-md" />
                </section>
                <section className="flex flex-col items-start mb-2">
                    <h1 className="font-bold mb-1">Powtórz hasło</h1>
                    <input type="password" onChange={(e) => setCheckingPassword(e.target.value)} placeholder="repeat password..." className="border-2 border-black p-1 rounded-md" />
                </section>
                <section className="flex flex-col items-start mb-2">
                    <h1 className="font-bold mb-1">Rola</h1>
                    <select className="border-2 border-black p-1 rounded-md w-full" defaultValue={""} onChange={(e) => setInsertFormData(prev => ({...prev, role:e.target.value}))}>
                        <option value="" className="hidden">Wybierz role</option>
                        <option value="SEKRETARIAT">Sekretariat</option>
                        <option value="Ksiegowosc">Ksiegowosc</option>
                        <option value="ADMIN">Administrator</option>
                    </select>
                </section>
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