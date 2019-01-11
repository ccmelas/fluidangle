module.exports = (sequelize, DataTypes) => {
  const BlacklistedToken = sequelize.define('BlacklistedToken', {
    token: DataTypes.STRING,
    expiry: DataTypes.INTEGER
  }, {});
  BlacklistedToken.associate = () => {
    // associations can be defined here
  };
  return BlacklistedToken;
};
