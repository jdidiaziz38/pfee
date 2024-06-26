const Robot = require("../models/entity/Robot");

const startHour = 8;  // 08:00 AM
const endHour = 17;  // 17 05:00 PM

const logMessage = async () => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= startHour && currentHour < endHour) {
        try {
        const robots = await Robot.find();
        const updatedRobots = await Promise.all(robots.map(async (robot) => {
            robot.nombre_pieces = (robot.nombre_pieces || 0) + 1;
            return await robot.save();
        }));
    } catch (error) {
        console.error("Error updating robots:", error);
    }
    }
};

 
setInterval(logMessage, 10000);//10000ms
