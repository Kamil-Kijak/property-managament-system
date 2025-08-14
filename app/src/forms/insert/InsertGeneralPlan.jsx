
import { useForm } from "../../hooks/plain/useForm";
import SimpleInput from "../../components/inputs/SimpleInput";
import SimpleTextArea from "../../components/inputs/SimpleTextArea";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useGeneralPlansStore } from "../../hooks/stores/useResultStores";
import InsertSection from "../../pages/sections/InsertSection";

import generalPlans from "../../data/generalPlans.json"
import { useEffect } from "react";

export default function InsertGeneralPlan({}) {

    const {updateForm} = useFormStore();
    const updateGeneralPlans = useGeneralPlansStore((state) => state.updateGeneralPlans);
    const API = useApi();

    const [insertFormData, insertErrors, setInsertFormData] = useForm({
        "code":{regexp:/^[A-ZĄĘŚĆŻŹÓŁ]{2}$/, error:"Kod 2 litery"},
        "description":{regexp:/^.{0,70}$/, error:"Za długi"}
    });

    useEffect(() => {
        setInsertFormData(prev => ({...prev, description:generalPlans[insertFormData.code] || ""}))
    }, [insertFormData.code]);

    const requestInsertGeneralPlan = () => {
        updateForm(null);
        API.insertGeneralPlan({...insertFormData}).then(result => {
            if(!result.error) {
                API.getGeneralPlans().then(result => {
                    if(!result.error) {
                        updateGeneralPlans(result.data)
                    }
                })
            }
        })
    }
    const validateForm = () => {
        if(Object.keys(insertFormData).length == 2) {
            if(Object.keys(insertErrors).every(ele => insertErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    return (
        <InsertSection
            title="Tworzenie planu ogólnego"
            validateForm={validateForm}
            onSubmit={requestInsertGeneralPlan}
            fields={
                <section className="py-2 flex-col items-center">
                    <SimpleInput
                        title="Kod planu"
                        placeholder="plan code..."
                        value={insertFormData.code}
                        onChange={(e) => setInsertFormData(prev => ({...prev, code:e.target.value.toUpperCase()}))}
                        error={insertErrors.code}
                    />
                    <SimpleTextArea
                        title="Opis planu"
                        placeholder="plan description..."
                        value={insertFormData.description}
                        onChange={(e) => setInsertFormData(prev => ({...prev, description:e.target.value}))}
                        error={insertErrors.description}
                    />
                </section>
            }
        />
    )
}