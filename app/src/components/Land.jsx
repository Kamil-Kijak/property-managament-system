import { faEye, faFile, faFileArrowDown, faMountainSun, faPen, faPlug, faPlus, faTrashCan, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { useState } from "react";
import {useUserStore} from "../hooks/useUserStore"
import { useLoadingStore, useWarningStore } from "../hooks/useScreensStore";
import { useRef } from "react";
import { useRequest } from "../hooks/useRequest";
import { useEffect } from "react";

export default function Land({obj, editLand, requestDelete, addRent, file = null, setLandFiles = () => {}}) {

    const warningUpdate = useWarningStore((state) => state.update)
    const loadingUpdate = useLoadingStore((state) => state.update)
    const user = useUserStore((state) => state.user)
    const [showingMore, setShowingMore] = useState(false);
    const [showingGroundAreas, setShowingGroundAreas] = useState(false);
    const [areas, setAreas] = useState([]);
    const request = useRequest();
    const showingMoreToggle = useCallback(() => {
        setShowingMore(prev => !prev)
    }, []);

    const showingGroundAreasToggle = useCallback(() => {
        setShowingGroundAreas(prev => !prev);
    }, [])

    useEffect(() => {
        if(areas.length == 0) {
            loadingUpdate(true)
            const params = new URLSearchParams({
                ID_land:obj.ID
            })
            request(`/api/areas/get?${params.toString()}`).then(result => {
                if(!result.error) {
                    setAreas(result.data);
                }
                loadingUpdate(false)
            })
        }
    }, [showingGroundAreas])

    const inputFileRef = useRef(null);

    const selectFile = () => {
        inputFileRef.current.click();
    }
    const uploadFile = (e, serial) => {
        const documentFile = e.target.files[0];
        const formData = new FormData();
        formData.append("file", documentFile);
        request(`/api/files/upload/${serial.replace("/", "-")}`, {
            method: 'POST',
            credentials:"include",
            body: formData
        }).then(result => {
            if(!result.error) {
                console.log("Poprawno wgrano plik")
            }
        })
        setLandFiles(prev => [...prev, `${serial.replace("/", "-")}.png`])
    }


    return (
        <section className="flex flex-col shadow-xl shadow-black/25 p-5 gap-y-6 text-center">
            <section className="flex items-center justify-between gap-x-3">
                <section className="flex items-center justify-start gap-x-5">
                    <button className="base-btn" onClick={showingMoreToggle}><FontAwesomeIcon icon={faEye}/> Pokaż {showingMore ? "mniej":"więcej"}</button>
                    <button className="base-btn" onClick={showingGroundAreasToggle}><FontAwesomeIcon icon={faMountainSun}/> {showingGroundAreas ? "ukryj":"pokaż"} Powierzchnie</button>
                    {!obj.ID_dzierzawy && obj.przeznaczenie == "Dzierżawa" && <button className="base-btn" onClick={() => addRent(obj.ID)}><FontAwesomeIcon icon={faUser}/> Dodaj dzierżawe</button>}
                    <button className="info-btn" onClick={() => editLand(obj.ID)}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                    {user.rola === "ADMIN" && <button className="warning-btn" onClick={() => {
                        warningUpdate(true, "Uwaga", () => requestDelete(obj.ID), () => warningUpdate(false), <>
                            <p className="text-red-600 font-bold">
                                Kiedy usuniesz tą działkę utracisz wszystkie dane na temat tej działki
                            </p>
                            <p className="text-white font-bold text-lg mt-5">
                                Czy napewno chcesz usunąć tą działkę?
                            </p>
                        </>)
                        }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>}
                </section>
                <section className="flex items-center justify-start gap-x-3">
                    {
                        file && <a target="_blank" href={`/api/files/file/${file.substring(0, file.lastIndexOf("."))}`} className="pdf-btn"><FontAwesomeIcon icon={faFile}/> Plik</a>
                    }
                    <button className="pdf-btn" onClick={selectFile}><FontAwesomeIcon icon={faFileArrowDown}/> Wgraj plik</button>
                    <input ref={inputFileRef} type="file" className="hidden" accept="image/png,image/jpg,application/pdf" id="file" onChange={(e) => uploadFile(e, obj.numer_seryjny_dzialki)} />
                </section>
            </section>
            {
                showingGroundAreas &&
                <>
                    <section className="flex justify-around gap-x-5">
                        {
                            areas.map((obj, index) =>
                            <section className="flex gap-x-2">
                                <h1 className="font-bold text-green-500">{obj.klasa}</h1>
                                <p>{obj.przelicznik}ha</p>
                                <p>{obj.powierzchnia}ha</p>
                            </section>)
                        }
                        {
                            areas.length == 0 && <h1 className="font-bold text-2xl">Brak powierzchni klas gruntów</h1>
                        }
                        
                    </section>
                    <section className="flex flex-col justify-center items-center">
                        <button className="base-btn text-xl"><FontAwesomeIcon icon={faPlus}/> Dodaj nową powierzchnie</button>
                    </section>
                </>
            }
            <section className="flex justify-around gap-x-5">
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">ID działki</p>
                    <p>{obj.numer_seryjny_dzialki}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">Obręb</p>
                    <p>{obj.numer_seryjny_dzialki.split(".")[1]}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">Numer działki</p>
                    <p>{obj.nr_dzialki}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">Numer księgi wieczystej</p>
                    <p>{obj.nr_kw}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">Powierzchnia w ha</p>
                    <p>{obj.powierzchnia}ha</p>
                </section>
                <section className="flex flex-col items-center">
                    <p className="font-bold mb-3">Lokalizacja</p>
                    <p>{obj.wojewodztwo}, {obj.powiat}</p>
                    <p>{obj.gmina}, {obj.miejscowosc}</p>
                </section>
            </section>
            {
                showingMore &&
                <>
                    <section className="flex justify-around gap-x-5">
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Spółka wodna</p>
                            <p>{obj.spolka_wodna == 1 ? "TAK" : "NIE"}</p>
                        </section>
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Hipoteka</p>
                            <p>{obj.hipoteka == 1 ? "TAK" : "NIE"}</p>
                        </section>
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">MPZP</p>
                            <p>{obj.mpzp}</p>
                        </section>
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Plan ogólny</p>
                            <p>{obj.plan_ogolny}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Przeznaczenie</p>
                            <p>{obj.przeznaczenie}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Rodzaj</p>
                            <p>{obj.rodzaj}</p>
                        </section>
                    </section>
                    <section className="flex justify-around gap-x-5">
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Dzierżawca</p>
                            <p>{obj.ID_dzierzawy ? `${obj.d_nazwisko} ${obj.d_imie}` : "BRAK"}</p>
                        </section>
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Właściciel</p>
                            <p>{obj.w_imie} {obj.w_nazwisko}</p>
                        </section>
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Data nabycia</p>
                            <p>{new Date(obj.data_nabycia).toLocaleDateString()}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Numer aktu nabycia</p>
                            <p>{obj.nr_aktu}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Od kogo</p>
                            <p>{obj.sprzedawca}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Cena zakupu</p>
                            <p>{obj.cena_zakupu}zł</p>
                        </section>
                    </section>
                    <section className="flex justify-around gap-x-5">
                        
                        <section className="flex flex-col items-center gap-y-3 px-10">
                            <p className="font-bold">Opis</p>
                            <p>{obj.opis} </p>
                        </section>
                    </section>
                
                </>
            }
        </section>
    )
}