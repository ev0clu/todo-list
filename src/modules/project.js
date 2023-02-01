const Project = (name) => {
    const tasks = [];

    const getProjectName = () => name;
    const getTasks = () => tasks;
    const addTask = (task) => tasks.push(task);
    const getTaskName = (i) => tasks[i].getName();
    const getTaskDescription = (i) => tasks[i].getDescription();
    const getTaskDueDate = (i) => tasks[i].getDueDate();
    const getTaskPriority = (i) => tasks[i].getPriority();

    return {
        getProjectName,
        getTasks,
        addTask,
        getTaskName,
        getTaskDescription,
        getTaskDueDate,
        getTaskPriority
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
    const isProjectExist = (newProjectName) => {
        getProjects().some((project) => project.getProjectName() === newProjectName);
    };

    return { getProjects, addProject, removeProject, isProjectExist, getProjectsName };
})();

export { Project, projectArray };
