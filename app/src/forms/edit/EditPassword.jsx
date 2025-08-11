import { useState } from "react";
import SimpleInput from "../../components/inputs/SimpleInput";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useUsersStore } from "../../hooks/stores/useResultStores";
import UpdateSection from "../../pages/sections/UpdateSection";
import { useApi } from "../../hooks/plain/useApi";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../hooks/stores/useUserStore";


export default function EditPassword({passwordFormData, passwordErrors, setPasswordFormData}) {
    const {form, updateForm} = useFormStore();
    const {editID} = useUsersStore();
    const user = useUserStore((state) => state.user);
    const API = useApi();

    const navigate = useNavigate()
    const [checkingPassword, setCheckingPassword] = useState("");

    const checkActualUserDataChange = (editedUserID) => {
        if(editedUserID == user.ID) {
            API.userLogout().then(result => {
                if(!result.error)
                    navigate("/login");
            })
        }
    }

    const requestUpdatePassword = () => {
        API.updatePassword({ID_user:editID, ...passwordFormData}).then(result => {
            if(!result.error) {
                updateForm(null);
                setCheckingPassword("")
                checkActualUserDataChange(editID);
            }
        });
    }
    const valitadePasswordForm = () => {
        if(Object.keys(passwordFormData).length == 1) {
            if(Object.keys(passwordErrors).every(ele => passwordErrors[ele] == null)) {
                if(checkingPassword == (passwordFormData.password || "")) {
                    return true;
                }
            }
        }
        return false;
    }

    return (
        form == "edit_password" && 
        <UpdateSection
            title="Zmiana hasła"
            onSubmit={requestUpdatePassword}
            validateForm={valitadePasswordForm}
            fields={
                <section className="py-2 flex-col items-center">
                    <SimpleInput
                        type="password"
                        title="Hasło"
                        placeholder="password..."
                        value={passwordFormData.password}
                        onChange={(e) => setPasswordFormData(prev => ({...prev, password:e.target.value}))}
                        error={passwordErrors.password}
                    />
                    <SimpleInput
                        type="password"
                        title="Powtórz hasło"
                        placeholder="repeat password..."
                        value={checkingPassword}
                        onChange={(e) => setCheckingPassword(e.target.value)}
                        error={checkingPassword !== (passwordFormData.password || "") && "Hasła nie są takie same"}
                    />
                </section>
            }
        />
    )
}