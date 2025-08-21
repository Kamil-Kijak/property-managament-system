import { useRef } from "react";
import { useReactToPrint } from "react-to-print"

export default function PrintButton({title = <>Drukuj</>, documentTitle="dokument", printComponent}) {

    const printComponentRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: printComponentRef,
        documentTitle:documentTitle
    });
    
    return (
        <>
            <section className="my-1">
                <button className="base-btn text-xl" onClick={handlePrint}>{title}</button>
            </section>
            <section className="hidden">
                <section ref={printComponentRef}>
                    {printComponent}
                </section>
            </section>
        
        </>
    )
}