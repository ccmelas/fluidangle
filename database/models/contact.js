module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(60),
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(15),
    },
    starred: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, { underscored: true });
  Contact.associate = (models) => {
    // associations can be defined here
    Contact.belongsTo(models.User);
  };
  return Contact;
};
