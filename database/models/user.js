const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Compares plain text and hashed passwords
 * @param {string} password
 * @return {undefined} [Returns nothing]
 */
async function comparePassword(password) {
  const match = await bcrypt.compare(password, this.password);
  if (!match) {
    throw new Error('Invalid Login');
  }
}

/**
 * Returns JWT for a user
 * @return {object} [Returns tokens with expiration]
 */
function generateJWT() {
  return jwt.sign(
    { user_id: this.id },
    process.env.JWT_SECRET,
    { expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10) }
  );
}

/**
 * Strips off password
 * @return {object} [Returns User]
 */
function publicVersion() {
  this.password = undefined;
  return this;
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {});

  User.associate = () => {
    // associations can be defined here
  };

  User.beforeSave(async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);

      const hash = await bcrypt.hash(user.password, salt);

      user.password = hash;
    }
  });

  User.prototype.comparePassword = comparePassword;

  User.prototype.generateJWT = generateJWT;

  User.prototype.publicVersion = publicVersion;

  return User;
};
