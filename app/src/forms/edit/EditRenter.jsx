import SimpleInput from "../../components/inputs/SimpleInput";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore"
import { useRentersStore } from "../../hooks/stores/useResultStores";
import UpdateSection from "../../pages/sections/UpdateSection";

export default function EditRenter({editRenterFormData, editRenterErrors, setEditRenterFormData, search}) {
    const {form, updateForm} = useFormStore();

    const editID = useRentersStore((state) => state.editID);
    const API = useApi();

    const validateEditRenterForm = () => {
        if(Object.keys(editRenterFormData).length == 3) {
            if(Object.keys(editRenterErrors).every(ele => editRenterErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }
    const requestEditRenter = () => {
        updateForm(null);
        API.updateRenter({ID_renter:editID, ...editRenterFormData}).then(result => {
            if(!result.error) {
                search();
            }
        });
    }

    return (
        form == "edit_renter" &&
        <UpdateSection
            title="Edycja dzierżawcy"
            validateForm={validateEditRenterForm}
            onSubmit={requestEditRenter}
            fields={
                <>
                    <SimpleInput
                        title="Imie"
                        placeholder="name..."
                        value={editRenterFormData.name}
                        onChange={(e) => setEditRenterFormData(prev => ({...prev, name:e.target.value}))}
                        error={editRenterErrors.name}
                    />
                    <SimpleInput
                        title="Nazwisko"
                        placeholder="surname..."
                        value={editRenterFormData.surname}
                        onChange={(e) => setEditRenterFormData(prev => ({...prev, surname:e.target.value}))}
                        error={editRenterErrors.surname}
                    />
                    <SimpleInput
                        text="phone"
                        title="Telefon"
                        placeholder="phone..."
                        value={editRenterFormData.phone}
                        onChange={(e) => setEditRenterFormData(prev => ({...prev, phone:e.target.value}))}
                        error={editRenterErrors.phone}
                    />
                </>
            }
        />
    )
}