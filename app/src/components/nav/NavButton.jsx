import { useLocation, useNavigate } from "react-router-dom"


export default function NavButton({path = "", buttonContent}) {
    const location = useLocation();
    const navigate = useNavigate();
    return <button className={location.pathname == path ? `active-nav-btn` :`nav-btn`} onClick={() => navigate(path)}>{buttonContent}</button>
}