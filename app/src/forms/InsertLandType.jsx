
import { useRequest } from "../hooks/useRequest";
import { useForm } from "../hooks/useForm";

import { useLoadingStore } from "../hooks/useScreensStore";
import SimpleInput from "../components/inputs/SimpleInput";

export default function InsertLandType({setForm = () => {}, getLandTypes = () => {}}) {
    const loadingUpdate = useLoadingStore((state) => state.update);
    const request = useRequest();

    const [insertFormData, insertErrors, setInsertFormData] = useForm({
        "name":{regexp:/^[A-Za-zĄĘŚĆŻŹÓŁąęłćśóżź]{1,49}$/, error:"nazwa musi się mieścić od 1 do 50 liter"}
    })

    const requestInsertLandType = () => {
        loadingUpdate(true);
        setForm(null);
        request("/api/land_types/insert", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({...insertFormData})
            }).then(result => {
                if(!result.error) {
                    getLandTypes();
                }
                loadingUpdate(false);
            })
    }

    return (
        <section className="base-card my-10">
                <h1 className="text-2xl my-2 text-center">Tworzenie rodzaju działki</h1>
                <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                <section className="py-2 flex-col items-center">
                    <SimpleInput
                        title="Nazwa rodzaju"
                        placeholder="type name..."
                        value={insertFormData.name}
                        onChange={(e) => setInsertFormData(prev => ({...prev, name:e.target.value}))}
                    />
                </section>
                <p className="error-text">{insertErrors[Object.keys(insertErrors).find(ele => insertErrors[ele] != null)]}</p>
                <button className="base-btn" onClick={() => {
                    if(Object.keys(insertFormData).length == 1) {
                        if(Object.keys(insertErrors).every(ele => insertErrors[ele] == null)) {
                            requestInsertLandType();
                        }
                        }
                }}>Stwórz rodzaj działki</button>
            </section>
    )
}