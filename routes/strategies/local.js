const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const User = require("../../models/user");
const bcrypt = require("bcrypt");

const localStrategy = () => {
	passport.use(
		"local",
		new Strategy(
			{ usernameField: "name" },
			async (name, password, done) => {
				try {
					if (!name || !password) {
						return done(null, null, {
							message: "Enter Username and Password",
						});
					}
					const tempUser = await User.findOne({ name });
					if (!tempUser) {
						return done(null, null, { message: "No such user found" });
					}
					const isValid = await bcrypt.compare(
						password,
						tempUser.password
					);
					if (!isValid) {
						return done(null, null, { message: "Password Incorrect" });
					} else {
						return done(null, tempUser, {
							message: "Successfully Logged In",
						});
					}
				} catch (error) {
					return done(error, null, { message: error });
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const tempUser = User.findById(id);
			if (!tempUser) {
				done(null, null, { message: "No such user found" });
			} else {
				done(null, tempUser);
			}
		} catch (error) {
			done(err, null);
		}
	});
};

module.exports = localStrategy;
