import bcrypt from "bcryptjs";
const ibmdb = require('ibm_db');
let connStr = "DATABASE=BLUDB;HOSTNAME=9938aec0-8105-433e-8bf9-0fbb7e483086.c1ogj3sd0tgtu0lqde00.databases.appdomain.cloud;UID=nwr89433;PWD=HRyijOYyjRlpfd50;PORT=32459;PROTOCOL=TCPIP;SECURITY=SSL";

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        // check email is exist or not
        let isEmailExist = await checkExistEmail(data.email);
        if (isEmailExist) {
            reject(`This email "${data.email}" has already exist. Please choose an other email`);
        } else {
            // hash password
            let salt = bcrypt.genSaltSync(10);
            let pass = bcrypt.hashSync(data.password, salt);
            //create a new account
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;            
                conn.query('INSERT INTO nwr89433.users (fullname, email, password) values(?, ?, ?);', [data.fullname, data.email, pass], function(err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Create a new user successful");
                })
            });
        }
    });
};

let checkExistEmail = (email) => {
    return new Promise( (resolve, reject) => {
        try {
            ibmdb.open(connStr, function (err, conn) {
                if (err) throw err;
                conn.query('SELECT * FROM nwr89433.users where email=?', [email], function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    if (rows.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    createNewUser: createNewUser
};
