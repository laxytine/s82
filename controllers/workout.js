const Workout = require("../models/Workout");
const { errorHandler } = require('../auth.js');



module.exports.addWorkout = (req,res) => {

	let newWorkout = new Workout({
		userId : req.user.id,
		name : req.body.name,
		duration : req.body.duration
	});

	newWorkout.save()
	.then(savedWorkout => res.status(201).send(savedWorkout))
	.catch(saveErr => {

		console.error("Error in saving the workout: ", saveErr)
		return res.status(500).send({ error: 'Failed to save the workout' });
	})

};

module.exports.getMyWorkouts = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log("Fetching workouts for userId:", userId);

        const workouts = await Workout.find({ userId });

        if (!workouts.length) {
            return res.status(404).send({ message: 'No workouts found for this user' });
        }
        res.status(200).send({ workouts });
    } catch (error) {
        console.error("Error in fetching the workouts:", error);
        res.status(500).send({ error: 'Failed to fetch workouts' });
    }
};




module.exports.updateWorkout = async (req, res) => {
    try {
        const userId = req.user.id;
        const workoutId = req.params.id;
        
        const workout = await Workout.findOne({ _id: workoutId, userId });
        if (!workout) {
            return res.status(404).send({ error: 'Workout not found or not authorized to update' });
        }

        const workoutUpdates = {
            name: req.body.name,
            duration: req.body.duration
        };

        if (workout.name === workoutUpdates.name && workout.duration === workoutUpdates.duration) {
            return res.status(400).send({ message: 'The workout is already updated' });
        }

        const updatedWorkout = await Workout.findByIdAndUpdate(workoutId, workoutUpdates, { new: true });

        return res.status(200).send({ 
            message: 'Workout updated successfully', 
            updatedWorkout 
        });
    } catch (error) {
        console.error("Error in updating a workout:", error);
        return res.status(500).send({ error: 'Error in updating a workout.' });
    }
};


module.exports.deleteWorkout = (req, res) => {

    return Workout.deleteOne({ _id: req.params.id})
    .then(deletedResult => {

        if (deletedResult < 1) {

            return res.status(400).send({ error: 'No workout deleted' });

        }

        return res.status(200).send({ 
        	message: 'Workout deleted successfully'
        });

    })
    .catch(err => {
		console.error("Error in deleting a workout : ", err)
		return res.status(500).send({ error: 'Error in deleting a workout.' });
	});
};



module.exports.completedWorkoutStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const workoutId = req.params.id;

        const workout = await Workout.findOne({ _id: workoutId, userId });
        if (!workout) {
            return res.status(404).send({ error: 'Workout not found or not authorized to update' });
        }

        if (workout.status === req.body.status) {
            return res.status(400).send({ message: 'The status is already updated' });
        }

        workout.status = req.body.status;
        const updatedWorkout = await workout.save();

        return res.status(200).send({
            message: 'Workout status updated successfully',
            updatedWorkout
        });
    } catch (error) {
        console.error("Error in updating the workout:", error);
        return res.status(500).send({ error: 'Error in updating the workout.' });
    }
};

