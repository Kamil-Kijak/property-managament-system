import { useNavigate } from "react-router-dom";
import SelectInput from "../../components/inputs/SelectInput";
import SimpleInput from "../../components/inputs/SimpleInput";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useUsersStore } from "../../hooks/stores/useResultStores";
import UpdateSection from "../../pages/sections/UpdateSection"
import { useUserStore } from "../../hooks/stores/useUserStore";


export default function EditUser({editFormData, editErrors, setEditFormData}) {
    const {form, updateForm} = useFormStore();
    const updateUsers = useUsersStore((state) => state.updateUsers);
    const editID = useUsersStore((state) => state.editID);
    const user = useUserStore((state) => state.user);

    const API = useApi();
    const navigate = useNavigate()

    const checkActualUserDataChange = (editedUserID) => {
        if(editedUserID == user.ID) {
            API.userLogout().then(result => {
                if(!result.error)
                    navigate("/login");
            })
        }
    }

    const validateEditForm = () => {
        if(Object.keys(editFormData).length == 3) {
            if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    const requestEditUser = () => {
        updateForm(null);
        API.updateUser({ID_user:editID, ...editFormData}).then(result => {
            if(!result.error) {
                API.getUsers().then(result => updateUsers(result));
                checkActualUserDataChange(editID);
            }
        })
    }

    return (
        form == "edit" && 
        <UpdateSection
            title="Edycja użytkownika"
            validateForm={validateEditForm}
            onSubmit={requestEditUser}
            fields={
                <section className="py-2 flex-col items-center">
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
                    <SelectInput
                        title="Rola"
                        placeholder=""
                        value={editFormData.role}
                        onChange={(e) => setEditFormData(prev => ({...prev, role:e.target.value}))}
                        options={
                        <>
                            <option value="ADMIN">Administrator</option>
                            <option value="SEKRETARIAT">Sekretariat</option>
                            <option value="Ksiegowosc">Ksiegowosc</option>
                        </>
                        }
                    />
                </section>
            }
        
        />
    )
}