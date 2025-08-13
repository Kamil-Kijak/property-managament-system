

import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faUserTie, faPlus, faPen, faTrashCan, faLock} from "@fortawesome/free-solid-svg-icons";
import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/plain/useForm";
import InsertUser from "../../forms/insert/InsertUser";
import {useWarningStore } from "../../hooks/stores/useScreensStore";
import { useUserStore } from "../../hooks/stores/useUserStore";
import { useUsersStore } from "../../hooks/stores/useResultStores";
import { useApi } from "../../hooks/plain/useApi";
import BasePage from "../plain/BasePage";
import DisplaySection from "../sections/DisplaySection";
import { useFormStore } from "../../hooks/stores/useFormStore";
import EditUser from "../../forms/edit/EditUser";
import EditPassword from "../../forms/edit/EditPassword";

export default function UsersPage({}) {

    const warningUpdate = useWarningStore((state) => state.update);
    const {updateID, updateUsers} = useUsersStore();
    const users = useUsersStore((state) => state.users);
    
    const user = useUserStore((state) => state.user);
    const {updateForm} = useFormStore();

    const API = useApi();
    const navigate = useNavigate();

    const [editFormData, editErrors, setEditFormData] = useForm({
        "name":{regexp:/^[A-Z][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "surname":{regexp:/^[A-ZŁĆŚŁŻŹĄĘ][a-ząęłćśóżź]{1,49}$/, error:"Nie prawidłowe"},
        "role":{regexp:/.+/, error:"Brak roli"}
    })
    const [passwordFormData, passwordErrors, setPasswordFormData] = useForm({
        "password":{regexp:/^.{8,}$/, error:"Hasło za słabe"}
    })
    
    useEffect(() => {
        API.getUsers().then(result => updateUsers(result.data));
    }, []);

    const requestDelete = (ID) => {
        warningUpdate(false);
        API.deleteUser({ID_user:ID}).then(result => {
            if(!result.error) {
                updateUsers(users.filter((obj) => obj.ID != ID))
                checkActualUserDataChange(ID);
            }
        })
    }

    const checkActualUserDataChange = (editedUserID) => {
        if(editedUserID == user.ID) {
            API.userLogout().then(result => {
                if(!result.error)
                    navigate("/login");
            })
        }
    }
    console.log(users);

    return(
        <BasePage requiredRoles={["ADMIN"]}>
            <DisplaySection
                list={users}
                template={(obj) => 
                    <section className="px-8 py-5 shadow-2xl shadow-black/35 flex items-center justify-between my-5" key={obj.ID}>
                        <FontAwesomeIcon icon={faUserTie} className="text-6xl text-green-600"/>
                        <section className="flex flex-col items-start">
                            <h1 className="mx-10 text-2xl">{obj.imie + " " + obj.nazwisko}</h1>
                            <h1 className="mx-10 text-xl font-bold">{obj.rola}</h1>
                        </section>
                        <section className="flex flex-col items-center">
                            <button className="base-btn" onClick={() => {
                                updateForm("edit_password");
                                updateID(obj.ID)
                                setPasswordFormData({});
                            }}><FontAwesomeIcon icon={faLock}/> Zmień hasło</button>
                            <button className="info-btn" onClick={() => {
                                updateForm("edit");
                                updateID(obj.ID)
                                setEditFormData({
                                    name:obj.imie,
                                    surname:obj.nazwisko,
                                    role:obj.rola
                                })
                            }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                            <button className="warning-btn" onClick={() => {
                                warningUpdate(true, "Uwaga", () => requestDelete(obj.ID), () => warningUpdate(false),
                                    <p className="text-white font-bold text-lg mt-5">
                                        Czy napewno chcesz usunąć tego użytkownika?
                                    </p>
                                )
                            }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                        </section>
                    </section>
                }
                footer={
                    <button className="base-btn text-2xl" onClick={() => {
                        updateForm("insert")
                    }}><FontAwesomeIcon icon={faPlus}/> Dodaj nowego użytkownika</button>
                }
            />
            <InsertUser/>
            <EditUser
                editFormData={editFormData}
                editErrors={editErrors}
                setEditFormData={setEditFormData}
            />
            <EditPassword
                passwordFormData={passwordFormData}
                passwordErrors={passwordErrors}
                setPasswordFormData={setPasswordFormData}
            />
        </BasePage>
    )
}