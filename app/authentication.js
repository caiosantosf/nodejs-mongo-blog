const user = process.env.USER_ADMIN;
const password = process.env.PASSWORD_ADMIN;

exports.login = function(req, res, callback) {
    if (!req.body.user) {
        if (req.cookies.user == user && req.cookies.password == password)
            callback(res);   
        else
            res.render('admin/login', {'erro': ''});
    } else {
        if (req.body.user == user && req.body.password == password) {
            res.cookie('user', user);
            res.cookie('password', password);
            callback(res);
        } else {
            res.redirect('/admin/not_found');
        }
    }
}