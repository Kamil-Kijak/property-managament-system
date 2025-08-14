
import { useForm } from "../../hooks/plain/useForm";

import SimpleInput from "../../components/inputs/SimpleInput";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useApi } from "../../hooks/plain/useApi";
import { useLandTypesStore } from "../../hooks/stores/useResultStores";
import InsertSection from "../../pages/sections/InsertSection";

export default function InsertLandType({}) {

    const {updateForm} = useFormStore();
    const updateLandTypes = useLandTypesStore((state) => state.updateLandTypes);

    const API = useApi();

    const [insertFormData, insertErrors, setInsertFormData] = useForm({
        "name":{regexp:/^[A-Za-zĄĘŚĆŻŹÓŁąęłćśóżź]{0,49}$/, error:"Za długi"}
    })

    const requestInsertLandType = () => {
        updateForm(null);
        API.insertLandType({...insertFormData}).then(result => {
            if(!result.error) {
                API.getLandTypes().then(result => {
                    if(!result.error) {
                        updateLandTypes(result.data);
                    }
                });
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
            title="Tworzenie rodzaju działki"
            validateForm={validateForm}
            onSubmit={requestInsertLandType}
            fields={
                <section className="py-2 flex-col items-center">
                    <SimpleInput
                        title="Nazwa rodzaju"
                        placeholder="type name..."
                        value={insertFormData.name}
                        onChange={(e) => setInsertFormData(prev => ({...prev, name:e.target.value}))}
                        error={insertErrors.name}
                    />
                </section>
            }
        />
    )
}