import { useContext, useEffect, useState } from "react"
import { useForm } from "../hooks/useForm";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faWarning} from "@fortawesome/free-solid-svg-icons"

import WarningScreen from "../components/WarningScreen";
import { screenContext, userContext } from "../App";
import { useNavigate } from "react-router-dom";
import { useRequest } from "../hooks/useRequest";


export default function LoginPage({}) {

    const navigate = useNavigate();
    const requestGetUsers = useRequest("/api/user/get", {});
    const request = useRequest();

    const [users, setUsers] = useState([]);
    const [adminCreate, setAdminCreate] = useState(false);
    const [checkingPassword, setCheckingPassword] = useState("");
    const [loginError, setLoginError] = useState(null);

    const screens = useContext(screenContext);

    const [registerFormData, registerErrors, setRegisterFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Imie musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
        "surname":{regexp:/^[A-ZŁĆŚŁŻŹĄĘ][a-ząęłćśóżź]{1,49}$/, error:"Nazwisko musi zaczynać się wielką literą i musi się mieścić w 50 znakach"},
        "password":{regexp:/^\w{8,}$/, error:"Hasło powinno mieć minimum 8 znaków"}
    })
    const [loginFormData, loginErrors, setLoginFormData] = useForm({
        "ID":{regexp:/\d/, error:"Podaj użytkownika"},
        "password":{regexp:/.+/, error:"Wpisz hasło"}
    })

    useEffect(() => {
        requestGetUsers("/api/user/get", {}).then(result => {
            if(!result.error) {
                setUsers(result.data);
            }
        })
    }, [adminCreate]);

    const checkFormData = () => {
        if(Object.keys(registerFormData).length == 3) {
            if(Object.keys(registerErrors).every(ele => registerErrors[ele] == null)) {
                if(checkingPassword === registerFormData.password) {
                    screens.warning.set(true);
                }
            }
        }
    }
    const registerAdmin = () => {
        // admin register
        screens.warning.set(false);
        screens.loading.set(true);
        request("/api/user/register_admin", {
                    method:"POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify({name:registerFormData.name, surname:registerFormData.surname, password:registerFormData.password})
                }).then(result => {
                    if(!result.error) {
                        setAdminCreate(false);
                    }
                    screens.loading.set(false);
                })
    }
    const loginUser = () => {
        if(Object.keys(loginErrors).every(ele => loginErrors[ele] == null)) {
            screens.loading.set(true);
            request("/api/user/login", {
                    method:"POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify({ID_user:loginFormData.ID, password:loginFormData.password})
                }).then(result => {
                    screens.loading.set(false);
                    if(result.success) {
                        navigate("/")
                    } else {
                        if(!result.serverError) {
                            setLoginError(result.error);
                        }
                    }
                })
        }
    }

    return(
        <main className="w-screen min-h-screen">
            <WarningScreen
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
                cancelCallback={() => screens.warning.set(false)}
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
                                <input type="text" onChange={(e) => setRegisterFormData(prev => ({...prev, name:e.target.value}))} placeholder="name..." className="border-2 border-black p-1 rounded-md" />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Nazwisko</h1>
                                <input type="text" onChange={(e) => setRegisterFormData(prev => ({...prev, surname:e.target.value}))} placeholder="surname..." className="border-2 border-black p-1 rounded-md" />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Hasło</h1>
                                <input type="password" onChange={(e) => setRegisterFormData(prev => ({...prev, password:e.target.value}))} placeholder="password..." className="border-2 border-black p-1 rounded-md" />
                            </section>
                            <section className="flex flex-col items-start mb-2">
                                <h1 className="font-bold mb-1">Powtórz hasło</h1>
                                <input type="password" onChange={(e) => setCheckingPassword(e.target.value)} placeholder="repeat password..." className="border-2 border-black p-1 rounded-md" />
                            </section>
                        </section>
                        {checkingPassword !== (registerFormData.password || "") && <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">Hasła nie są takie same</p>}
                        <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{registerErrors[Object.keys(registerErrors).find(ele => registerErrors[ele] != null)]}</p>
                        <button className="base-btn" onClick={checkFormData}>Stwórz konto</button>
                        <button className="base-btn" onClick={() => setAdminCreate(false)}>Powrót</button>
                    </section>
                    :
                    <section className="base-card">
                        <h1 className="text-2xl my-2 text-center">Logowanie do systemu</h1>
                        <h1 className="text-xl font-bold my-2 text-center">SK INVEST</h1>
                        <div className="bg-green-500 w-full h-1 rounded-2xl my-3"></div>
                        <section className="py-2">
                            {users.some((ele) => ele.rola == `ADMIN`) ?
                            <section className="flex flex-col items-start mb-2">
                                    <h1 className="font-bold mb-1">Użytkownik</h1>
                                    <select className="border-2 border-black rounded-lg p-2" defaultValue={""}
                                        onChange={(e) => setLoginFormData(prev => ({...prev, ID:e.target.value}))}>
                                        <option value="" className="hidden">Wybierz użytkownika</option>
                                        {users.map((ele) => <option key={ele.ID} value={ele.ID}>
                                            {ele.imie} {ele.nazwisko} {ele.rola}
                                        </option>)}
                                    </select>
                            </section>
                            :
                            <section className="flex flex-col justify-center">
                                <h1 className="text-red-600 text-xl font-bold py-3"><FontAwesomeIcon icon={faWarning}/> Brak konta ADMIN</h1>
                                <button className="base-btn" onClick={() => setAdminCreate(true)}>Stwórz konto ADMIN</button>
                            </section>
                            }
                            {
                                loginFormData.ID && loginFormData.ID != "" &&
                                <section className="py-4 flex flex-col items-center">
                                    <section className="flex flex-col items-start mb-4">
                                        <h1 className="font-bold mb-1">Hasło</h1>
                                        <input type="password" onChange={(e) => setLoginFormData(prev => ({...prev, password:e.target.value}))} placeholder="password..." className="border-2 border-black p-2 rounded-md" />
                                    </section>
                                    <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{loginErrors[Object.keys(loginErrors).find(ele => loginErrors[ele] != null)]}</p>
                                    <button className="base-btn" onClick={loginUser}>Zaloguj</button>
                                    {loginError && <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{loginError}</p>}
                                </section>
                            }
                        </section>
                    </section>
                }
            </section>
        </main>
    )
}