
import { useRequest } from "../hooks/useRequest";
import { useForm } from "../hooks/useForm";
import { useLoadingStore } from "../hooks/useScreensStore";

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
                <section className="flex flex-col items-start mb-2">
                    <h1 className="font-bold mb-1">Kod MPZP</h1>
                    <input type="text" placeholder="MPZP code..." onChange={(e) => setInsertFormData(prev => ({...prev, code:e.target.value}))} className="border-2 border-black p-1 rounded-md" />
                </section>
                <section className="flex flex-col items-start mb-2">
                    <h1 className="font-bold mb-1">Opis MPZP</h1>
                    <textarea type="text" placeholder="MPZP description..." onChange={(e) => setInsertFormData(prev => ({...prev, description:e.target.value}))} className="border-2 border-black p-1 rounded-md resize-none w-full h-[6rem]"></textarea>
                </section>
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