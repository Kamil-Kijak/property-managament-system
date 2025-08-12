
import { useMemo, useState } from "react"
import LocalizationData from "../../data/output.json"

const useLocalizations = () => {
    const [localizations, setLocalizations] = useState({
        town:"",
        commune:"",
        district:"",
        province:""
    })
    const availableLocalizations = useMemo(() => {
        return {
            provinces:Object.keys(LocalizationData).sort(),
            districts: localizations.province ? Object.keys(LocalizationData[localizations.province]).sort() : [],
            communes:localizations.province && localizations.district ? Object.keys(LocalizationData[localizations.province][localizations.district]).sort() : [],
            towns:localizations.province && localizations.district && localizations.commune ? LocalizationData[localizations.province][localizations.district][localizations.commune].sort() : []
        }
    }, [localizations])
    return [availableLocalizations, localizations, setLocalizations]
}
export {useLocalizations}