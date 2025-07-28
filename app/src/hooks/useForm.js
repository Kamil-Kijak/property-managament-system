import { useEffect, useState } from "react"

const useForm = (regexpObjects) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({})
    useEffect(() => {
        Object.keys(formData).forEach(ele => {
            if(formData[ele] == "") {
                delete formData[ele];
            }
            if(!regexpObjects[ele].regexp.test(formData[ele])) {
                setErrors(prev => ({...prev, [ele]:regexpObjects[ele].error}))
            } else {
                setErrors(prev => ({...prev, [ele]:null}))
            }
        })
    }, [formData])
    return [formData, errors, setFormData]
}
export {useForm}