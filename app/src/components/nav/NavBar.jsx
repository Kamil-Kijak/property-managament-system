

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket, faUsers, faHouse, faFile, faCity, faUserTie, faMountainSun, faLocationDot} from "@fortawesome/free-solid-svg-icons"
import { useLocation, useNavigate} from "react-router-dom"
import {useApi} from "../../hooks/plain/useApi"

import { useRef, useEffect} from "react"
import { useUserStore } from "../../hooks/stores/useUserStore"
import NavButton from "./NavButton"


export default function NavBar({requiredRoles = []}) {
    const user = useUserStore((state) => state.user);
    const userUpdate = useUserStore((state) => state.update);
    const API = useApi();

    const scrollContainer = useRef();
    const navigate = useNavigate()

    useEffect(() => {
        API.auth().then(result => {
            if(result.error) {
                navigate("/login");
            } else {
                userUpdate(result.user)
                if(requiredRoles.length > 0) {
                    if(!requiredRoles.includes(result.user.rola)) {
                        navigate("/");
                    }
                }
            }
        })
    }, []);
    
    const logout = () => {
        API.userLogout().then(result => {
            if(!result.error) {
                navigate("/login")
            }
        })
    }
    return (
        <nav className="h-screen min-h-screen border-r-4 border-green-500 flex flex-col items-start w-[220px] relative">
            <section className="flex flex-col items-center text-xl px-5">
                <h1 className="text-center font-bold my-2">Zalogowano jako</h1>
                <h1 className="my-1">{user.imie} {user.nazwisko}</h1>
                <h1 className="my-1">Rola: {user.rola}</h1>
                <button className="base-btn text-md" onClick={logout}>Wyloguj się <FontAwesomeIcon icon={faRightFromBracket}/></button>
                <div className="bg-green-500 w-full h-1.5 rounded-2xl mt-3"></div>
            </section>
            <section ref={scrollContainer} className="flex flex-col items-start justify-start mt-5 w-full overflow-y-scroll scrollbar-hide min-h-[70%]">
                <NavButton
                    path="/lands"
                    buttonContent={<><FontAwesomeIcon icon={faHouse}/> Działki</>}
                />
                <NavButton
                    path="/owners"
                    buttonContent={<><FontAwesomeIcon icon={faUsers}/> Właściciele działek</>}
                />
                <NavButton
                    path="/renters"
                    buttonContent={<><FontAwesomeIcon icon={faUsers}/> Dzierżawy i Dzierżawcy</>}
                />
                {
                    user.rola == "TEREN" &&
                    <>
                        <NavButton
                            path="/forms"
                            buttonContent={<><FontAwesomeIcon icon={faFile}/> Formularze</>}
                        />
                    </>
                }
                {
                    (user.rola === "KSIEGOWOSC" || user.rola === "SEKRETARIAT") &&
                    <>
                        <NavButton
                            path="/groundclasses"
                            buttonContent={<><FontAwesomeIcon icon={faMountainSun}/> Klasy gruntów</>}
                        />
                        <NavButton
                            path="/districts"
                            buttonContent={<><FontAwesomeIcon icon={faLocationDot}/> gminy i stawki podatkowe</>}
                        />
                    </>
                }
                {
                    user.rola === "ADMIN" &&
                    <>
                        <NavButton
                            path="/users"
                            buttonContent={<><FontAwesomeIcon icon={faUserTie}/> Użytkownicy</>}
                        />
                        <NavButton
                            path="/landtypes"
                            buttonContent={<><FontAwesomeIcon icon={faHouse}/> Rodzaje działek</>}
                        />
                        <NavButton
                            path="/landpurposes"
                            buttonContent={<><FontAwesomeIcon icon={faHouse}/> Przeznaczenia działek</>}
                        />
                        <NavButton
                            path="/generalplans"
                            buttonContent={<><FontAwesomeIcon icon={faFile}/> Plany ogólne</>}
                        />
                        <NavButton
                            path="/mpzp"
                            buttonContent={<><FontAwesomeIcon icon={faCity}/> MPZP</>}
                        />
                    </>
                }
            </section>
        </nav>
    )
}