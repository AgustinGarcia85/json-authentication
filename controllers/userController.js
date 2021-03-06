const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jws = require("jsonwebtoken");

module.exports = {
  signUp: params => {
    return new Promise((resolve, reject) => {
      User.findOne({ email: params.email })
        .then(user => {
          if (user) {
            let errors = {};
            errors.message = "Email already Exisit!";
            erros.status = 400;
            return reject(errors);
          } else {
            const newUser = new User({
              username: params.username,
              email: params.email,
              password: params.password
            });

            bcrypt.genSalt(10, (err, salt) => {
              if (err) {
                reject(err);
              }

              bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
                if (err) {
                  reject(err);
                } else {
                  newUser.password = hashedPassword;

                  newUser
                    .save()
                    .then(user => resolve(user))
                    .catch(err => reject(err));
                }
              });
            });
          }
        })

        .catch(err => {
          console.log(err);
        });

      // let errors = {};
      // errors.email = "Email already Exisit!";
      // erros.status = 400;
      // return reject(errors);
    }).catch(err => {
      console.log(err);
    });
  }
};
