import {
    User
} from './database.js';

const createUser = async (userID) => {
    try {
        const user = await User.create({
            userID
        });

        console.log(`User ${userID} created.`);
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
    }
};

const deleteUser = async (userID) => {
    try {
        const result = await User.destroy({
            where: {
                userID
            }
        });

        if (result > 0) {
            console.log(`User ${userID} deleted.`);
        } else {
            createUser(userID);
            console.log(`User ${userID} not found. Attempting to create one.`);
        }
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};

const setUserMoney = async (userID, newAmount) => {
    try {
        const [updated] = await User.update({
            money: newAmount
        }, {
            where: {
                userID
            }
        });

        if (updated) {
            console.log(`User ${userID} money updated to ${newAmount}.`);
        } else {
            createUser(userID);
            console.log(`User ${userID} not found. Attempting to create one.`);
        }
    } catch (error) {
        console.error("Error updating user money:", error);
    }
};

const getUserMoney = async (userID) => {
    try {
        let user = await User.findOne({
            where: {
                userID
            }
        });

        if (user) {
            console.log(`User ${userID} has ${user.money} money.`);
            return user.money;
        } else {
            user = await createUser(userID);
            console.log(`User ${userID} not found. Attempting to create one.`);
            return user.money;
        }
    } catch (error) {
        console.error("Error retrieving user money:", error);
    }
};

const setUserDailyTimestamp = async (userID, newTimestamp) => {
    try {
        const [updated] = await User.update({
            dailyTimestamp: newTimestamp
        }, {
            where: {
                userID
            }
        });

        if (updated) {
            console.log(`User ${userID} daily timestamp updated to ${newTimestamp}.`);
        } else {
            console.log(`User ${userID} not found. Attempting to create one.`);
        }
    } catch (error) {
        console.error("Error updating user daily timestamp:", error);
    }
};

const getUserDailyTimestamp = async (userID) => {
    try {
        let user = await User.findOne({
            where: {
                userID
            }
        });

        if (user) {
            console.log(`User ${userID} daily timestamp is ${user.dailyTimestamp}.`);
            return user.dailyTimestamp;
        } else {
            user = await createUser(userID);
            console.log(`User ${userID} not found. Attempting to create one.`);
            return user.dailyTimestamp;
        }
    } catch (error) {
        console.error("Error retrieving user daily timestamp:", error);
    }
};

export {
    createUser,
    deleteUser,
    setUserMoney,
    getUserMoney,
    setUserDailyTimestamp,
    getUserDailyTimestamp
}