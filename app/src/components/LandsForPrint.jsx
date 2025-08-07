import React from "react";
import { Fragment } from "react";

const LandsForPrint = React.forwardRef(({lands}, ref) => {
    const today = new Date();
    return (
        <section ref={ref} className="">
            <h1 className="text-3xl text-center font-bold mt-5">Wypis gruntów</h1>
            <p className="text-center mt-2">z dnia {today.toLocaleDateString("pl-PL")}</p>
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
                            <tr className="border-t-black border-t-2">
                                <td className="print-table-section">{obj.nr_dzialki}</td>
                                <td className="print-table-section">
                                    <p>{obj.miejscowosc}, {obj.gmina}</p>
                                    <p>{obj.powiat}</p>
                                    <p>{obj.wojewodztwo}</p>
                                </td>
                                <td className="print-table-section">
                                    <p>MPZP: {obj.mpzp}</p>
                                    <p>plan ogól.: {obj.plan_ogolny}</p>
                                    <p>Przeznaczenie: {obj.przeznaczenie}</p>
                                    <p>Rodzaj: {obj.rodzaj}</p>
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
                                    <p className="break-all">{obj.w_imie}</p>
                                    <p className="break-all">{obj.w_nazwisko}</p>
                                    <p className="break-all">{obj.w_telefon}</p>
                                </td>
                                <td className="print-table-section">
                                    <p>{obj.nr_kw}</p>
                                    <p>spół. wodna {obj.spolka_wodna ? "TAK" : "NIE"}</p>
                                    <p>hipoteka {obj.hipoteka ? "TAK" : "NIE"}</p>
                                </td>

                            </tr>
                            <tr className="border-t-black border-t-2 border-dashed">
                                <td className="whitespace-nowrap my-2 p-3">ID: <span className="font-bold">{obj.numer_seryjny_dzialki}</span></td>
                            </tr>
                        </Fragment>
                        )
                    }
                </tbody>
            </table>
        </section>
    )
});

export default LandsForPrint;