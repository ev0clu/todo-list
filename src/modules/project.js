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
    const getTasksName = () => getTasks().map((task) => task.name);

    const setTaskName = (i, newName) => {
        getTasks()[i].name = newName;
        return getTasks()[i].name;
    };
    const setTaskDescription = (i, newDescription) => {
        getTasks()[i].description = newDescription;
        return getTasks()[i].description;
    };
    const seTaskDueDate = (i, newDueDate) => {
        getTasks()[i].dueDate = newDueDate;
        return getTasks()[i].dueDate;
    };
    const setTaskPriority = (i, newPriority) => {
        getTasks()[i].priority = newPriority;
        return getTasks()[i].priority;
    };

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
        getTasksName,
        setTaskName,
        setTaskDescription,
        seTaskDueDate,
        setTaskPriority,
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

    return { getProjects, addProject, removeProject, isProjectExist };
})();

export { Project, projectArray };
