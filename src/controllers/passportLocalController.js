import passportLocal from "passport-local";
import passport from "passport";
import loginService from "../services/loginService";

let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                await loginService.findUserByEmail(email).then(async (user) => {
                    if (!user) {
                        return done(null, false, req.flash("errors", `This user email "${email}" doesn't exist`));
                    }
                    if (user) {
                        let match = await loginService.comparePassword(password, user);
                        if (match === true) {
                            return done(null, user, null)
                        } else {
                            return done(null, false, req.flash("errors", match)
                            )
                        }
                    }
                });
            } catch (err) {
                console.log(err);
                return done(null, false, { message: err });
            }
        }));

};

passport.serializeUser((user, done) => {
    done(null, user);
});


passport.deserializeUser((user, done) => {
    const jsonData = JSON.stringify(user)
    const jsonParse = JSON.parse(jsonData)
    loginService.findUserById(jsonParse.ID).then((user) => {
        const jsonData1 = JSON.stringify(user)
        const jsonParse1 = JSON.parse(jsonData1)
        const dbfullnameNospace = jsonParse1.FULLNAME.replace(/\s/g, '')
        return done(null, dbfullnameNospace);
    }).catch(error => {
        return done(error, null)
    });
});

module.exports = initPassportLocal;