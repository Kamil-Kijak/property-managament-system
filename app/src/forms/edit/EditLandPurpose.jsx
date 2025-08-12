import SimpleInput from "../../components/inputs/SimpleInput";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useLandPurposesStore } from "../../hooks/stores/useResultStores";
import UpdateSection from "../../pages/sections/UpdateSection";


export default function EditLandPurpose({editFormData, editErrors, setEditFormData}) {

    const {form, updateForm} = useFormStore();
    const updateLandPurposes = useLandPurposesStore((state) => state.updateLandPurposes);
    const editID = useLandPurposesStore((state) => state.editID);

    const API = useApi();

    const validateEditForm = () => {
        if(Object.keys(editFormData).length == 1) {
            if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    const requestEditLandPurpose = () => {
        updateForm(null);
        API.updateLandPurpose({ID_land_purpose:editID, ...editFormData}).then(result => {
            if(!result.error) {
                API.getLandPurposes().then(result => {
                    if(!result.error) {
                        updateLandPurposes(result.data)
                    }
                });
            }
        });
    }

    return (
        form == "edit" &&
        <UpdateSection
            title="Edycja przeznaczenia działki"
            validateForm={validateEditForm}
            onSubmit={requestEditLandPurpose}
            fields={
                <section className="py-2 flex-col items-center">
                    <SimpleInput
                        title="Nazwa przeznaczenia"
                        placeholder="purpose name..."
                        value={editFormData.type}
                        onChange={(e) => setEditFormData(prev => ({...prev, type:e.target.value}))}
                        error={editErrors.type}
                    />
                </section>
            }
        />
    )
}