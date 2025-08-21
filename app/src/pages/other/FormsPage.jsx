
import LandPrintForm from "../../components/print/LandPrintForm";
import PrintButton from "../../components/print/PrintButton";
import BasePage from "../plain/BasePage";

export default function FormsPage({}) {
    return (
        <BasePage requiredRoles={["TEREN"]}>
            <h1 className="my-10 font-bold text-3xl">Formularze</h1>
            <section className="flex flex-col gap-y-5">
                <PrintButton
                    title={"Formularz działki"}
                    documentTitle="System SK INVEST/formularz"
                    printComponent={<LandPrintForm/>}
                />
            </section>
        </BasePage>
    )
}