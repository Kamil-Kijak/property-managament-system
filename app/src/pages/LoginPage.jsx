import {useEffect, useState } from "react"
import { useForm } from "../hooks/useForm";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faWarning} from "@fortawesome/free-solid-svg-icons"

import WarningScreen from "../components/screens/WarningScreen";
import { useNavigate } from "react-router-dom";
import { useRequest } from "../hooks/useRequest";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";
import SelectInput from "../components/inputs/SelectInput";
import SimpleInput from "../components/inputs/SimpleInput";


export default function LoginPage({}) {
    
    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update);

    const navigate = useNavigate();
    const requestGetUsers = useRequest("/api/user/get", {});
    const request = useRequest();

    const [users, setUsers] = useState([]);
    const [adminCreate, setAdminCreate] = useState(false);
    const [checkingPassword, setCheckingPassword] = useState("");
    const [loginError, setLoginError] = useState(null);


    const [registerFormData, registerErrors, setRegisterFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "surname":{regexp:/^[A-ZŁĆŚŁŻŹĄĘ][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "password":{regexp:/^.{8,}$/, error:"Hasło za słabe"}
    })
    const [loginFormData, loginErrors, setLoginFormData] = useForm({
        "ID_user":{regexp:/\d/, error:"Podaj użytkownika"},
        "password":{regexp:/.+/, error:"Podaj hasło"}
    })

    useEffect(() => {
        requestGetUsers("/api/user/get", {}).then(result => {
            if(!result.error) {
                setUsers(result.data);
            }
        })
    }, [adminCreate]);
    
    const registerAdmin = () => {
        warningUpdate(false);
        loadingUpdate(true);
        request("/api/user/register_admin", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({...registerFormData})
            }).then(result => {
                if(!result.error) {
                    setAdminCreate(false);
                }
                loadingUpdate(false);
            })
    }
    const loginUser = () => {
        if(Object.keys(loginErrors).every(ele => loginErrors[ele] == null)) {
            loadingUpdate(true);
            request("/api/user/login", {
                    method:"POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify({...loginFormData})
                }).then(result => {
                    loadingUpdate(false);
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
                            <SimpleInput
                                title="Imie"
                                placeholder="name..."
                                value={loginFormData.name}
                                onChange={(e) => setRegisterFormData(prev => ({...prev, name:e.target.value}))}
                                error={loginErrors.name}
                            />
                            <SimpleInput
                                title="Nazwisko"
                                placeholder="surname..."
                                value={loginFormData.surname}
                                onChange={(e) => setRegisterFormData(prev => ({...prev, surname:e.target.value}))}
                                error={loginErrors.surname}
                            />
                            <SimpleInput
                                type="password"
                                title="Hasło"
                                placeholder="password..."
                                value={loginFormData.password}
                                onChange={(e) => setRegisterFormData(prev => ({...prev, password:e.target.value}))}
                                error={loginErrors.password}
                            />
                            <SimpleInput
                                type="password"
                                title="Powtórz hasło"
                                placeholder="repeat password..."
                                value={checkingPassword}
                                onChange={(e) => setCheckingPassword(e.target.value)}
                                error={checkingPassword !== (registerFormData.password || "") && "Hasła nie jednakowe"}
                            />
                        </section>
                        <button className="base-btn" onClick={() => {
                            if(Object.keys(registerFormData).length == 3) {
                                if(Object.keys(registerErrors).every(ele => registerErrors[ele] == null)) {
                                    if(checkingPassword === registerFormData.password) {
                                        warningUpdate(true, "Przed stworzeniem konta", registerAdmin, () => warningUpdate(false),
                                            <>
                                                <p className="text-red-600 font-bold">
                                                    Kiedy tworzysz konto administratora, nie rozpowrzechniaj jego hasła a samo hasło miej dobrze zabezpieczone
                                                        i dostępne tylko dla siebie. 
                                                </p>
                                                <p className="text-white font-bold text-lg mt-5">
                                                    Czy chcesz utworzyć konto?
                                                </p>
                                            </>
                                        )
                                    }
                                }
                            }
                        }}>Stwórz konto</button>
                        <button className="base-btn" onClick={() => setAdminCreate(false)}>Powrót</button>
                    </section>
                    :
                    <section className="base-card">
                        <h1 className="text-2xl my-2 text-center">Logowanie do systemu</h1>
                        <h1 className="text-xl font-bold my-2 text-center">SK INVEST</h1>
                        <div className="bg-green-500 w-full h-1 rounded-2xl my-3"></div>
                        <section className="py-2">
                            {users.some((ele) => ele.rola == `ADMIN`) ?
                            <SelectInput
                                title="Użytkownik"
                                placeholder="Wybierz użytkownika"
                                value={loginFormData.ID_user}
                                onChange={(e) => setLoginFormData(prev => ({...prev, ID_user:e.target.value}))}
                                options={
                                <>
                                    {users.map((ele) => <option key={ele.ID} value={ele.ID}>{ele.imie} {ele.nazwisko} {ele.rola}</option>)}
                                </>
                                }
                             />
                            :
                            <section className="flex flex-col justify-center">
                                <h1 className="text-red-600 text-xl font-bold py-3"><FontAwesomeIcon icon={faWarning}/> Brak konta ADMIN</h1>
                                <button className="base-btn" onClick={() => setAdminCreate(true)}>Stwórz konto ADMIN</button>
                            </section>
                            }
                            {
                                loginFormData.ID_user && loginFormData.ID_user != "" &&
                                <section className="py-4 flex flex-col items-center">
                                    <SimpleInput
                                        type="password"
                                        title="Hasło"
                                        placeholder="password..."
                                        value={loginFormData.password}
                                        onChange={(e) => setLoginFormData(prev => ({...prev, password:e.target.value}))}
                                        error={loginErrors.password}
                                    />
                                    {/* <p className="error-text">{loginErrors[Object.keys(loginErrors).find(ele => loginErrors[ele] != null)]}</p> */}
                                    <button className="base-btn" onClick={loginUser}>Zaloguj</button>
                                    {loginError && <p className="error-text">{loginError}</p>}
                                </section>
                            }
                        </section>
                    </section>
                }
            </section>
        </main>
    )
}