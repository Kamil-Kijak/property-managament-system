import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SimpleInput from "../components/inputs/SimpleInput";
import { useForm } from "../hooks/useForm";
import { useLoadingStore } from "../hooks/useScreensStore";
import { useRequest } from "../hooks/useRequest";
import SelectInput from "../components/inputs/SelectInput";


export default function InsertGroundClass({setForm = () => {}, search = () => {}, taxDistrict}) {

    const updateLoading = useLoadingStore((state) => state.update)
    const request = useRequest();

    const [insertFormData, insertErrors, setInsertFormData] = useForm({
        "ground_class":{regexp:/^.{0,10}$/, error:"Za długi"},
        "converter":{regexp:/^\d{1}\.\d{2}$/, error:"Nie ma 2 cyfr po , lub za duża liczba"},
        "tax":{regexp:/.+/, error:"Wybierz rodzaj podatku"}
    });


    const requestInsertGroundClass = () => {
        updateLoading(true);
        setForm(null);
        request("/api/ground_classes/insert", {
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({...insertFormData, tax_district:taxDistrict})
            }).then(result => {
                if(!result.error) {
                    search()
                }
                updateLoading(false);
            })
    }

    const validateForm = () => {
        if(Object.keys(insertFormData).length == 3) {
            if(Object.keys(insertErrors).every(ele => insertErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    return (
        <>
            <section className="my-4">
                <button className="base-btn text-2xl" onClick={() => setForm(null)}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
            </section>
            <section className="base-card">
                <h1 className="text-2xl my-2 text-center">Tworzenie klasy gruntu dla</h1>
                <h1 className="text-xl font-bold my-2 text-center">okręgu podatkowego nr {taxDistrict}</h1>
                <div className="bg-green-500 w-full h-1 rounded-2xl mt-3"></div>
                <section className="py-2 flex-col items-center">
                    <SimpleInput
                        title="Klasa"
                        placeholder="class..."
                        value={insertFormData.ground_class}
                        onChange={(e) => setInsertFormData(prev => ({...prev, ground_class:e.target.value}))}
                        error={insertErrors.ground_class}
                    />
                    <SimpleInput
                        type="number"
                        step="any"
                        min={0}
                        title="Przelicznik"
                        placeholder="converter..."
                        value={insertFormData.converter}
                        onChange={(e) => setInsertFormData(prev => ({...prev, converter:e.target.value}))}
                        error={insertErrors.converter}
                    />
                    <SelectInput
                        title="Rodzaj podatku klasy"
                        value={insertFormData.tax}
                        onChange={(e) => setInsertFormData(prev => ({...prev, tax:e.target.value}))}
                        options={
                                <>
                                    <option value="rolny">Rolny</option>
                                    <option value="leśny">Leśny</option>
                                </>
                            }
                    />
                </section>
                <button className={validateForm() ? "base-btn" : "unactive-btn"} onClick={() => {
                    if(validateForm()) {
                        requestInsertGroundClass();
                    }
                }}><FontAwesomeIcon icon={faPlus}/> Dodaj klase gruntu</button>
            </section>
        </>
    )
}