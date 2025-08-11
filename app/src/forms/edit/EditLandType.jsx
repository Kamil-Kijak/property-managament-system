import SimpleInput from "../../components/inputs/SimpleInput";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useLandTypesStore } from "../../hooks/stores/useResultStores";
import UpdateSection from "../../pages/sections/UpdateSection";


export default function EditLandType({editFormData, editErrors, setEditFormData}) {

    const {form, updateForm} = useFormStore();
    const updateLandTypes = useLandTypesStore((state) => state.updateLandTypes);
    const editID = useLandTypesStore((state) => state.editID);

    const API = useApi();

    const requestEditLandType = () => {
        updateForm(null);
        API.updateLandType({ID_land_type:editID, ...editFormData}).then(result => {
            if(!result.error) {
                API.getLandTypes().then(result => {
                    if(!result.error) {
                        updateLandTypes(result.data);
                    }
                });
            }
        });
    }

    const validateEditForm = () => {
        if(Object.keys(editFormData).length == 1) {
            if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    return (
        form == "edit" &&
        <UpdateSection
            title="Edycja rodzaju działki"
            validateForm={validateEditForm}
            onSubmit={requestEditLandType}
            fields={
                <section className="py-2 flex-col items-center">
                    <SimpleInput
                        title="Nazwa rodzaju"
                        placeholder="type name..."
                        value={editFormData.name}
                        onChange={(e) => setEditFormData(prev => ({...prev, name:e.target.value}))}
                        error={editErrors.name}
                    />
                </section>
            }
        />
    )
}