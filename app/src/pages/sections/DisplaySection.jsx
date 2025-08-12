
import { useFormStore } from "../../hooks/stores/useFormStore"

export default function DisplaySection({list = [], template = (obj, index), footer = <></>, header = <></>}) {

    const form = useFormStore((state) => state.form);

    return (
        !form && <>
            {header}
            <section className="my-10">
                {
                    list.map((obj, index) => template(obj, index))
                }
            </section>
            {footer}
        </>
    )
}