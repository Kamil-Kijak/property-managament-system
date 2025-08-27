import SimpleInput from "../../components/inputs/SimpleInput";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore"
import { useOwnersStore } from "../../hooks/stores/useResultStores";
import UpdateSection from "../../pages/sections/UpdateSection";


export default function EditOwner({editFormData, editErrors, setEditFormData, search}) {
    const {form, updateForm} = useFormStore();
    const editID = useOwnersStore((state) => state.editID);

    const API = useApi();


    const validateEditForm = () => {
        if(Object.keys(editFormData).length == 2) {
            if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    const requestEdit = () => {
        updateForm(null);
        API.updateOwner({ID_owner:editID, ...editFormData}).then(result => {
            if(!result.error) {
                search();
            }
        });
    }

    return (
        form == "edit" &&
        <UpdateSection
            title="Edycja właściciela"
            validateForm={validateEditForm}
            onSubmit={requestEdit}
            fields={
                <>
                    <SimpleInput
                        title="Dane"
                        placeholder="data..."
                        value={editFormData.personal_data}
                        onChange={(e) => setEditFormData(prev => ({...prev, personal_data:e.target.value}))}
                        error={editErrors.personal_data}
                    />
                    <SimpleInput
                        title="Telefon"
                        placeholder="phone..."
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData(prev => ({...prev, phone:e.target.value}))}
                        error={editErrors.phone}
                    />
                </>
            }
        
        />
    )
}