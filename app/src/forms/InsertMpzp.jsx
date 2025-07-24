
import { useRequest } from "../hooks/useRequest";
import { useForm } from "../hooks/useForm";
import { useLoadingStore } from "../hooks/useScreensStore";
import SimpleInput from "../components/inputs/SimpleInput";
import SimpleTextArea from "../components/inputs/SimpleTextArea";

export default function InsertMpzp({setForm = () => {}, getMpzp = () => {}}) {
    const loadingUpdate = useLoadingStore((state) => state.update)
    const request = useRequest();

    const [insertFormData, insertErrors, setInsertFormData] = useForm({
        "code":{regexp:/^[A-ZĄĘŚĆŻŹÓŁ]{2}$/, error:"kod musi zawierać 2 duże litery"},
        "description":{regexp:/^.{1,49}$/, error:"opis musi się mieścić od 1 do 50 liter"}
    })

    const requestInsertMpzp = () => {
        loadingUpdate(true)
        setForm(null);
        request("/api/mpzp/insert", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({...insertFormData})
            }).then(result => {
                if(!result.error) {
                    getMpzp();
                }
                loadingUpdate(false);
            })
    }

    return (
        <section className="base-card my-10">
            <h1 className="text-2xl my-2 text-center">Tworzenie MPZP</h1>
            <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
            <section className="py-2 flex-col items-center">
                <SimpleInput
                    title="Kod MPZP"
                    placeholder="MPZP code..."
                    value={insertFormData.code}
                    onChange={(e) => setInsertFormData(prev => ({...prev, code:e.target.value}))}
                />
                <SimpleTextArea
                    title="Opis MPZP"
                    placeholder="MPZP description..."
                    value={insertFormData.description}
                    onChange={(e) => setInsertFormData(prev => ({...prev, description:e.target.value}))}
                />
            </section>
            <p className="error-text">{insertErrors[Object.keys(insertErrors).find(ele => insertErrors[ele] != null)]}</p>
            <button className="base-btn" onClick={() => {
                if(Object.keys(insertFormData).length == 2) {
                    if(Object.keys(insertErrors).every(ele => insertErrors[ele] == null)) {
                        requestInsertMpzp();
                    }
                    }
            }}>Stwórz MPZP</button>
        </section>
    )
}