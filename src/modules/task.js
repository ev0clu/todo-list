const Task = (name, description, dueDate, priority) => {
    const getName = () => name;
    const getDescription = () => description;
    const getDueDate = () => dueDate;
    const getPriority = () => priority;
    return { getName, getDescription, getDueDate, getPriority };
};

const taskArray = (() => {
    const tasks = [];

    const getTasks = () => tasks;
    const addTask = (name) => getTasks().push(name);

    // Only for developement
    const getTasksName = () => getTasks().map((task) => task.getName());
    const getTasksDescription = () => getTasks().map((task) => task.getDescription());
    const getTasksDueDate = () => getTasks().map((task) => task.getDueDate());
    const getTasksPriority = () => getTasks().map((task) => task.getPriority());
    // -- end --

    const removeTask = (index) => getTasks().splice(index, 1);
    const isTaskExist = (newTaskName) => getTasks().some((task) => task.getName() === newTaskName);

    return { getTasks, addTask, removeTask, isTaskExist, getTasksName };
})();

export { Task, taskArray };
