import { useContext } from "react"
import { screenContext } from "../../App"


export default function LoadingScreen() {
    const screens = useContext(screenContext)

    return (
        screens.loading.value && <>
            <section className="fixed top-0 bottom-0 right-0 left-0 bg-black/60 z-5"></section>
            <section className="fixed top-0 bottom-0 right-0 left-0 flex justify-center items-center z-10 ">
                <section className="w-[250px] h-[250px] border-y-8 border-y-white rounded-full animate-spin">
        
                </section>
            </section>
        </>
    )
}