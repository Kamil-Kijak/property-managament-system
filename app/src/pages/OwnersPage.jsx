
import { useContext, useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import SearchBar from "../components/SearchBar";
import { useRequest } from "../hooks/useRequest";
import { screenContext } from "../App";
import Owner from "../components/Owner";

export default function OwnersPage({}) {

    const screens = useContext(screenContext)

    const [searchFilters, setSearchFilters] = useState({
        name_filter:"",
        surname_filter:""
    });

    const [form, setForm] = useState("");

    const [owners, setOwners] = useState([]);

    const request = useRequest();


    const search = () => {
        const params = new URLSearchParams({
            ...searchFilters,
        });
        screens.loading.set(true);
        request(`/api/owners/get?${params.toString()}`, {
                method:"GET",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
            }).then(result => {
                if(!result.error) {
                    const owners = [];
                    result.data.forEach((obj) => {
                        if(!owners.some((ele) => ele.ID == obj.ID)) {
                            owners.push({ID:obj.ID, imie:obj.imie, nazwisko:obj.nazwisko, telefon:obj.telefon, dzialki:[]});
                        }
                        delete obj.nazwisko;
                        delete obj.imie;
                        delete obj.telefon;
                        owners.find(ele => ele.ID == obj.ID).dzialki.push({...obj});
                    })
                    setOwners(owners);
                    console.log(owners)
                }
                screens.loading.set(false);
            })
    }

    useEffect(() => {
        search();
    }, [])

    return (
        <main className="flex justify-between">
            <NavBar requiredRoles={[]}/>
            <section className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5 pb-5 relative">
                {
                    form == "" &&
                     <>
                        <SearchBar
                        onSearch={search}
                            elements={
                                <>
                                    <section>
                                        <h1 className="font-bold">Imie</h1>
                                        <input type="text" placeholder="name..." onChange={(e) => setSearchFilters(prev => ({...prev, name_filter:e.target.value.toUpperCase()}))} className="border-2 border-black rounded-md bg-white px-2 py-1"
                                        />
                                    </section>
                                    <section className="ml-2">
                                        <h1 className="font-bold">Nazwisko</h1>
                                        <input type="text" placeholder="surname..." onChange={(e) => setSearchFilters(prev => ({...prev, surname_filter:e.target.value.toUpperCase()}))} className="border-2 border-black rounded-md bg-white px-2 py-1"
                                        />
                                    </section>
                                </>
                            }
                        
                        />
                        <section className="my-10">
                            {
                                owners.map((obj, index) => <Owner obj={obj} key={index}/>)
                            } 
                        </section>
                    </>
                }
            </section>
        </main>
    )
}