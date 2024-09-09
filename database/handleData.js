import {
    Server,
    User
} from './database.js';

const createUser = async (serverID, userID) => {
    try {
        let server = await Server.findOne({
            where: {
                serverID
            }
        });

        if (!server) {
            server = await Server.create({
                serverID
            });
        }

        const user = await User.create({
            userID,
            serverID
        });
        console.log(`User ${userID} created for server ${serverID}.`);
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
    }
};

const deleteUser = async (serverID, userID) => {
    try {
        const result = await User.destroy({
            where: {
                userID,
                serverID
            }
        });

        if (result > 0) {
            console.log(`User ${userID} deleted from server ${serverID}.`);
        } else {
            console.log(`User ${userID} not found in server ${serverID}.`);
        }
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};

const modifyUserMoney = async (serverID, userID, amountChange) => {
    try {
        const user = await User.findOne({
            where: {
                userID,
                serverID
            }
        });

        if (user) {
            let newAmount = user.money + amountChange;

            if (newAmount > user.maxMoney) {
                newAmount = user.maxMoney;
                console.log(`User ${userID}'s money capped at maxMoney: ${user.maxMoney}.`);
            }

            await setUserMoney(serverID, userID, newAmount);
            console.log(`User ${userID} money modified by ${amountChange}. New amount: ${newAmount} in server ${serverID}.`);
        } else {
            const initialAmount = amountChange;
            await setUserMoney(serverID, userID, initialAmount);
            console.log(`User ${userID} not found in server ${serverID}. Created user and set money to ${initialAmount}.`);
        }
    } catch (error) {
        console.error("Error modifying user money:", error);
    }
};

const setUserMoney = async (serverID, userID, amount) => {
    try {
        const [updated] = await User.update({
            money: amount
        }, {
            where: {
                userID,
                serverID
            }
        });

        if (updated) {
            console.log(`User ${userID} money updated to ${amount} in server ${serverID}.`);
        } else {
            const user = await createUser(serverID, userID);
            user.money = amount;
            await user.save();
            console.log(`User ${userID} not found in server ${serverID}. Created user and set money to ${amount}.`);
        }
    } catch (error) {
        console.error("Error updating user money:", error);
    }
};

const getUserMoney = async (serverID, userID) => {
    try {
        let user = await User.findOne({
            where: {
                userID,
                serverID
            }
        });

        if (user) {
            console.log(`User ${userID} has ${user.money} money in server ${serverID}.`);
            return user.money;
        } else {
            user = await createUser(serverID, userID);
            console.log(`User ${userID} not found in server ${serverID}. Created user with default money.`);
            return user.money;
        }
    } catch (error) {
        console.error("Error retrieving user money:", error);
    }
};

const setUserDailyTimestamp = async (serverID, userID, newTimestamp) => {
    try {
        const [updated] = await User.update({
            dailyTimestamp: newTimestamp
        }, {
            where: {
                userID,
                serverID
            }
        });

        if (updated) {
            console.log(`User ${userID} daily timestamp updated to ${newTimestamp} in server ${serverID}.`);
        } else {
            const user = await createUser(serverID, userID);
            user.dailyTimestamp = newTimestamp;
            await user.save();
            console.log(`User ${userID} not found in server ${serverID}. Created user and set daily timestamp to ${newTimestamp}.`);
        }
    } catch (error) {
        console.error("Error updating user daily timestamp:", error);
    }
};

const getUserDailyTimestamp = async (serverID, userID) => {
    try {
        let user = await User.findOne({
            where: {
                userID,
                serverID
            }
        });

        if (user) {
            console.log(`User ${userID} daily timestamp is ${user.dailyTimestamp} in server ${serverID}.`);
            return user.dailyTimestamp;
        } else {
            user = await createUser(serverID, userID);
            console.log(`User ${userID} not found in server ${serverID}. Created user with default daily timestamp.`);
            return user.dailyTimestamp;
        }
    } catch (error) {
        console.error("Error retrieving user daily timestamp:", error);
    }
};

const getRichestUsers = async (serverID) => {
    try {
        const users = await User.findAll({
            where: {
                serverID
            },
            order: [
                ['money', 'DESC']
            ],
            limit: 5
        });

        return users;
    } catch (error) {
        console.error("Error retrieving users:", error);
    }
}

const levelUpThreshold = (level) => {
    return level * 100;
};

const addXp = async (serverID, userID, xpToAdd) => {
    try {
        let user = await User.findOne({
            where: {
                userID,
                serverID
            }
        });

        if (!user) {
            user = await createUser(serverID, userID);
            console.log(`User ${userID} not found in server ${serverID}. Created new user.`);
        }

        user.xp += xpToAdd;

        const threshold = levelUpThreshold(user.level);
        if (user.xp >= threshold) {
            user.level += 1;
            user.xp = 0;
            user.maxMoney += 25;
            console.log(`User ${userID} leveled up to level ${user.level} with new maxMoney ${user.maxMoney}.`);
        }

        await user.save();
    } catch (error) {
        console.error("Error adding XP:", error);
    }
};

const getUserLevelAndXp = async (serverID, userID) => {
    try {
        let user = await User.findOne({
            where: {
                userID,
                serverID
            }
        });

        if (!user) {
            user = await createUser(serverID, userID);
            console.log(`User ${userID} not found in server ${serverID}. Created new user with default values.`);
        }

        return {
            level: user.level,
            xp: user.xp,
            maxMoney: user.maxMoney
        };
    } catch (error) {
        console.error("Error retrieving user level and XP:", error);
    }
};

export {
    createUser,
    deleteUser,
    modifyUserMoney,
    setUserMoney,
    getUserMoney,
    setUserDailyTimestamp,
    getUserDailyTimestamp,
    getRichestUsers,
    addXp,
    getUserLevelAndXp
};