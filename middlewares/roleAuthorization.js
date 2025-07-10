
const roleAuthorization = (requiredRoles) => {
    return (req, res, next) => {
        if(req.user) {
            if(requiredRoles.includes(req.user.rola)) {
                next();
            } else {
                res.status(403).json({error:"Zasób zablokowany dla tej roli", forbidden:true})
            }
        } else {
            res.status(403).json({error:"Nie dokonano autoryzacji wstępnej", requestRelogin:true})
        }
    }
}
module.exports = roleAuthorization;