import SimpleInput from "../../components/inputs/SimpleInput";
import SimpleTextArea from "../../components/inputs/SimpleTextArea";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useMpzpStore } from "../../hooks/stores/useResultStores";
import UpdateSection from "../../pages/sections/UpdateSection";


export default function EditMpzp({editFormData, editErrors, setEditFormData}) {

    const {form, updateForm} = useFormStore();
    const updateMpzp = useMpzpStore((state) => state.updateMpzp);
    const editID = useMpzpStore((state) => state.editID)

    const API = useApi();

    const requestEditMpzp = () => {
        updateForm(null);
        API.updateMpzp({ID_mpzp:editID, ...editFormData}).then(result => {
            if(!result.error) {
                API.getMpzp().then(result => {
                if(!result.error)
                    updateMpzp(result.data)
                })
            }
        })
    }

    const validateEditForm = () => {
        if(Object.keys(editFormData).length == 2) {
            if(Object.keys(editErrors).every(ele => editErrors[ele] == null)) {
                return true;
            }
        }
        return false;
    }

    return (
        form == "edit" &&
        <UpdateSection
            title="Edycja MPZP"
            validateForm={validateEditForm}
            onSubmit={requestEditMpzp}
            fields={
                <section className="py-2 flex-col items-center">
                    <SimpleInput
                        title="Kod MPZP"
                        placeholder="MPZP code..."
                        value={editFormData.code}
                        onChange={(e) => setEditFormData(prev => ({...prev, code:e.target.value.toUpperCase()}))}
                        error={editErrors.code}
                    />
                    <SimpleTextArea
                        title="Opis MPZP"
                        placeholder="MPZP description..."
                        value={editFormData.description}
                        onChange={(e) => setEditFormData(prev => ({...prev, description:e.target.value}))}
                        error={editErrors.description}
                    />
                </section>
            }
        />
    )
}