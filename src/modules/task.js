const Task = (title, details, date, prio, isDone = false) => {
    let name = title;
    let description = details;
    let dueDate = date;
    let priority = prio;
    let status = isDone;

    return {
        get name() {
            return name;
        },
        set name(newName) {
            name = newName;
        },
        get description() {
            return description;
        },
        set description(newDescription) {
            description = newDescription;
        },
        get dueDate() {
            return dueDate;
        },
        set dueDate(newDueDate) {
            dueDate = newDueDate;
        },
        get priority() {
            return priority;
        },
        set priority(newPriority) {
            priority = newPriority;
        },
        get status() {
            return status;
        },
        set status(newStatus) {
            status = newStatus;
        }
    };
};

export default Task;
