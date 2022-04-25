import bcrypt from "bcryptjs";
const ibmdb = require('ibm_db');
let connStr = "DATABASE=BLUDB;HOSTNAME=9938aec0-8105-433e-8bf9-0fbb7e483086.c1ogj3sd0tgtu0lqde00.databases.appdomain.cloud;UID=nwr89433;PWD=HRyijOYyjRlpfd50;PORT=32459;PROTOCOL=TCPIP;SECURITY=SSL";

let handleLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        //check email is exist or not
        let user = await findUserByEmail(email);
        if (user) {
            //compare password
            await bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    resolve(true);
                } else {
                    reject(`The password that you've entered is incorrect`);
                }
            });
        } else {
            reject(`This user email "${email}" doesn't exist`);
        }
    });
};

let findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query("SELECT * FROM nwr89433.users WHERE email=?;", [email], function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let findUserById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query('SELECT * FROM nwr89433.users WHERE id=?;', [id], function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

let comparePassword = (password, user) => {
    return new Promise(async (resolve, reject) => {
        try {
            const jsonData = JSON.stringify(user)
            const jsonParse = JSON.parse(jsonData)
            const dbPaswordNospace = jsonParse.PASSWORD.replace(/\s/g, '')
            await bcrypt.compare(password, dbPaswordNospace).then((isMatch) => {
                if (isMatch) {
                    resolve(true);
                } else {
                    resolve(`The password that you've entered is incorrect`);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleLogin: handleLogin,
    findUserByEmail: findUserByEmail,
    findUserById: findUserById,
    comparePassword: comparePassword
};