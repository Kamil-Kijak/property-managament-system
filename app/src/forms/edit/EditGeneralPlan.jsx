import SimpleInput from "../../components/inputs/SimpleInput";
import SimpleTextArea from "../../components/inputs/SimpleTextArea";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useGeneralPlansStore } from "../../hooks/stores/useResultStores";
import UpdateSection from "../../pages/sections/UpdateSection";


export default function EditGeneralPlan({editFormData, editErrors, setEditFormData}) {
    const {form, updateForm} = useFormStore();
    const updateGeneralPlans = useGeneralPlansStore((state) => state.updateGeneralPlans);
    const editID = useGeneralPlansStore((state) => state.editID);
    const API = useApi();

    const requestEditGeneralPlan = () => {
        updateForm(null);
        API.updateGeneralPlan({ID_general_plan:editID, ...editFormData}).then(result => {
            if(!result.error) {
                API.getGeneralPlans().then(result => {
                    if(!result.error) {
                        updateGeneralPlans(result.data)
                    }
                })
            }
        })
    }

    const validateEditForm = () => {
        if(Object.keys(editFormData).length == 2) {
            if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }
    

    return (
        form == "edit" &&
        <UpdateSection
            title="Edycja planu ogólnego"
            validateForm={validateEditForm}
            onSubmit={requestEditGeneralPlan}
            fields={
                <section className="py-2 flex-col items-center">
                    <SimpleInput
                        title="Kod planu"
                        placeholder="plan code..."
                        value={editFormData.code}
                        onChange={(e) => setEditFormData(prev => ({...prev, code:e.target.value}))}
                        error={editErrors.code}
                    />
                    <SimpleTextArea
                        title="Opis planu"
                        placeholder="plan descrption..."
                        value={editFormData.description}
                        onChange={(e) => setEditFormData(prev => ({...prev, description:e.target.value}))}
                        error={editErrors.description}
                    />
                </section>
            }
        />
    )
}