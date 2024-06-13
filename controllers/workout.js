const Workout = require("../models/Workout");


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


module.exports.getAllWorkouts = (req, res) => {
    const userId = req.user._id;

    Workout.find({ user: userId })
        .then(workouts => {
            if (workouts.length > 0) {
                return res.status(200).send(workouts);
            } else {
                return res.status(200).send({ message: 'No workouts found for this user.' });
            }
        })
        .catch(err => res.status(500).send({ error: 'Error finding workouts.' }));
};


module.exports.getWorkoutById = (req, res) => {

	Workout.findById(req.params.id)
	.then(foundWorkout => {
		if (!foundWorkout) {
			return res.status(404).send({ error: 'Workout not found' });
		}
		return res.status(200).send({ foundWorkout });
	})
	.catch(err => {
		console.error("Error in fetching the workout: ", err)
		return res.status(500).send({ error: 'Failed to fetch workout' });
	});

};


module.exports.updateWorkout = (req, res) => {

	let workoutUpdates = {
        name: req.body.name,
        duaration: req.body.duration,
    }

    return Workout.findByIdAndUpdate(req.params.id, workoutUpdates)
    .then(updatedWorkout => {

        if (!updatedWorkout) {

            return res.status(404).send({ error: 'Workout not found' });

        }

        return res.status(200).send({ 
        	message: 'Workout updated successfully', 
        	updatedWorkout: updatedWorkout 
        });

    })
    .catch(err => {
		console.error("Error in updating a workout : ", err)
		return res.status(500).send({ error: 'Error in updating a workout.' });
	});
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


module.exports.completedWorkoutStatus = (req, res) => {
    let workoutStatus = {
        status: req.body.status
    };

    return Workout.findByIdAndUpdate(req.params.id, workoutStatus, { new: true })
        .then(updatedWorkout => {
            if (!updatedWorkout) {
                return res.status(404).send({ error: 'Workout not found' });
            }

            if (workoutStatus.status === req.body.status) {
            return res.status(400).send({ message: 'The status is already the same' });
        	}

            return res.status(200).send({
                message: 'Workout status updated successfully',
                updatedWorkout: updatedWorkout
            });
        })
        .catch(err => {
            console.error("Error in updating the workout: ", err);
            return res.status(500).send({ error: 'Error in updating the workout.' });
        });
};
