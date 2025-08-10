import { useEffect, useState } from "react"

const useForm = (regexpObjects) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData(Object.fromEntries(Object.keys(regexpObjects).filter((value) => regexpObjects[value].optional).map(value => [[value], ""])));
    }, []);

    useEffect(() => {
        Object.keys(formData).forEach(ele => {
            console.log(formData);
            if(!regexpObjects[ele].regexp.test(formData[ele])) {
                setErrors(prev => ({...prev, [ele]:regexpObjects[ele].error}))
            } else {
                setErrors(prev => ({...prev, [ele]:null}))
            }
            if(formData[ele] == "" && !regexpObjects[ele].optional) {
                delete formData[ele];
            }
        })
    }, [formData])
    return [formData, errors, setFormData]
}
export {useForm}