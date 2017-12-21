const Task = require('../models/Task');

module.exports = {
	index: (req, res) => {

	    let tasksPromises = [
	        Task.find({status: "Open"}).limit(10),
            Task.find({status: "In Progress"}).limit(10),
            Task.find({status: "Finished"}).limit(10)

        ];

	    Promise.all(tasksPromises).then(taskResults => {

                    res.render('task/index', {
                    	'openTasks': taskResults[0].sort(function (a,b) {
                                return a- b;
                            }

                        ) ,
                	'inProgressTasks': taskResults[1],
                	'finishedTasks': taskResults[2],

                    });
                }).catch(err => {
                    return "error";
        });


        // Task.find().limit(6).then(tasks => {
        //
        //     res.render('task/index', {
        //     	'openTasks': tasks.filter(t => t.status === "Open"),
			// 	'inProgressTasks': tasks.filter(t => t.status === "In Progress"),
			// 	'finishedTasks': tasks.filter(t => t.status === "Finished"),
        //
        //     });
        // });

	},
	createGet: (req, res) => {
        res.render('task/create');
	},
	createPost: (req, res) => {
        let task = req.body;
        Task.create(task).then(task => {
            res.redirect("/");
        }).catch(err => {
            task.error = 'Cannot create task.';
            res.render('task/create', task);
        });
	},
	editGet: (req, res) => {
        let taskId = req.params.id;
        Task.findById(taskId).then(task => {
            if (task) {
                res.render('task/edit', task );
            }
            else {
                res.redirect('/');
            }
        }).catch(err => res.redirect('/'));

	},
	editPost: (req, res) => {
        let taskId = req.params.id;
        let task = req.body;

        Task.findByIdAndUpdate(taskId, task, {runValidators: true}).then(tasks => {
            res.redirect("/");
        }).catch(err => {
            task.id = taskId;
            task.error = "Cannot edit task.";
            return res.render("task/edit", task);
        });
	}
};