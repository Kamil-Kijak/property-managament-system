
export default function LandPrintForm({}) {
    return (
        <section className="max-h-full">
            <section className="flex justify-start items-center mt-3">
                <h2 className="text-2xl">Miejscowość:</h2>
                <p className="text-2xl">..............................................................................................</p>
            </section>
            <section className="flex justify-start gap-x-10 mt-3">
                <section className="flex justify-start items-center">
                    <h2 className="text-2xl">Nr działki:</h2>
                    <p className="text-2xl">...........................</p>
                </section>
                <section className="flex justify-start items-center">
                    <h2 className="text-2xl">Powierzchnia:</h2>
                    <p className="text-2xl">...........................</p>
                </section>
            </section>
            <section className="flex justify-start items-center mt-3">
                <h2 className="text-2xl">Obecny właściciel:</h2>
                <p className="text-2xl">..............................................................................................</p>
            </section>
            <section className="flex justify-start items-center mt-3">
                <h2 className="text-2xl">Kontakt:</h2>
                <p className="text-2xl">...........................</p>
            </section>
            <section className="flex flex-col justify-center items-center mt-3">
                <h2 className="text-2xl">Opis:</h2>
                {
                    Array.from({length:25}).map(() => 
                        <p className="text-2xl">.........................................................................................................................................</p>
                    )
                }
            </section>
        </section>
    )
}