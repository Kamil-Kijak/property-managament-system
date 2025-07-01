
const roleAuthorization = (requiredRoles) => {
    return (req, res, next) => {
        if(req.user) {
            if(requiredRoles.include(req.user.rola)) {
                next();
            } else {
                res.status(403).json({error:"Zasób zablokowany dla tej roli"})
            }
        } else {
            res.status(403).json({error:"Nie dokonano autoryzacji wstępnej"})
        }
    }
}
module.exports = roleAuthorization;