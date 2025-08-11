
import { useFormStore } from "../../hooks/stores/useFormStore"

export default function DisplaySection({list = [], template = (obj, index), footer = <></>}) {

    const form = useFormStore((state) => state.form);

    return (
        !form && <>
            <section className="my-10">
                {
                    list.map((obj, index) => template(obj, index))
                }
            </section>
            {footer}
        </>
    )
}