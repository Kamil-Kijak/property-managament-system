import { useEffect, useState } from "react"
import { useForm } from "../hooks/useForm";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faWarning} from "@fortawesome/free-solid-svg-icons"

import WarningScreen from "../components/WarningScreen";

export default function LoginPage({}) {

    const [users, setUsers] = useState([]);
    const [adminCreate, setAdminCreate] = useState(false);
    const [checkingPassword, setCheckingPassword] = useState("");
    const [warningActive, setWarningActive] = useState(false);

    const [formData, errors, setFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Imie musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
        "surname":{regexp:/^[A-ZŁĆŚŁŻŹĄĘ][a-ząęłćśóżź]{1,49}$/, error:"Nazwisko musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
        "password":{regexp:/^\w{8,}$/, error:"Hasło powinno mieć minimum 8 znaków"}
    })

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await fetch("/api/user/get");
                const data = await res.json();
                if(res.status >= 500) {
                    throw new Error(data.error)
                }
                setUsers(data.data);
                console.log(data.data)
            } catch(err) {
                
            }
        }
        getUsers()
    }, []);

    const checkFormData = () => {
        if(Object.keys(errors).every(ele => errors[ele] == null)) {
            if(checkingPassword === formData.password) {
                setWarningActive(true);
            }
        }
    }
    const registerAdmin = async () => {
        setWarningActive(false);
        // admin register
        try {
            console.log(JSON.stringify({name:formData.name, surname:formData.surname, password:formData.password}))
            const res = await fetch("/api/user/register_admin", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({name:formData.name, surname:formData.surname, password:formData.password})
            });
            const data = await res.json();
            if(!res.ok) {
                throw new Error(data.error)
            }
            setAdminCreate(false);
        } catch(err) {
            console.error(err)
        }
    }

    return(
        <main className="w-screen min-h-screen">
            <WarningScreen
                icon={faWarning}
                active={warningActive}
                title="Przed stworzeniem konta"
                description={
                    <>
                        <p className="text-red-600 font-bold">
                            Kiedy tworzysz konto administratora, nie rozpowrzechniaj jego hasła a samo hasło miej dobrze zabezpieczone
                                i dostępne tylko dla siebie. 
                        </p>
                        <p className="text-white font-bold text-lg mt-5">
                            Czy chcesz utworzyć konto?
                        </p>
                    </>
                }
                cancelCallback={() => setWarningActive(false)}
                acceptCallback={() => registerAdmin()}
            />
            <section className="flex flex-col justify-center items-center h-screen">
                {adminCreate ?
                    <section className="base-card">
                        <h1 className="text-2xl my-2 text-center">Tworzenie konta administratora</h1>
                        <h1 className="text-xl font-bold my-2">SK INVEST</h1>
                        <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                        <section className="py-2 flex-col items-center">
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Imie</h1>
                                <input type="text" onChange={(e) => setFormData(prev => ({...prev, name:e.target.value}))} placeholder="name..." className="border-2 border-black p-1 rounded-md" />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Nazwisko</h1>
                                <input type="text" onChange={(e) => setFormData(prev => ({...prev, surname:e.target.value}))} placeholder="surname..." className="border-2 border-black p-1 rounded-md" />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Hasło</h1>
                                <input type="password" onChange={(e) => setFormData(prev => ({...prev, password:e.target.value}))} placeholder="password..." className="border-2 border-black p-1 rounded-md" />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Powtórz hasło</h1>
                                <input type="password" onChange={(e) => setCheckingPassword(e.target.value)} placeholder="repeat password..." className="border-2 border-black p-1 rounded-md" />
                            </section>
                        </section>
                        {checkingPassword !== (formData.password || "") && <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">Hasła nie są takie same</p>}
                        <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{errors[Object.keys(errors).find(ele => errors[ele] != null)]}</p>
                        <button className="base-btn" onClick={checkFormData}>Stwórz konto</button>
                        <button className="base-btn" onClick={() => setAdminCreate(false)}>Powrót</button>
                    </section>
                    :
                    <section className="base-card">
                        <h1 className="text-2xl my-2 text-center">Logowanie do systemu</h1>
                        <h1 className="text-xl font-bold my-2 text-center">SK INVEST</h1>
                        <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                        <section className="py-2">
                            {users.some((ele) => ele.rola == `ADMIN`) ?
                            <select>
                                {users.map((ele) => <option key={ele.ID} value={ele.ID}>{ele.imie + " " + ele.nazwisko + " " + ele.rola}</option>)}
                            </select>
                            :
                            <section className="flex flex-col justify-center">
                                <h1 className="text-red-600 text-xl font-bold py-3"><FontAwesomeIcon icon={faWarning}/> Brak konta ADMIN</h1>
                                <button className="base-btn" onClick={() => setAdminCreate(true)}>Stwórz konto ADMIN</button>
                            </section>
                        }
                        </section>
                    </section>
                }
            </section>
        </main>
    )
}