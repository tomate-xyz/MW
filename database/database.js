import {
    Sequelize,
    DataTypes
} from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/database.sqlite'
});

const Server = sequelize.define('Server', {
    serverID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    }
})

const User = sequelize.define('User', {
    userID: {
        type: DataTypes.STRING,
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
        defaultValue: Date.now() - (24 * 60 * 60 * 1000)
    }
});

Server.hasMany(User, {
    foreignKey: 'serverID'
});
User.belongsTo(Server, {
    foreignKey: 'serverID'
})

sequelize.sync().then(() => {
    console.log("Database & tables created!");
});

export {
    Server,
    User
};