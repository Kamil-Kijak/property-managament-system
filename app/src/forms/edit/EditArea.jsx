import { useEffect, useState } from "react";
import { useFormStore } from "../../hooks/stores/useFormStore"
import UpdateSection from "../../pages/sections/UpdateSection";
import { useApi } from "../../hooks/plain/useApi";
import { useLandsStore } from "../../hooks/stores/useResultStores";
import SelectInput from "../../components/inputs/SelectInput";
import SimpleInput from "../../components/inputs/SimpleInput";

export default function EditArea({areaID, search, editAreaFormData, editAreaErrors, setEditAreaFormData}) {
    const {form, updateForm} = useFormStore();
    const editID = useLandsStore((state) => state.editID);

    const API = useApi();

    const requestEditArea = () => {
        updateForm(null);
        API.updateArea({ID_area:areaID, ...editAreaFormData}).then(result => {
            if(!result.error) {
                search();
            }
        });
    }

    const validateForm = () => {
        if(Object.keys(editAreaFormData).length == 3) {
            if(Object.keys(editAreaErrors).every(ele => editAreaErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        if(form == "edit_area") {
            const params = new URLSearchParams({
                ID_land:editID
            });
            API.getLandGroundClasses(params).then(result => {
                if(!result.error) {
                    setGroundClasses(result.data.sort((a, b) => a.klasa.localeCompare(b.klasa, "pl", { sensitivity: 'base' })));
                }
            })
        }
    }, [form]);

    const [groundClasses, setGroundClasses] = useState([]);
    return (
        form == "edit_area" &&
        <UpdateSection
            title="Edycja powierzchni"
            onSubmit={requestEditArea}
            validateForm={validateForm}
            fields={
                <>
                    <section className="flex justify-center w-full gap-x-5">
                        <section className="w-[150px]">
                            <SelectInput
                                title="Klasa gruntu"
                                value={editAreaFormData.ID_ground_class}
                                onChange={(e) => setEditAreaFormData(prev => ({...prev, ID_ground_class:e.target.value}))}
                                options={
                                    <>
                                        {
                                            groundClasses.map((ele, index) => <option key={index} value={ele.ID}>{ele.klasa} {ele.przelicznik}</option>)
                                        }
                                    </>
                                }
                            />
                        </section>
                    </section>
                    <section className="flex justify-center w-full gap-x-5">
                        <SimpleInput
                            type="number"
                            min={0}
                            step="any"
                            title="Powierzchnia"
                            placeholder="area..."
                            value={editAreaFormData.area}
                            onChange={(e) => setEditAreaFormData(prev => ({...prev, area:e.target.value}))}
                            error={editAreaErrors.area}
                        />
                        <SimpleInput
                            type="number"
                            min={0}
                            step="any"
                            title="Zwolnione ha. "
                            placeholder="released area..."
                            value={editAreaFormData.released_area}
                            onChange={(e) => setEditAreaFormData(prev => ({...prev, released_area:e.target.value}))}
                            error={editAreaErrors.released_area}
                        />
                    </section>
                </>
            }
        
        />
    )
}