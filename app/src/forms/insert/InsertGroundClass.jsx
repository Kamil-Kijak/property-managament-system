
import SimpleInput from "../../components/inputs/SimpleInput";
import { useForm } from "../../hooks/plain/useForm";
import SelectInput from "../../components/inputs/SelectInput";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore";
import InsertSection from "../../pages/sections/InsertSection";
import { useEffect, useState } from "react";


export default function InsertGroundClass({search = () => {}, taxDistrict}) {

    const {updateForm} = useFormStore();

    const API = useApi();

    const [groundClassExistError, setGroundClassExistError] = useState(null);

    const [insertFormData, insertErrors, setInsertFormData] = useForm({
        "ground_class":{regexp:/^.{0,10}$/, error:"Za długi"},
        "converter":{regexp:/^\d{1}\.\d{2}$/, error:"Nie ma 2 cyfr po , lub za duża liczba"},
        "tax":{regexp:/.+/, error:"Wybierz rodzaj podatku"}
    });

    useEffect(() => {
        if(insertFormData.tax == "leśny" || insertFormData.tax == "zwolniony") {
            setInsertFormData(prev => ({...prev, converter:"1.00"}))
        }
    }, [insertFormData.tax])

    useEffect(() => {
        const params = new URLSearchParams({
            ground_class:insertFormData.ground_class,
            tax_district:taxDistrict
        })
        API.getGroundClassCount(params).then((result) => {
            if(!result.error) {
                if(result.data.count == 0) {
                    setGroundClassExistError(null)
                } else {
                    setGroundClassExistError("Taka klasa gruntu już istnieje")
                }
            }
        })
    }, [insertFormData.ground_class])


    const requestInsertGroundClass = () => {
        updateForm(null);
        API.insertGroundClass({...insertFormData, tax_district:taxDistrict}).then(result => {
            if(!result.error) {
                search()
            }
        });
    }

    const validateForm = () => {
        if(Object.keys(insertFormData).length == 3) {
            if(Object.keys(insertErrors).every(ele => insertErrors[ele] == null)) {
                if(!groundClassExistError) {
                    return true;
                }
            }
        }
        return false;
    }

    return (
        <InsertSection
            title={`Tworzenie klasy gruntu dla okr. podatkowego nr ${taxDistrict}`}
            validateForm={validateForm}
            onSubmit={requestInsertGroundClass}
            fields={
                <section className="py-2 flex-col items-center">
                    <SimpleInput
                        title="Klasa"
                        placeholder="class..."
                        value={insertFormData.ground_class}
                        onChange={(e) => setInsertFormData(prev => ({...prev, ground_class:e.target.value}))}
                        error={insertErrors.ground_class || groundClassExistError}
                    />
                    <SelectInput
                        title="Rodzaj podatku klasy"
                        value={insertFormData.tax}
                        onChange={(e) => setInsertFormData(prev => ({...prev, tax:e.target.value}))}
                        options={
                                <>
                                    <option value="rolny">Rolny</option>
                                    <option value="leśny">Leśny</option>
                                    <option value="zwolniony">Brak opodatkowania</option>
                                </>
                            }
                    />
                    {
                        insertFormData.tax == "rolny" &&
                        <SimpleInput
                            type="number"
                            step="any"
                            min={0}
                            title="Przelicznik"
                            placeholder="converter..."
                            value={insertFormData.converter}
                            onChange={(e) => setInsertFormData(prev => ({...prev, converter:e.target.value}))}
                            error={insertErrors.converter}
                        />
                    }
                </section>
            }
        />
    )
}