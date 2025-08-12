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
        if(Object.keys(editFormData).length == 3) {
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
                        title="Imie"
                        placeholder="name..."
                        value={editFormData.name}
                        onChange={(e) => setEditFormData(prev => ({...prev, name:e.target.value}))}
                        error={editErrors.name}
                    />
                    <SimpleInput
                        title="Nazwisko"
                        placeholder="surname..."
                        value={editFormData.surname}
                        onChange={(e) => setEditFormData(prev => ({...prev, surname:e.target.value}))}
                        error={editErrors.surname}
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