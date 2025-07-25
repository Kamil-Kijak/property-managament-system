
import { useRequest } from "../hooks/useRequest";
import { useForm } from "../hooks/useForm";
import { useLoadingStore } from "../hooks/useScreensStore";
import SimpleInput from "../components/inputs/SimpleInput";

export default function InsertLandPurpose({setForm = () => {}, getLandPurposes = () => {}}) {
    const loadingUpdate = useLoadingStore((state) => state.update)
    const request = useRequest();
    
    const [insertFormData, insertErrors, setInsertFormData] = useForm({
        "type":{regexp:/^[A-Za-zĄĘŚĆŻŹÓŁąęłćśóżź]{1,49}$/, error:"Za krótki/długi"}
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
                <SimpleInput
                    title="Nazwa przeznaczenia"
                    placeholder="purpose name..."
                    value={insertFormData.type}
                    onChange={(e) => setInsertFormData(prev => ({...prev, type:e.target.value}))}
                    error={insertErrors.type}
                />
            </section>
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