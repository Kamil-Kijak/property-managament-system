

import { useEffect, useState } from "react";
import SelectInput from "../../components/inputs/SelectInput";
import SimpleInput from "../../components/inputs/SimpleInput";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore"
import {useGroundClassesStore} from "../../hooks/stores/useResultStores"
import UpdateSection from "../../pages/sections/UpdateSection"

export default function EditGroundClass({editFormData, editErrors, setEditFormData, search, taxDistrict}) {

    const {form, updateForm} = useFormStore();
    const editID = useGroundClassesStore((state) => state.editID);

    const API = useApi();

    useEffect(() => {
        if(editFormData.tax == "leśny" || editFormData.tax == "zwolniony") {
            setEditFormData(prev => ({...prev, converter:"1.00"}))
        }
    }, [editFormData.tax])

    const requestEdit = () => {
        updateForm(null);
        API.updateGroundClass({ID_ground_class:editID, ...editFormData}).then(result => {
            if(!result.error) {
                search();
            }
        });
    }

    const validateForm = () => {
        if(Object.keys(editFormData).length == 3) {
            if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    return (
        form == "edit" &&
        <UpdateSection
            title="Edycja klasy gruntu"
            validateForm={validateForm}
            onSubmit={requestEdit}
            fields={
                <section className="py-2 flex-col items-center">
                    <SimpleInput
                        title="Klasa"
                        placeholder="class..."
                        value={editFormData.ground_class}
                        onChange={(e) => setEditFormData(prev => ({...prev, ground_class:e.target.value}))}
                        error={editErrors.ground_class}
                    />
                    <SelectInput
                        title="Rodzaj podatku klasy"
                        value={editFormData.tax}
                        onChange={(e) => setEditFormData(prev => ({...prev, tax:e.target.value}))}
                        options={
                                <>
                                    <option value="rolny">Rolny</option>
                                    <option value="leśny">Leśny</option>
                                    <option value="zwolniony">Brak opodatkowania</option>
                                </>
                            }
                    />
                    {
                        editFormData.tax == "rolny" &&
                        <SimpleInput
                            type="number"
                            step="any"
                            min={0}
                            title="Przelicznik"
                            placeholder="converter..."
                            value={editFormData.converter}
                            onChange={(e) => setEditFormData(prev => ({...prev, converter:e.target.value}))}
                            error={editErrors.converter}
                        />
                    }
                </section>
            }
        />
    )
}