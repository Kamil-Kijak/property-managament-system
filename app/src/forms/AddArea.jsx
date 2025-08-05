import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectInput from "../components/inputs/SelectInput";
import { useForm } from "../hooks/useForm";
import SimpleInput from "../components/inputs/SimpleInput";
import { useEffect, useState } from "react";
import { useRequest } from "../hooks/useRequest";
import { useLoadingStore } from "../hooks/useScreensStore";


export default function AddArea({onClose = () => {}, landID}) {

    const loadingUpdate = useLoadingStore((state) => state.update);

    const [insertAreaFormData, insertAreaErrors, setInsertAreaFormData] = useForm({
        "ID_ground_class":{regexp:/.+/, error:"Wybierz klase gruntu"},
        "area":{regexp:/^\d{0,4}\.\d{4}$/, error:"Nie ma 4 cyfr po , lub za duża liczba"},
        "released_area":{regexp:/^(\d{0,4}\.\d{4}|0)$/, error:"Nie ma 4 cyfr po , lub za duża liczba"},
    })

    const request = useRequest();
    const [groundClasses, setGroundClasses] = useState([]);

    const getGroundClasses = () => {
        loadingUpdate(true);
        const params = new URLSearchParams({
            ID_land:landID
        })
        request(`/api/ground_classes/get_land_classes?${params.toString()}`).then(result => {
            if(!result.error) {
                setGroundClasses(result.data);
            }
            loadingUpdate(false);
        })
    }

    const requestInsertArea = () => {
        loadingUpdate(true);
        request("/api/areas/insert", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({...insertAreaFormData, ID_land:landID})
            }).then(result => {
                if(!result.error) {
                    onClose();
                }
                loadingUpdate(false);
            })
    }

    useEffect(() => {
        getGroundClasses();
    }, [])

    return (
        <>
            <section className="my-4">
                <button className="base-btn text-2xl" onClick={onClose}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
            </section>
            <section className="base-card w-full">
                <h1 className="text-3xl font-bold">Tworzenie nowej powierzchni</h1>
                <div className="bg-green-500 w-[50%] h-2 rounded-2xl mt-3"></div>
                <section className="flex justify-center w-full gap-x-5">
                    <section className="w-[150px]">
                        <SelectInput
                            title="Klasa gruntu"
                            value={insertAreaFormData.ID_ground_class}
                            onChange={(e) => setInsertAreaFormData(prev => ({...prev, ID_ground_class:e.target.value}))}
                            options={
                                <>
                                    {
                                        groundClasses.map((ele, index) => <option key={index} value={ele.ID}>{ele.klasa} {ele.przelicznik}</option>)
                                    }
                                </>
                            }
                        />
                    </section>
                </section>
                <section className="flex justify-center w-full gap-x-5">
                    <SimpleInput
                        type="number"
                        min={0}
                        step="any"
                        title="Powierzchnia"
                        placeholder="area..."
                        value={insertAreaFormData.area}
                        onChange={(e) => setInsertAreaFormData(prev => ({...prev, area:e.target.value}))}
                        error={insertAreaErrors.area}
                    />
                    <SimpleInput
                        type="number"
                        min={0}
                        step="any"
                        title="Zwolnione ha. przeliczeniowe"
                        placeholder="released area..."
                        value={insertAreaFormData.released_area}
                        onChange={(e) => setInsertAreaFormData(prev => ({...prev, released_area:e.target.value}))}
                        error={insertAreaErrors.released_area}
                    />
                </section>
                <button className="base-btn text-2xl" onClick={() => {
                    if(Object.keys(insertAreaFormData).length == 3) {
                        if(Object.keys(insertAreaErrors).every(ele => insertAreaErrors[ele] == null)) {
                            requestInsertArea()
                        }
                        }
                }}>Dodaj nową powierzchnie</button>
            </section>
        </>
    )
}