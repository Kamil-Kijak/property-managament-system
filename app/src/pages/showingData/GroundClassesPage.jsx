import { useEffect} from "react";
import SearchBar from "../../components/SearchBar";
import {useWarningStore } from "../../hooks/stores/useScreensStore";
import { useState } from "react";
import SearchSelectInput from "../../components/inputs/SearchSelectInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import InsertGroundClass from "../../forms/insert/InsertGroundClass";
import { useForm } from "../../hooks/plain/useForm";
import { useGroundClassesStore } from "../../hooks/stores/useResultStores";
import { useApi } from "../../hooks/plain/useApi";
import { useFormStore } from "../../hooks/stores/useFormStore";
import BasePage from "../plain/BasePage";
import DisplaySection from "../sections/DisplaySection";
import EditGroundClass from "../../forms/edit/EditGroundClass";



export default function GroundClassesPage({}) {

    const warningUpdate = useWarningStore((state) => state.update)
    const {groundClasses, updateGroundClasses, updateID} = useGroundClassesStore();
    const updateForm = useFormStore((state) => state.updateForm);
    const form = useFormStore((state) => state.form);

    const API = useApi();

    const [taxDistrict, setTaxDistrict] = useState(1);
    
    const [editFormData, editErrors, setEditFormData] = useForm({
        "ground_class":{regexp:/^.{0,10}$/, error:"Za długi"},
        "converter":{regexp:/^\d{1}\.\d{2}$/, error:"Nie ma 2 cyfr po , lub za duża liczba"},
        "tax":{regexp:/.+/, error:"Wybierz rodzaj podatku"},
    });

    useEffect(() => {
        search()
    }, [taxDistrict]);

    const search = () => {
        const params = new URLSearchParams({
            tax_district:taxDistrict
        });
        API.getGroundClasses(params).then(result => {
            if(!result.error) {
                updateGroundClasses(result.data);
            }
        });
    }

    const requestDelete = (ID) => {
        warningUpdate(false);
        API.deleteGroundClass({ID_ground_class:ID}).then(result => {
            if(!result.error) {
                updateGroundClasses(groundClasses.filter((obj) => obj.ID != ID))
            }
        });
    }

    return (
        <BasePage requiredRoles={["KSIEGOWOSC"]}>
            <SearchBar
                onSearch={search}
                elements={
                    <>
                        <SearchSelectInput
                            title="okręg podatkowy"
                            placeholder=""
                            value={taxDistrict}
                            onChange={(e) => setTaxDistrict(e.target.value)}
                            options={
                                <>
                                    <option value="1">I</option>
                                    <option value="2">II</option>
                                    <option value="3">III</option>
                                    <option value="4">IV</option>
                                </>
                            }
                        />
                    </>
                }
            />
            <DisplaySection
                header={<h1 className="font-bold text-lg mt-5">Znalezione wyniki: {groundClasses.length}</h1>}
                list={groundClasses}
                template={(obj) =>
                    <section className="base-card my-5" key={obj.ID}>
                        <section className="flex gap-x-10 items-center">
                            <h1 className="text-4xl text-green-600 font-bold">{obj.klasa}</h1>
                            <section className="flex flex-col items-center justify-center">
                                <h1 className="font-bold text-xl">Przelicznik</h1>
                                <p className="mx-10 text-xl">{obj.przelicznik}</p>
                            </section>
                            <section className="flex flex-col items-center justify-center">
                                <h1 className="font-bold text-xl">Rodzaj podatku klasy</h1>
                                <p className="mx-10 text-xl">{obj.podatek}</p>
                            </section>
                            <section className="flex gap-x-3">
                                <button className="info-btn" onClick={() => {
                                    updateForm("edit")
                                    setEditFormData({
                                        ground_class:obj.klasa,
                                        converter:obj.przelicznik,
                                        tax:obj.podatek
                                    })
                                    updateID(obj.ID)
                                }}><FontAwesomeIcon icon={faPen}/> Edytuj</button>
                                <button className="warning-btn" onClick={() => 
                                    warningUpdate(true, "Uwaga", () => requestDelete(obj.ID), () => warningUpdate(false),
                                    <>
                                        <p className="text-red-600 font-bold">
                                            Usunięcie tej klasy gruntu spowoduje że wszystkie wyznaczone powierzchnie tej klasy zostaną usunięte
                                        </p>
                                        <p className="text-white font-bold text-lg mt-5">
                                            Czy napewno chcesz usunąć tą klase gruntu?
                                        </p>
                                    </>
                                )
                                }><FontAwesomeIcon icon={faTrashCan}/> Usuń</button>
                            </section>
                        </section>
                    </section>
                }
                footer={
                    <section className="flex flex-col gap-y-2 items-center my-10">
                        <button className="base-btn text-2xl" onClick={() => updateForm("insert")}><FontAwesomeIcon icon={faPlus}/> Dodaj nową klase gruntu</button>
                        <h1 className="text-2xl font-bold">Dla okręgu podatkowego nr {taxDistrict}</h1>
                    </section>
                    }
            />
            {
                form == "insert" &&
                <InsertGroundClass
                    search={search}
                    taxDistrict={taxDistrict}
                />
            }
            <EditGroundClass
                search={search}
                editFormData={editFormData}
                editErrors={editErrors}
                setEditFormData={setEditFormData}
            />
        </BasePage>
    )
}