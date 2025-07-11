

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket, faUsers, faHouse, faFile, faCity, faUserTie, faMoneyBillTransfer, faArrowDown, faMountainSun} from "@fortawesome/free-solid-svg-icons"
import { useLocation, useNavigate} from "react-router-dom"
import { useRequest } from "../hooks/useRequest"

import { screenContext, userContext} from "../App"
import { useContext, useRef, useState, useEffect} from "react"


export default function NavBar({requiredRoles = []}) {
    const screens = useContext(screenContext);
    const user = useContext(userContext);
    const location = useLocation()
    const [scrollButtonVisible, setScrollButtonVisible] = useState(true);
    const scrollContainer = useRef();

    const navigate = useNavigate()
    const request = useRequest()

    useEffect(() => {
        request("/api/user/auth", {credentials:"include"}).then(result => {
            if(result.error) {
                navigate("/login")
            } else {
                user.set(result.user)
                if(requiredRoles.length > 0) {
                    if(!requiredRoles.includes(result.user.rola)) {
                        navigate("/")
                    }
                }
            }
        })
    }, [])

    const logout = () => {
        screens.loading.set(true);
        request("/api/user/logout", {credentials:"include"}).then(result => {
            if(!result.error) {
                navigate("/login")
            }
            screens.loading.set(false);
        });
    }
    const scrollDown = () => {
        const element = scrollContainer.current;
        if(element) {
            element.scrollTo({
                top: element.scrollHeight + 1,
                behavior: "smooth",
            })
        }
    }
    const handleScroll = (e) => {
        const el = e.target;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
            if(scrollButtonVisible == true)
                setScrollButtonVisible(false);
        } else {
            if(scrollButtonVisible == false)
                setScrollButtonVisible(true);
        }
    };
    return (
        <nav className="h-screen min-h-screen border-r-4 border-green-500 flex flex-col items-start w-[220px] relative">
            <section className="flex flex-col items-center text-xl px-5">
                <h1 className="text-center font-bold my-2">Zalogowano jako</h1>
                <h1 className="my-1">{user.value.imie} {user.value.nazwisko}</h1>
                <h1 className="my-1">Rola: {user.value.rola}</h1>
                <button className="base-btn text-md" onClick={logout}>Wyloguj się <FontAwesomeIcon icon={faRightFromBracket}/></button>
                <div className="bg-green-500 w-full h-1.5 rounded-2xl mt-3"></div>
            </section>
            <section ref={scrollContainer} className="flex flex-col items-start justify-start mt-5 w-full overflow-y-scroll scrollbar-hide min-h-[70%]" onScroll={handleScroll}>
                <button className={location.pathname == '/lands' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/lands")}><FontAwesomeIcon icon={faHouse}/> Działki</button>
                <button className={location.pathname == '/owners' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/owners")}><FontAwesomeIcon icon={faUsers}/> Właściciele działek</button>
                <button className={location.pathname == '/renters' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/renters")}><FontAwesomeIcon icon={faUsers}/> Dzierżawcy</button>
                <button className={location.pathname == '/areas' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/areas")}><FontAwesomeIcon icon={faMoneyBillTransfer}/> Powierzchnie i podatki</button>
                {
                    user.value.rola === "KSIĘGOWOŚĆ" || user.value.rola === "ADMIN" &&
                    <section className="w-full">
                        <div className="bg-green-500 h-1.5 my-3"></div>
                        <button className={location.pathname == '/groundclasses' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/groundclasses")}><FontAwesomeIcon icon={faMountainSun}/> Klasy gruntów</button>
                    </section>
                }
                {
                    user.value.rola === "ADMIN" &&
                    <section className="w-full">
                        <div className="bg-green-500 h-1.5 my-3"></div>
                        <button className={location.pathname == '/users' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/users")}><FontAwesomeIcon icon={faUserTie}/> Użytkownicy</button>
                        <button className={location.pathname == '/landtypes' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/landtypes")}><FontAwesomeIcon icon={faHouse}/> Rodzaje działek</button>
                        <button className={location.pathname == '/landpurposes' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/landpurposes")}><FontAwesomeIcon icon={faHouse}/> Przeznaczenia działek</button>
                        <button className={location.pathname == '/generalplans' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/generalplans")}><FontAwesomeIcon icon={faFile}/> Plany ogólne</button>
                        <button className={location.pathname == '/mpzp' ? `active-nav-btn` :`nav-btn`} onClick={() => navigate("/mpzp")}><FontAwesomeIcon icon={faCity}/> MPZP</button>
                    </section>
                }
            {
                scrollButtonVisible && 
                    <section onClick={scrollDown} className="w-[50px] h-[50px] absolute bg-white border-4 border-green-600 top-[calc(100%-50px)] left-[calc(50%-25px)] rounded-full animate-bounce flex justify-center items-center cursor-pointer">
                        <FontAwesomeIcon icon={faArrowDown} className="text-xl font-bold text-green-600"/>
                    </section>
            }
            </section>
        </nav>
    )
}