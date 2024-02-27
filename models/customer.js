const Joi = require('joi')
const sequelize = require('../dbConfig')
const { DataTypes } = require('sequelize')

const Customer = sequelize.define('Customer', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 50]
    }
  },
  isGold: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 50]
    }
  }
}, {
  tableName: "customers"
});

async function syncCustomer() {
  await Customer.sync();
};

syncCustomer()

function validateCustomer(customer) {

  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(5).max(50).required().pattern(/^(\+\d{1,2}\s?)?(\(\d{1,4}\))?[0-9\-s]{7,}$/),
    isGold: Joi.boolean()
  })

  return schema.validate(customer)
}

module.exports.validate = validateCustomer
module.exports.Customer = Customer