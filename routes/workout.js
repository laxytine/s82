const express = require("express");
const workoutController = require("../controllers/workout");

const {verify} = require("../auth");

const router = express.Router();

router.post("/", verify, workoutController.addWorkout);
router.get("/", verify, workoutController.getAllWorkouts);
router.get("/:id", verify, workoutController.getWorkoutById);
router.put("/:id", verify, workoutController.updateWorkout);
router.delete("/:id", verify, workoutController.deleteWorkout);
router.patch("/completedWorkoutStatus/:id", verify, workoutController.completedWorkoutStatus);


module.exports = router;