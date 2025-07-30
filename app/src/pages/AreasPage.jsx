import { useState } from "react";
import NavBar from "../components/NavBar";
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";


export default function AreasPage({}) {

    const loadingUpdate = useLoadingStore((state) => state.update);
    const warningUpdate = useWarningStore((state) => state.update);

    const [form, setForm] = useState(null);

    return (
        <main className="flex justify-between">
            <NavBar requiredRoles={[]}/>
            <section className="flex flex-col items-center w-[calc(100vw-220px)] overflow-y-scroll max-h-screen px-5">

            </section>
        </main>
    )
}