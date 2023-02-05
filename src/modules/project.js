const Project = (name) => {
    const tasks = [];

    const getProjectName = () => name;
    const getTasks = () => tasks;
    const addTask = (task) => getTasks().push(task);
    const getTaskName = (i) => getTasks()[i].name;
    const getTaskDescription = (i) => getTasks()[i].description;
    const getTaskDueDate = (i) => getTasks()[i].dueDate;
    const getTaskPriority = (i) => getTasks()[i].priority;
    const getTaskStatus = (i) => getTasks()[i].status;

    const removeTask = (index) => getTasks().splice(index, 1);
    const isTaskExist = (newTask) => getTasks().some((task) => task.name === newTask);

    const toggleTaskStatus = (i, newStatus) => {
        const taskIndex = getTasks()[i];
        taskIndex.status = newStatus;
    };

    return {
        getProjectName,
        getTasks,
        addTask,
        getTaskName,
        getTaskDescription,
        getTaskDueDate,
        getTaskPriority,
        getTaskStatus,
        removeTask,
        isTaskExist,
        toggleTaskStatus
    };
};

const projectArray = (() => {
    const projects = [];

    const getProjects = () => projects;
    const addProject = (project) => getProjects().push(project);

    // Only for developement
    const getProjectsName = () => getProjects().map((project) => project.getProjectName());
    // -- end --

    const removeProject = (index) => getProjects().splice(index, 1);
    const isProjectExist = (newProjectName) =>
        getProjects().some((project) => project.getProjectName() === newProjectName);

    return { getProjects, addProject, removeProject, isProjectExist, getProjectsName };
})();

export { Project, projectArray };
