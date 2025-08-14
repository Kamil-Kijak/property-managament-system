
import { useForm } from "../../hooks/plain/useForm";
import SimpleInput from "../../components/inputs/SimpleInput";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useApi } from "../../hooks/plain/useApi";
import { useLandPurposesStore } from "../../hooks/stores/useResultStores";
import InsertSection from "../../pages/sections/InsertSection";

export default function InsertLandPurpose({}) {
    
    const {updateForm} = useFormStore();
    const updateLandPurposes = useLandPurposesStore((state) => state.updateLandPurposes);

    const API = useApi();

    const [insertFormData, insertErrors, setInsertFormData] = useForm({
        "type":{regexp:/^[A-Za-zĄĘŚĆŻŹÓŁąęłćśóżź]{0,49}$/, error:"Za długi"}
    })

    const requestInsertLandPurpose = () => {
        updateForm(null);
        API.insertLandPurpose({...insertFormData}).then(result => {
            if(!result.error) {
                API.getLandPurposes().then(result => {
                    if(!result.error) {
                        updateLandPurposes(result.data)
                    }
                })
            }
        })
    }

    const validateForm = () => {
        if(Object.keys(insertFormData).length == 1) {
            if(Object.keys(insertErrors).every(ele => insertErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }
    
    return (
        <InsertSection
            title="Tworzenie przeznaczenia działki"
            onSubmit={requestInsertLandPurpose}
            validateForm={validateForm}
            fields={
                <section className="py-2 flex-col items-center">
                    <SimpleInput
                        title="Nazwa przeznaczenia"
                        placeholder="purpose name..."
                        value={insertFormData.type}
                        onChange={(e) => setInsertFormData(prev => ({...prev, type:e.target.value}))}
                        error={insertErrors.type}
                    />
                </section>
            }
        />
    )
}