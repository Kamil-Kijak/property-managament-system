
import SelectInput from "../../components/inputs/SelectInput";
import { useForm } from "../../hooks/plain/useForm";
import SimpleInput from "../../components/inputs/SimpleInput";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/plain/useApi";
import { useLandsStore } from "../../hooks/stores/useResultStores";
import { useFormStore } from "../../hooks/stores/useFormStore";
import InsertSection from "../../pages/sections/InsertSection";


export default function InsertArea({search}) {

    const editID = useLandsStore((state) => state.editID);
    const {updateForm, form} = useFormStore();

    const API = useApi();

    const [insertAreaFormData, insertAreaErrors, setInsertAreaFormData] = useForm({
        "ID_ground_class":{regexp:/.+/, error:"Wybierz klase gruntu"},
        "area":{regexp:/^\d{0,4}\.\d{4}$/, error:"Nie ma 4 cyfr po , lub za duża liczba"},
        "released_area":{regexp:/^(\d{0,4}\.\d{4}|0)$/, error:"Nie ma 4 cyfr po , lub za duża liczba"},
    })

    const [groundClasses, setGroundClasses] = useState([]);

    const getGroundClasses = () => {
        const params = new URLSearchParams({
            ID_land:editID
        })
        API.getLandGroundClasses(params).then(result => {
            if(!result.error) {
                setGroundClasses(result.data);
            }
        });
    }

    const requestInsertArea = () => {
        API.insertArea({...insertAreaFormData, ID_land:editID}).then(result => {
            if(!result.error) {
                updateForm(null);
                search();
            }
        });
    }

    useEffect(() => {
        if(form == "insert_area")
            getGroundClasses();
    }, [form]);

    const validateForm = () => {
        if(Object.keys(insertAreaFormData).length == 3) {
            if(Object.keys(insertAreaErrors).every(ele => insertAreaErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    return (
        <InsertSection
            title="Tworzenie nowej powierzchni"
            validateForm={validateForm}
            onSubmit={requestInsertArea}
            fields={
                <>
                    <section className="flex justify-center w-full gap-x-5">
                        <section className="w-[150px]">
                            <SelectInput
                                title="Klasa gruntu"
                                value={insertAreaFormData.ID_ground_class}
                                onChange={(e) => setInsertAreaFormData(prev => ({...prev, ID_ground_class:e.target.value}))}
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
                            value={insertAreaFormData.area}
                            onChange={(e) => setInsertAreaFormData(prev => ({...prev, area:e.target.value}))}
                            error={insertAreaErrors.area}
                        />
                        <SimpleInput
                            type="number"
                            min={0}
                            step="any"
                            title="Zwolnione ha."
                            placeholder="released area..."
                            value={insertAreaFormData.released_area}
                            onChange={(e) => setInsertAreaFormData(prev => ({...prev, released_area:e.target.value}))}
                            error={insertAreaErrors.released_area}
                        />
                    </section>
                </>
            }
        />
    )
}