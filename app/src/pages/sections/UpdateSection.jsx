import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormStore } from "../../hooks/stores/useFormStore"
import { faPen, faXmark } from "@fortawesome/free-solid-svg-icons";


export default function UpdateSection({title = "Edycja", validateForm = () => {}, onSubmit = () => {}, fields = <></>}) {

    const updateForm = useFormStore((state) => state.updateForm);

    return (
        <>
            <section className="my-10">
                <button className="base-btn text-2xl" onClick={() => updateForm(null)}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
            </section>
            <section className="base-card my-10">
                <h1 className="text-2xl my-2 text-center">{title}</h1>
                <div className="bg-green-500 w-full h-1 rounded-2xl my-3"></div>
                {fields}
                <button className={validateForm() ? "base-btn" : "unactive-btn"} onClick={() => {
                    if(validateForm()) {
                        onSubmit();
                        updateForm(null);
                    }
                }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
            </section>
        </>
    )
}