import {
    Sequelize,
    DataTypes
} from 'sequelize';

const oneDay = 24 * 60 * 60 * 1000;
const yesterday = Date.now() - oneDay;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/database.sqlite'
});

const User = sequelize.define('User', {
    userID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    money: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
    },
    dailyTimestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: yesterday
    }
});

sequelize.sync().then(() => {
    console.log("Database & tables created!");
});

export {
    User
};