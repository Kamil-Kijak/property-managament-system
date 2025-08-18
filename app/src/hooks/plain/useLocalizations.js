
import { useEffect, useMemo, useState } from "react"
import LocalizationData from "../../data/output.json"
import { useApi } from "./useApi";

const useLocalizations = () => {
    const API = useApi();
    const [matchedTowns, setMatchedTowns] = useState([]);
    const [localizations, setLocalizations] = useState({
        town:"",
        commune:"",
        district:"",
        province:""
    });
    
    useEffect(() => {
        if(localizations.town.length > 0) {
            const searchParams = new URLSearchParams({
                town:localizations.town
            })
            API.getTowns(searchParams).then(result => {
                if(!result.error) {
                    setMatchedTowns(result.data);
                }
            })
        } else {
            setMatchedTowns([]);
        }
    }, [localizations.town]);

    const availableLocalizations = useMemo(() => {
        return {
            provinces:Object.keys(LocalizationData).sort(),
            districts: localizations.province ? Object.keys(LocalizationData[localizations.province]).sort() : [],
            communes:localizations.province && localizations.district ? LocalizationData[localizations.province][localizations.district].sort() : [],
        }
    }, [localizations])
    return [availableLocalizations, localizations, setLocalizations, matchedTowns]
}
export {useLocalizations}