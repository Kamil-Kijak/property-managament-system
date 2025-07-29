

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket, faUsers, faHouse, faFile, faCity, faUserTie, faMoneyBillTransfer, faMountainSun, faLocationDot} from "@fortawesome/free-solid-svg-icons"
import { useLocation, useNavigate} from "react-router-dom"
import { useRequest } from "../hooks/useRequest"

import { useRef, useEffect} from "react"
import { useUserStore } from "../hooks/useUserStore"
import { useLoadingStore } from "../hooks/useScreensStore"


export default function NavBar({requiredRoles = []}) {
    const user = useUserStore((state) => state.user);
    const userUpdate = useUserStore((state) => state.update);
    const loadingUpdate = useLoadingStore((state) => state.update)

    const location = useLocation();
    const scrollContainer = useRef();

    const navigate = useNavigate()
    const request = useRequest()

    useEffect(() => {
        request("/api/user/auth", {credentials:"include"}).then(result => {
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
        });
    }, []);
    
    const logout = () => {
        loadingUpdate(true);
        request("/api/user/logout", {credentials:"include"}).then(result => {
            if(!result.error) {
                navigate("/login")
            }
            loadingUpdate(false);
        });
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
                <button className={location.pathname == '/lands' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/lands")}><FontAwesomeIcon icon={faHouse}/> Działki</button>
                <button className={location.pathname == '/owners' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/owners")}><FontAwesomeIcon icon={faUsers}/> Właściciele działek</button>
                <button className={location.pathname == '/renters' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/renters")}><FontAwesomeIcon icon={faUsers}/> Dzierżawy i Dzierżawcy</button>
                <button className={location.pathname == '/areas' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/areas")}><FontAwesomeIcon icon={faMoneyBillTransfer}/> Powierzchnie i podatki</button>
                {
                    user.rola === "KSIĘGOWOŚĆ" || user.rola === "ADMIN" &&
                    <section className="w-full">
                        <div className="bg-green-500 h-1.5 my-3"></div>
                        <button className={location.pathname == '/groundclasses' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/groundclasses")}><FontAwesomeIcon icon={faMountainSun}/> Klasy gruntów</button>
                        <button className={location.pathname == '/districts' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/districts")}><FontAwesomeIcon icon={faLocationDot}/> gminy i okręgi podatkowe</button>
                    </section>
                }
                {
                    user.rola === "ADMIN" &&
                    <section className="w-full">
                        <div className="bg-green-500 h-1.5 my-3"></div>
                        <button className={location.pathname == '/users' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/users")}><FontAwesomeIcon icon={faUserTie}/> Użytkownicy</button>
                        <button className={location.pathname == '/landtypes' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/landtypes")}><FontAwesomeIcon icon={faHouse}/> Rodzaje działek</button>
                        <button className={location.pathname == '/landpurposes' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/landpurposes")}><FontAwesomeIcon icon={faHouse}/> Przeznaczenia działek</button>
                        <button className={location.pathname == '/generalplans' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/generalplans")}><FontAwesomeIcon icon={faFile}/> Plany ogólne</button>
                        <button className={location.pathname == '/mpzp' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/mpzp")}><FontAwesomeIcon icon={faCity}/> MPZP</button>
                    </section>
                }
            </section>
        </nav>
    )
}