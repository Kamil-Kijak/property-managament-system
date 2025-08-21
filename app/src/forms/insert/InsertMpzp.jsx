
import { useForm } from "../../hooks/plain/useForm";
import SimpleInput from "../../components/inputs/SimpleInput";
import SimpleTextArea from "../../components/inputs/SimpleTextArea";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useMpzpStore } from "../../hooks/stores/useResultStores";
import { useApi } from "../../hooks/plain/useApi";
import InsertSection from "../../pages/sections/InsertSection";
import { useEffect } from "react";
import mpzp from "../../data/mpzp.json"

export default function InsertMpzp({}) {
    const {updateForm} = useFormStore();
    const updateMpzp = useMpzpStore((state) => state.updateMpzp);

    const API = useApi();

    const [insertFormData, insertErrors, setInsertFormData] = useForm({
        "code":{regexp:/^[A-ZĄĘŚĆŻŹÓŁ/]{1,5}$/, error:"Kod od 1 do 5 znaków"},
        "description":{regexp:/^.{0,70}$/, error:"Za długi"}
    });

    useEffect(() => {
        setInsertFormData(prev => ({...prev, description:mpzp[insertFormData.code] || ""}))
    }, [insertFormData.code]);

    const requestInsertMpzp = () => {
        updateForm(null);
        API.insertMpzp({...insertFormData}).then(result => {
            if(!result.error) {
                API.getMpzp().then(result => {
                    if(!result.error)
                        updateMpzp(result.data)
                })
            }
        })
    }
    
    const validateForm = () => {
        if(Object.keys(insertFormData).length == 2) {
            if(Object.keys(insertErrors).every(ele => insertErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    return (
        <InsertSection
            title="Tworzenie MPZP"
            validateForm={validateForm}
            onSubmit={requestInsertMpzp}
            fields={
            <section className="py-2 flex-col items-center">
                <SimpleInput
                    title="Kod MPZP"
                    placeholder="MPZP code..."
                    value={insertFormData.code}
                    onChange={(e) => setInsertFormData(prev => ({...prev, code:e.target.value.toUpperCase()}))}
                    error={insertErrors.code}
                />
                <SimpleTextArea
                    title="Opis MPZP"
                    placeholder="MPZP description..."
                    value={insertFormData.description}
                    onChange={(e) => setInsertFormData(prev => ({...prev, description:e.target.value}))}
                    error={insertErrors.description}
                />
            </section>
            }
        />
    )
}