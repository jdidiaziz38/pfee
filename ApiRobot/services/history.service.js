const ResponseStatus = require("../enum/ResponseStatus");
const MsgReponseStatus = require("../models/Response/MessageResponse");
const Robot = require("../models/entity/Robot");
const History = require('../models/entity/History'); 


getAllHistory = async () => {
return  await History.aggregate([
    {
        $lookup: {
          from: 'robots',
          localField: 'robotId',
          foreignField: '_id',
          as: 'robot'
        }
      },
      {
        $unwind: {
          path: '$robot',
          preserveNullAndEmptyArrays: true
        }
      },   
      {
        $project: {
          "timestamp": 1,
          "piecesPalatize": 1,
          "robot":
          {
            "_id": 1,
            "reference_robot": 1,
            "ip_robot": 1,
            "nombre_pieces": 1
          }
        }
      }
]);
};


addHistory = async (dataRobot) => {
    const existingRobot = await Robot.findOne({ reference_robot: dataRobot.reference_robot });
    if (!existingRobot) {
        return MsgReponseStatus.builder()
            .setTitle("Error Message")
            .setDatestamp(new Date())
            .setStatus(ResponseStatus.ERROR)
            .setMessage("cannot find existing robot")
            .build();
    }
    const history = new History({
        robotId: existingRobot._id,
        piecesPalatize: dataRobot.nombre_pieces,
        timestamp: dataRobot.timestamp
    });
    const newHistory = await history.save();
    return MsgReponseStatus.builder()
        .setTitle("Success Message")
        .setDatestamp(new Date())
        .setStatus(ResponseStatus.SUCCESSFUL)
        .setMessage("successfully created history ")
        .build();
};

deleteManyHistory = async (robotId) => {
    result =  await History.deleteMany({ robotId: robotId });
   if (result.deletedCount > 0) {
    return MsgReponseStatus.builder()
    .setTitle("Success Message")
    .setDatestamp(new Date())
    .setStatus(ResponseStatus.ERROR)
    .setMessage("successfully deleted history by robotId")
    .build();
   }
   return MsgReponseStatus.builder()
   .setTitle("Error Message")
   .setDatestamp(new Date())
   .setStatus(ResponseStatus.SUCCESSFUL)
   .setMessage("cannot delete Many History")
   .build();
};
module.exports = { historyService :{ insert : addHistory , selectAll: getAllHistory , deleteMany : deleteManyHistory} };