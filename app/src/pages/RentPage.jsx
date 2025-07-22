

import NavBar from "../components/NavBar"
import SearchBar from "../components/SearchBar"
import { useEffect, useState } from "react";
import { useRequest } from "../hooks/useRequest";
import { useLoadingStore } from "../hooks/useScreensStore";

export default function RentPage({}) {
    
    const loadingUpdate = useLoadingStore((state) => state.update);

    const [searchFilters, setSearchFilters] = useState({
        name_filter:"",
        surname_filter:"",
        month_filter:"",
        end_year_filter:""
    });

    const [renters, setRenters] = useState([]);

    const request = useRequest();
    

    const search = () => {
        loadingUpdate(true);
        const params = new URLSearchParams({
            ...searchFilters,
        });
        request(`/api/rents/get?${params.toString()}`, {
                method:"GET",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
            }).then(result => {
                if(!result.error) {
                    const renters = [];
                    result.data.forEach((obj) => {
                        if(!renters.some((ele) => ele.ID == obj.ID_dzierzawcy)) {
                            renters.push({ID:obj.ID_dzierzawcy, imie:obj.d_imie, nazwisko:obj.d_nazwisko, telefon:obj.d_telefon, dzialki:[]});
                        }
                        delete obj.d_nazwisko;
                        delete obj.d_imie;
                        delete obj.d_telefon;
                        renters.find(ele => ele.ID == obj.ID_dzierzawcy).dzialki.push({...obj});
                    });
                    console.log(renters);
                    setRenters(renters);
                }
                loadingUpdate(false);
            })
    }

    useEffect(() => {
        search();
    }, [])
    return (
        <main className="flex justify-between">
            <NavBar requiredRoles={[]}/>
            <section className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5 pb-5 relative">
                <SearchBar
                onSearch={search}
                    elements={
                        <>
                            <section>
                                <h1 className="font-bold">Imie dzierżawcy</h1>
                                <input type="text" placeholder="name..." onChange={(e) => setSearchFilters(prev => ({...prev, name_filter:e.target.value.toUpperCase()}))} className="border-2 border-black rounded-md bg-white px-2 py-1"
                                />
                            </section>
                            <section className="ml-2">
                                <h1 className="font-bold">Nazwisko dzierżawcy</h1>
                                <input type="text" placeholder="surname..." onChange={(e) => setSearchFilters(prev => ({...prev, surname_filter:e.target.value.toUpperCase()}))} className="border-2 border-black rounded-md bg-white px-2 py-1"
                                />
                            </section>
                            <section className="ml-2">
                                <h1 className="font-bold">Miesiąc wystawienia faktury</h1>
                                <select className="border-2 border-black rounded-md bg-white px-2 py-1 w-[200px]" onChange={(e) => setSearchFilters(prev => ({...prev, month_filter:e.target.value}))}>
                                    <option value="" className="hidden">Wybierz</option>
                                    <option value="1">Styczeń</option>
                                    <option value="2">Luty</option>
                                    <option value="3">Marzec</option>
                                    <option value="4">Kwiecień</option>
                                    <option value="5">Maj</option>
                                    <option value="6">Czerwiec</option>
                                    <option value="7">Lipiec</option>
                                    <option value="8">Sierpień</option>
                                    <option value="9">Wrzesień</option>
                                    <option value="10">Październik</option>
                                    <option value="11">Listopad</option>
                                    <option value="12">Grudzień</option>
                                </select>
                            </section>
                            <section className="ml-2">
                                <h1 className="font-bold">Rok zakończenia dzierżawy</h1>
                                <input type="number" placeholder="end year..." onChange={(e) => setSearchFilters(prev => ({...prev, end_year_filter:e.target.value}))} className="border-2 border-black rounded-md bg-white px-2 py-1"
                                />
                            </section>
                        </>
                    }
                
                />
            </section>
        </main>
    )
}