
import { Fragment } from "react";


export default function LandsForPrint({lands}) {
    const today = new Date();
    return (
        <section className="max-h-full">
            <h1 className="text-3xl text-center font-bold mt-5">Wypis gruntów</h1>
            <p className="text-center mt-2">z dnia {today.toLocaleDateString("pl-PL")}</p>
            <h1 className="text-center font-bold mt-5">Liczba wyników: {lands.length}</h1>
            <table className="my-5 w-full">
                <thead>
                    <tr>
                        <th className="print-table-section">Numer działki</th>
                        <th className="print-table-section">Lokalizacja działki</th>
                        <th className="print-table-section">Specyfikacja</th>
                        <th className="print-table-section">Klasy gruntów</th>
                        <th className="print-table-section">Pow. działki</th>
                        <th className="print-table-section">Właściciel</th>
                        <th className="print-table-section">NR KW/spół. wodna/hipoteka</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        lands.map((obj) =>
                        <Fragment key={obj.ID}>
                            <tr className="border-t-black border-t-2 break-inside-avoid">
                                <td className="print-table-section">{obj.nr_dzialki}</td>
                                <td className="print-table-section">
                                    <p className="">m:{obj.miejscowosc}</p>
                                    <p className="break-all">gm:{obj.gmina}</p>
                                    <p className="break-all">pow:{obj.powiat}</p>
                                    <p className="">woj:{obj.wojewodztwo}</p>
                                </td>
                                <td className="print-table-section">
                                    <p>MPZP: {obj.mpzp || "brak"}</p>
                                    <p>plan ogól.: {obj.plan_ogolny || "brak"}</p>
                                    <p>Przeznaczenie: {obj.przeznaczenie || "brak"}</p>
                                    <p>Rodzaj: {obj.rodzaj || "brak"}</p>
                                </td>
                                <td className="print-table-section">
                                    {
                                        obj.powierzchnie.map((ele, index) =>
                                            <p key={`${index}k`}>{ele.klasa} {ele.p_powierzchnia}ha</p>
                                        )
                                    }
                                </td>
                                <td className="print-table-section">
                                    {obj.powierzchnia}ha
                                </td>
                                <td className="print-table-section">
                                    <p className="break-all">{obj.w_dane_osobowe}</p>
                                    <p>tel:{obj.w_telefon || "BRAK"}</p>
                                </td>
                                <td className="print-table-section">
                                    <p>{obj.nr_kw}</p>
                                    <p>spół. wodna {obj.spolka_wodna ? "TAK" : "NIE"}</p>
                                    <p>hipoteka {obj.hipoteka ? "TAK" : "NIE"}</p>
                                </td>

                            </tr>
                            <tr className="border-t-black border-t-2 border-dashed">
                                <td className="whitespace-nowrap text-sm my-2 py-3">ID: <span className="font-bold">{obj.numer_seryjny_dzialki || "BRAK"}</span></td>
                            </tr>
                        </Fragment>
                        )
                    }
                </tbody>
            </table>
            <h1 className="text-xl text-start font-bold mt-5">Razem</h1>
            <hr className="w-[100%] my-1"/>
            <section className="flex flex-col gap-y-4 justify-center items-start">
                <section className="flex gap-x-1">
                    <p>Powierzchnia fizyczna:</p>
                    <p>{lands.reduce((acc, value) => acc + Number(value.powierzchnia), 0)}ha</p>
                </section>
            </section>
        </section>
    )
}