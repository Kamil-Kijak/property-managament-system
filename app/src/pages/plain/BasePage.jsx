import { useEffect, useRef } from "react";
import NavBar from "../../components/nav/NavBar";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useScrollStore } from "../../hooks/stores/useScrollStore"



export default function BasePage({requiredRoles = [], children}) {

    const form = useFormStore((state) => state.form);
    const {pixels, updatePixels} = useScrollStore();
    const scrollRef = useRef(null);
    const changedPixels = useRef(0);

    useEffect(() => {
        if(!form) {
            scrollRef.current.scrollTo({
                behavior:"smooth",
                top:pixels
            })
        } else {
            updatePixels(changedPixels.current)
        }
    }, [form]);

    return (
        <main className="flex justify-between">
            <NavBar requiredRoles={requiredRoles}/>
            <section ref={scrollRef} className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5" onScroll={(e) => !form && ( changedPixels.current = e.target.scrollTop)}>
                {children}
            </section>
        </main>
    )
}