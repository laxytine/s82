const express = require("express");
const workoutController = require("../controllers/workout");

const {verify} = require("../auth");

const router = express.Router();

router.post("/addWorkout", verify, workoutController.addWorkout);
router.get("/getMyWorkouts", verify, workoutController.getMyWorkouts);
router.put("/updateWorkout/:id", verify, workoutController.updateWorkout);
router.delete("/deleteWorkout/:id", verify, workoutController.deleteWorkout);
router.patch("/completedWorkoutStatus/:id", verify, workoutController.completedWorkoutStatus);


module.exports = router;