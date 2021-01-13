module.exports = {
    //estos métodos son creados por ti
    isLoggedIn(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/food_app')
    },
    isNotLoggedIn(req, res, next) {
        if(!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/choose-role');
    }
}