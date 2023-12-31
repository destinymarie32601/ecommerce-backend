const { Model, DataTypes } = require('sequelize'); //import necessary modules

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(      //define product tag columns
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'product'
      }
    },
    tag_id: {
      type:DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'tag'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
