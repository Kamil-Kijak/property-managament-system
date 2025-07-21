
import { useRequest } from "../hooks/useRequest";
import { useForm } from "../hooks/useForm";
import { useLoadingStore } from "../hooks/useScreensStore";

export default function InsertLandPurpose({setForm = () => {}, getLandPurposes = () => {}}) {
    const loadingUpdate = useLoadingStore((state) => state.update)
    const request = useRequest();
    
    const [insertFormData, insertErrors, setInsertFormData] = useForm({
        "type":{regexp:/^[A-Za-zĄĘŚĆŻŹÓŁąęłćśóżź]{1,49}$/, error:"nazwa musi się mieścić od 1 do 50 liter"}
    })

    const requestInsertLandPurpose = () => {
        loadingUpdate(true);
        setForm(null);
        request("/api/land_purposes/insert", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({...insertFormData})
            }).then(result => {
                if(!result.error) {
                    getLandPurposes();
                }
                loadingUpdate(false);
            })
    }
    

    return (
        <section className="base-card my-10">
            <h1 className="text-2xl my-2 text-center">Tworzenie przeznaczenia działki</h1>
            <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
            <section className="py-2 flex-col items-center">
                <section className="flex flex-col items-start mb-2">
                    <h1 className="font-bold mb-1">Nazwa przeznaczenia</h1>
                    <input type="text" placeholder="purpose name..." onChange={(e) => setInsertFormData(prev => ({...prev, type:e.target.value}))} className="border-2 border-black p-1 rounded-md" />
                </section>
            </section>
            <p className="text-red-600 font-bold text-md break-words w-full max-w-xs flex-none text-center">{insertErrors[Object.keys(insertErrors).find(ele => insertErrors[ele] != null)]}</p>
            <button className="base-btn" onClick={() => {
                if(Object.keys(insertFormData).length == 1) {
                    if(Object.keys(insertErrors).every(ele => insertErrors[ele] == null)) {
                        requestInsertLandPurpose();
                    }
                    }
            }}>Stwórz przeznaczenie działki</button>
        </section>
    )
}