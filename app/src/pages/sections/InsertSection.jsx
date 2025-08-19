import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormStore } from "../../hooks/stores/useFormStore"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";


export default function InsertSection({title = "Tworzenie", validateForm = () => {}, onSubmit = () => {}, fields = <></>, showClose = true}) {

    const updateForm = useFormStore((state) => state.updateForm);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <>
            {
                showClose &&
                <section className="my-10">
                    <button className="base-btn text-2xl" onClick={() => updateForm(null)}><FontAwesomeIcon icon={faXmark}/> Zamknij</button>
                </section>
            }
            <section className="base-card my-10">
                <h1 className="text-2xl my-2 text-center">{title}</h1>
                <div className="bg-green-500 w-full h-1 rounded-2xl my-3"></div>
                {fields}
                <button className={validateForm() ? "base-btn" : "unactive-btn"} onClick={() => {
                    if(validateForm()) {
                        onSubmit();
                    }
                }}><FontAwesomeIcon icon={faPlus}/> Dodaj</button>
            </section>
        </>
    )
}