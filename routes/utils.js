const isAuthenticated = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		req.flash("info", "You must be logged in to access this page.");
		res.redirect("/users/login");
	}
};

const isNotAuthenticated = (req, res, next) => {
	if (req.user) {
		res.redirect("/");
	} else {
		next();
	}
};

module.exports = {
	isAuthenticated,
	isNotAuthenticated,
};
