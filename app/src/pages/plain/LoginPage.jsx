import {useEffect, useState } from "react"
import { useForm } from "../../hooks/plain/useForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faWarning} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom";
import {useWarningStore } from "../../hooks/stores/useScreensStore";
import SelectInput from "../../components/inputs/SelectInput";
import SimpleInput from "../../components/inputs/SimpleInput";
import { useApi } from "../../hooks/plain/useApi";


export default function LoginPage({}) {

    const warningUpdate = useWarningStore((state) => state.update);
    const API = useApi();

    const navigate = useNavigate();
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
        "password":{regexp:/.+/, error:"Podaj hasło", optional:true}
    })

    useEffect(() => {
        API.getUsers().then(result => setUsers(result.data));
    }, [adminCreate]);
    
    const registerAdmin = () => {
        warningUpdate(false);
        !API.registerAdmin({...registerFormData}).then(result => result.error || setAdminCreate(false))
    }

    const loginUser = () => {
        API.loginUser({...loginFormData}).then(result => {
            if(!result.error) {
                navigate("/")
            } else {
                if(!result.serverError) {
                    setLoginError(result.error);
                }
            }
        });
    }

    const validateRegisterForm = () => {
        if(Object.keys(registerFormData).length == 3) {
            if(Object.keys(registerErrors).every(ele => registerErrors[ele] == null)) {
                if(checkingPassword === registerFormData.password) {
                    return true;
                }
            }
        }
        return false;
    }

    const validateLoginForm = () => {
        if(Object.keys(loginErrors).every(ele => loginErrors[ele] == null)) {
            return true;
        }
        return false;
    }

    return(
        <main className="w-screen min-h-screen">
            <section className="flex flex-col justify-start items-center h-screen">
                <img src="./SKINVEST_logo.png" alt="" className="w-[200px] my-10" />
                {adminCreate ?
                    <section className="base-card">
                        <h1 className="text-2xl my-2 text-center">Tworzenie konta administratora</h1>
                        <h1 className="text-xl font-bold my-2">SK INVEST</h1>
                        <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                        <section className="py-2 flex-col items-center">
                            <SimpleInput
                                title="Imie"
                                placeholder="name..."
                                value={registerFormData.name}
                                onChange={(e) => setRegisterFormData(prev => ({...prev, name:e.target.value}))}
                                error={registerErrors.name}
                            />
                            <SimpleInput
                                title="Nazwisko"
                                placeholder="surname..."
                                value={registerFormData.surname}
                                onChange={(e) => setRegisterFormData(prev => ({...prev, surname:e.target.value}))}
                                error={registerErrors.surname}
                            />
                            <SimpleInput
                                type="password"
                                title="Hasło"
                                placeholder="password..."
                                value={registerFormData.password}
                                onChange={(e) => setRegisterFormData(prev => ({...prev, password:e.target.value}))}
                                error={registerErrors.password}
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
                        <button className={validateRegisterForm() ? "base-btn" : "unactive-btn"} onClick={() => {
                            if(validateRegisterForm()) {
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
                            <section className="w-[200px]">
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
                            </section>
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
                                        error={loginError}
                                    />
                                    <button className={validateLoginForm() ? "base-btn" : "unactive-btn"} onClick={() => {
                                        if(validateLoginForm()) {
                                            loginUser();
                                        }
                                    }}>Zaloguj</button>
                                </section>
                            }
                        </section>
                    </section>
                }
            </section>
        </main>
    )
}