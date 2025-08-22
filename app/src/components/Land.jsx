import { faEye, faFile, faFileArrowDown, faMountainSun, faPen, faPlug, faPlus, faTrashCan, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { useState } from "react";
import {useUserStore} from "../hooks/stores/useUserStore"
import {useWarningStore } from "../hooks/stores/useScreensStore";
import { useRef } from "react";
import { useApi } from "../hooks/plain/useApi";
import { useLandsStore } from "../hooks/stores/useResultStores";
import { useFormStore } from "../hooks/stores/useFormStore";

export default function Land({obj, requestDelete, files = [], setLandFiles = () => {}, search, editArea}) {

    const warningUpdate = useWarningStore((state) => state.update);
    const updateID = useLandsStore((state) => state.updateID);
    const updateForm = useFormStore((state) => state.updateForm);


    const user = useUserStore((state) => state.user)
    const [showingMore, setShowingMore] = useState(false);
    const [showingGroundAreas, setShowingGroundAreas] = useState(false);

    const API = useApi();

    const showingMoreToggle = useCallback(() => {
        setShowingMore(prev => !prev)
    }, []);

    const showingGroundAreasToggle = useCallback(() => {
        setShowingGroundAreas(prev => !prev);
    }, [])

    const inputFileRef = useRef(null);

    const selectFile = () => {
        inputFileRef.current.click();
    }
    const uploadFile = (e, ID) => {
        const documentFiles = Array.from(e.target.files);
        const formData = new FormData();
        documentFiles.forEach(file => {
            formData.append("files", file);
        });
        API.fileUpload(ID, formData).then(result => {
            if(!result.error) {
                search()
            }
        })
    }

    const requestDeleteArea = (ID) => {
        warningUpdate(false);
        API.deleteArea({ID_area:ID}).then(result => {
            if(!result.error) {
                search();
            }
        })
    }

    return (
        <section className="flex flex-col shadow-xl shadow-black/25 p-5 gap-y-6 text-center">
            <section className="flex items-center justify-between gap-x-3">
                <section className="flex items-center justify-start gap-x-5">
                    <button className="base-btn" onClick={showingMoreToggle}><FontAwesomeIcon icon={faEye}/> Pokaż {showingMore ? "mniej":"więcej"}</button>
                    <button className="base-btn" onClick={showingGroundAreasToggle}><FontAwesomeIcon icon={faMountainSun}/> {showingGroundAreas ? "ukryj":"pokaż"} Powierzchnie</button>
                    {!obj.ID_dzierzawy && obj.przeznaczenie == "Dzierżawa" && <button className="base-btn" onClick={() => {
                        updateID(obj.ID)
                        updateForm("insert_rent")
                    }}><FontAwesomeIcon icon={faUser}/> Dodaj dzierżawe</button>}
                    <button className="info-btn" onClick={() => {
                        updateID(obj.ID);
                        updateForm("edit")
                    }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
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
                        files.length > 0 &&
                        <select className="">
                            {
                                files.map((ele) => <option key={ele}>{ele}</option>)
                            }
                        </select>
                    }
                    {
                        user.rola == "SEKRETARIAT" &&
                        <>
                            <button className="pdf-btn" onClick={selectFile}><FontAwesomeIcon icon={faFileArrowDown}/> Wgraj pliki</button>
                            <input ref={inputFileRef} type="file" className="hidden" id="files" multiple={true} onChange={(e) => uploadFile(e, obj.ID)} />
                        </>
                    }
                </section>
            </section>
            {
                showingGroundAreas &&
                <>
                    <section className="flex flex-col justify-center items-center gap-y-3">
                        {
                            
                            obj.powierzchnie.map((ele) =>
                            <section className="flex gap-x-5" key={ele.p_ID}>
                                <section className="flex flex-col items-center justify-center gap-y-3">
                                    <h1 className="font-bold text-sm">Klasa</h1>
                                    <h1 className="font-bold text-xl text-green-500">{ele.klasa}</h1>
                                </section>
                                <section className="flex flex-col items-center justify-center gap-y-3">
                                    <h1 className="font-bold text-sm">Przelicznik</h1>
                                    <p className="text-xl">{ele.przelicznik}</p>
                                </section>
                                <section className="flex flex-col items-center justify-center gap-y-3">
                                    <h1 className="font-bold text-sm">ha. fizyczne</h1>
                                    <p className="text-xl">{ele.p_powierzchnia}ha</p>
                                </section>
                                <section className="flex flex-col items-center justify-center gap-y-3">
                                    <h1 className="font-bold text-sm">ha. przeliczeniowe</h1>
                                    <p className="text-xl">{(ele.p_powierzchnia * ele.przelicznik).toFixed(4)}ha</p>
                                </section>
                                <section className="flex flex-col items-center justify-center gap-y-3">
                                    <h1 className="font-bold text-sm">ha. zwolnione</h1>
                                    <p className="text-xl">{ele.zwolniona_powierzchnia}ha</p>
                                </section>
                                <section className="flex flex-col items-center justify-center gap-y-3">
                                    <h1 className="font-bold text-sm">stawka</h1>
                                    <p className="text-xl">{ele.podatek == "zwolniony" ? 0 : ele.podatek == "rolny" ? (obj.podatek_rolny || 0) : (obj.podatek_lesny || 0)}zł</p>
                                </section>
                                <section className="flex flex-col items-center justify-center gap-y-3">
                                    <h1 className="font-bold text-sm">podatek</h1>
                                    <p className="text-xl">{
                                        ele.podatek == "leśny" ? ((Number(ele.p_powierzchnia) - ele.zwolniona_powierzchnia) * (obj.podatek_lesny || 0)).toFixed(4) : ele.podatek == "zwolniony" ? 0 :
                                        ((Number((Number(ele.p_powierzchnia) * ele.przelicznik).toFixed(4)) - ele.zwolniona_powierzchnia) * (obj.podatek_rolny || 0)).toFixed(4)
                                    }zł</p>
                                </section>
                                {
                                    user.rola == "KSIEGOWOSC" && 
                                    <section className="flex flex-col items-center justify-center">
                                        <button className="warning-btn" onClick={() => {
                                            warningUpdate(true, "Uwaga", () => requestDeleteArea(ele.p_ID), () => warningUpdate(false), <>
                                                <p className="text-white font-bold text-lg mt-5">
                                                    Czy napewno chcesz usunąć tą powierzchnie?
                                                </p>
                                            </>)
                                        }}><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                                        <button className="info-btn" onClick={() => editArea(ele.p_ID, obj.ID, {
                                            ID_ground_class:ele.k_ID,
                                            area:ele.p_powierzchnia,
                                            released_area:ele.zwolniona_powierzchnia
                                        })}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                                    </section>
                                }
                            </section>)
                        }
                        {
                            obj.powierzchnie.length == 0 && <h1 className="font-bold text-2xl">Brak powierzchni klas gruntów</h1>
                        }
                        
                    </section>
                    <div className="bg-green-500 w-full h-2 rounded-2xl mt-3"></div>
                    <section className="flex gap-x-5 items-start justify-around">
                        <section className="flex flex-col items-center justify-center gap-y-3">
                            <h1 className="font-bold text-sm">suma ha. fizyczne</h1>
                            <h1 className="text-xl">{(obj.powierzchnie.reduce((acc, obj) =>acc + Number(obj.p_powierzchnia), 0)).toFixed(4)}ha</h1>
                            {obj.powierzchnia == (obj.powierzchnie.reduce((acc, obj) =>acc + Number(obj.p_powierzchnia), 0)).toFixed(4) ?
                            <h1 className="font-bold text-green-600 text-xl">Zgodność</h1>:<h1 className="font-bold text-red-600 text-xl">Brak zgodności</h1>}
                        </section>
                        <section className="flex flex-col items-center justify-center gap-y-3">
                            <h1 className="font-bold text-sm">suma ha. przeliczeniowe rolne</h1>
                            <h1 className="text-xl">{(obj.powierzchnie.filter((ele) => ele.podatek == "rolny").reduce((acc, obj) =>acc + Number(obj.p_powierzchnia) * obj.przelicznik, 0)).toFixed(4)}ha</h1>
                        </section>
                        <section className="flex flex-col items-center justify-center gap-y-3">
                            <h1 className="font-bold text-sm">suma podatek rolny</h1>
                            <h1 className="text-xl">{(obj.powierzchnie.filter((value) => value.podatek == "rolny").reduce((acc, ele) =>acc + (Number((Number(ele.p_powierzchnia) * ele.przelicznik).toFixed(4)) - ele.zwolniona_powierzchnia) * (obj.podatek_rolny || 0), 0)).toFixed(4)}zł</h1>
                        </section>
                        <section className="flex flex-col items-center justify-center gap-y-3">
                            <h1 className="font-bold text-sm">suma podatek leśny</h1>
                            <h1 className="text-xl">{(obj.powierzchnie.filter((value) => value.podatek == "leśny").reduce((acc, ele) =>acc + ((Number(ele.p_powierzchnia) - ele.zwolniona_powierzchnia) * (obj.podatek_lesny || 0)), 0)).toFixed(4)}zł</h1>
                        </section>
                    </section>
                    {
                        user.rola == "KSIEGOWOSC" &&
                        <section className="flex flex-col justify-center items-center">
                            <button className="base-btn text-xl" onClick={() => {
                                updateForm("insert_area")
                                updateID(obj.ID)
                            }}><FontAwesomeIcon icon={faPlus}/> Dodaj nową powierzchnie</button>
                        </section>
                    }
                </>
            }
            <section className="flex justify-around gap-x-5">
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">ID działki</p>
                    <p>{obj.numer_seryjny_dzialki || "BRAK"}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">Obręb</p>
                    <p>{obj.numer_seryjny_dzialki ? obj.numer_seryjny_dzialki.split(".")[1] : "BRAK"}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">Numer działki</p>
                    <p>{obj.nr_dzialki}</p>
                </section>
                <section className="flex flex-col items-center gap-y-3">
                    <p className="font-bold">Numer księgi wieczystej</p>
                    <p>{obj.nr_kw || "BRAK"}</p>
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
                            <p>{obj.mpzp || "BRAK"}</p>
                        </section>
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Plan ogólny</p>
                            <p>{obj.plan_ogolny || "BRAK"}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Przeznaczenie</p>
                            <p>{obj.przeznaczenie || "BRAK"}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Rodzaj</p>
                            <p>{obj.rodzaj || "BRAK"}</p>
                        </section>
                    </section>
                    <section className="flex justify-around gap-x-5">
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Dzierżawca</p>
                            <p>{obj.ID_dzierzawy ? `${obj.d_nazwisko} ${obj.d_imie}` : "BRAK"}</p>
                            {obj.ID_dzierzawy && <p>{obj.d_telefon}</p>}
                        </section>
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Właściciel</p>
                            <p>{obj.w_imie} {obj.w_nazwisko}</p>
                            <p>{obj.w_telefon}</p>
                        </section>
                        <section className="flex flex-col items-center gap-y-3">
                            <p className="font-bold">Data nabycia</p>
                            <p>{obj.data_nabycia ? new Date(obj.data_nabycia).toLocaleDateString() : "BRAK"}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Numer aktu nabycia</p>
                            <p>{obj.nr_aktu || "BRAK"}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Od kogo</p>
                            <p>{obj.sprzedawca || "BRAK"}</p>
                        </section>
                        <section className="flex flex-col items-center">
                            <p className="font-bold mb-3">Cena za ha</p>
                            <p>{obj.cena_zakupu ? `${obj.cena_zakupu}zł` : "BRAK"}</p>
                        </section>
                    </section>
                    <section className="flex justify-around gap-x-5">
                        <section className="flex flex-col items-center gap-y-3 px-10">
                            <p className="font-bold">Opis</p>
                            <p>{obj.opis || "BRAK"} </p>
                        </section>
                    </section>
                
                </>
            }
        </section>
    )
}