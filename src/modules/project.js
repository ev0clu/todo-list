const Project = (name) => {
    const getName = () => name;
    return { getName };
};

const projectArray = (() => {
    const projects = [];

    const getProjects = () => projects;
    const addProject = (name) => getProjects().push(name);

    // Only for developement
    const getProjectsName = () => getProjects().map((project) => project.getName());
    // -- end --

    const removeProject = (index) => getProjects().splice(index, 1);
    const isProjectExist = (newProjectName) =>
        getProjects().some((project) => project.getName() === newProjectName);

    return { getProjects, addProject, removeProject, isProjectExist, getProjectsName };
})();

export { Project, projectArray };
