import SelectInput from "../../components/inputs/SelectInput";
import SimpleInput from "../../components/inputs/SimpleInput";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useDistrictsStore } from "../../hooks/stores/useResultStores";
import UpdateSection from "../../pages/sections/UpdateSection";


export default function EditDistrict({editFormData, editErrors, setEditFormData, search}) {

    const {form, updateForm} = useFormStore();
    const editID = useDistrictsStore((state) => state.editID);

    const API = useApi();

    const requestEdit = () => {
        updateForm(null);
        API.updateDistricts({ID_localization:editID, ...editFormData}).then(result => {
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
            title="Edycja gminy"
            validateForm={validateForm}
            onSubmit={requestEdit}
            fields={
                <section className="py-2 flex-col items-center">
                    <SelectInput
                        title="Okręg podatkowy"
                        value={editFormData.tax_district}
                        onChange={(e) => setEditFormData(prev => ({...prev, tax_district:e.target.value}))}
                        placeholder="BRAK"
                        options={
                            <>
                                <option value="1">I</option>
                                <option value="2">II</option>
                                <option value="3">III</option>
                                <option value="4">IV</option>
                            </>
                        }
                    />
                    <SimpleInput
                        type="number"
                        min="0"
                        title="Podatek rolny"
                        step="any"
                        placeholder="agricultural tax.."
                        value={editFormData.agricultural_tax}
                        onChange={(e) => setEditFormData(prev => ({...prev, agricultural_tax:e.target.value}))}
                        error={editErrors.agricultural_tax}
                    />
                    <SimpleInput
                        type="number"
                        min="0"
                        title="Podatek leśny"
                        step="any"
                        placeholder="agricultural tax.."
                        value={editFormData.forest_tax}
                        onChange={(e) => setEditFormData(prev => ({...prev, forest_tax:e.target.value}))}
                        error={editErrors.forest_tax}
                    />
                </section>
            }
        />
    )
}