import { format, isWithinInterval } from 'date-fns';
import ui from './ui';
import { Project, projectArray } from './project';
import Task from './task';

const controller = (() => {
    /*const isNextWeek = (newDate) => {
        const curr = new Date(); // get current date
        const first = curr.getDate() + 7 - curr.getDay(); // First day is the day of the month - the day of the week
        const last = first + 7; // last day is the first day + 6

        const firstDay = format(new Date(curr.setDate(first + 1)), 'yyyy-MM-dd');
        const lastDay = format(new Date(curr.setDate(last) + 1), 'yyyy-MM-dd');

        const result = isWithinInterval(newDate, {
            start: firstDay,
            end: lastDay
        });

        return result;
    };*/

    const toggleNavBar = () => {
        const navBar = document.getElementById('nav-bar');
        const navToggleButton = document.querySelector('.nav-toggle');
        if (navBar.classList.contains('active')) {
            navBar.classList.remove('active');
            navBar.style.width = '0';
            navBar.style.left = '-3rem';
            navToggleButton.textContent = 'menu';
        } else {
            navBar.classList.add('active');
            navBar.style.width = '20rem';
            navBar.style.left = '0';
            navToggleButton.textContent = 'close';
        }
    };

    const isWeek = (newDate) => {
        let result = false;

        const curr = new Date(); // get current date
        const first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
        const last = first + 6; // last day is the first day + 6

        const firstDay = format(new Date(curr.setDate(first)), 'yyyy-MM-dd');
        const lastDay = format(new Date(curr.setDate(last)), 'yyyy-MM-dd');

        if (newDate >= firstDay && newDate <= lastDay) {
            result = true;
        }

        return result;
    };

    const toggleNodeState = () => {
        const header = document.querySelector('header');
        const main = document.querySelector('main');
        const footer = document.querySelector('footer');

        header.classList.toggle('inactive');
        main.classList.toggle('inactive');
        footer.classList.toggle('inactive');
    };

    // Task controller
    const getTaskPriorityRadioButton = (taskPriorityList, taskPriority) => {
        let radioButton = '';
        for (let i = 0; i < taskPriorityList.length; i++) {
            if (taskPriorityList[i].id.indexOf(taskPriority) !== -1) {
                radioButton = taskPriorityList[i];
                break;
            }
        }
        return radioButton;
    };

    const getTaskPriority = (taskPriorityList) => {
        let priority = '';
        for (let i = 0; i < taskPriorityList.length; i++) {
            if (taskPriorityList[i].checked) {
                switch (taskPriorityList[i].id) {
                    case 'task-priority-low':
                        priority = 'low';
                        break;
                    case 'task-priority-medium':
                        priority = 'medium';
                        break;
                    case 'task-priority-high':
                        priority = 'high';
                        break;
                    default:
                        break;
                }
                break;
            }
        }
        return priority;
    };

    const toggleCheckboxLabelState = (id, isChecked) => {
        const label = document.querySelector(`label[for="${id}"]`);

        if (isChecked) {
            label.classList.add('task-done');
        } else {
            label.classList.remove('task-done');
        }
    };

    const addNewTask = (project, title, description, dueDate, priority) => {
        const newTask = Task(title, description, dueDate, priority);
        project.addTask(newTask);
    };

    const replaceTask = (
        project,
        taskIndex,
        newName,
        newDescription,
        newDueDate,
        newPriority,
        eventTarget
    ) => {
        const navInbox = document.getElementById('nav-inbox');
        const navToday = document.getElementById('nav-today');
        const navWeek = document.getElementById('nav-week');
        const navItem = document.querySelectorAll('.nav-item');

        const todayDate = format(new Date(), 'yyyy-MM-dd');
        //const newDate = format(new Date(newDueDate), 'dd-MM-yyyy');

        project.setTaskName(taskIndex, newName);
        project.setTaskDescription(taskIndex, newDescription);
        project.seTaskDueDate(taskIndex, newDueDate);
        project.setTaskPriority(taskIndex, newPriority);

        if (navToday.classList.contains('item-selected')) {
            if (todayDate !== newDueDate) {
                eventTarget.remove();
            } else {
                ui.replaceTaskItem(eventTarget, newName, newDueDate, newPriority);
            }
        } else if (navWeek.classList.contains('item-selected')) {
            if (!isWeek(newDueDate)) {
                eventTarget.remove();
            } else {
                ui.replaceTaskItem(eventTarget, newName, newDueDate, newPriority);
            }
        } else {
            ui.replaceTaskItem(eventTarget, newName, newDueDate, newPriority);
        }
    };

    const removeTaskModal = () => {
        const taskModalContainer = document.getElementById('task-modal-container');
        taskModalContainer.textContent = '';
    };

    const updateTaskList = (projects, projectIndex, selectedItem) => {
        const taskField = document.getElementById('task-field');

        if (selectedItem === 'project-item') {
            taskField.textContent = '';
        }

        if (selectedItem === 'project-item' || selectedItem === 'nav-inbox') {
            for (let i = 0; i < projects[projectIndex].getTasks().length; i++) {
                taskField.appendChild(
                    ui.createTaskItem(
                        projects[projectIndex].getTaskStatus(i),
                        projects[projectIndex].getTaskName(i),
                        projectIndex,
                        i,
                        projects[projectIndex].getTaskDueDate(i),
                        projects[projectIndex].getTaskPriority(i)
                    )
                );
            }
        } else if (selectedItem === 'nav-today') {
            const todayDate = format(new Date(), 'yyyy-MM-dd');
            for (let i = 0; i < projects[projectIndex].getTasks().length; i++) {
                if (todayDate === projects[projectIndex].getTaskDueDate(i)) {
                    taskField.appendChild(
                        ui.createTaskItem(
                            projects[projectIndex].getTaskStatus(i),
                            projects[projectIndex].getTaskName(i),
                            projectIndex,
                            i,
                            projects[projectIndex].getTaskDueDate(i),
                            projects[projectIndex].getTaskPriority(i)
                        )
                    );
                }
            }
        } else if (selectedItem === 'nav-week') {
            for (let i = 0; i < projects[projectIndex].getTasks().length; i++) {
                if (isWeek(projects[projectIndex].getTaskDueDate(i))) {
                    taskField.appendChild(
                        ui.createTaskItem(
                            projects[projectIndex].getTaskStatus(i),
                            projects[projectIndex].getTaskName(i),
                            projectIndex,
                            i,
                            projects[projectIndex].getTaskDueDate(i),
                            projects[projectIndex].getTaskPriority(i)
                        )
                    );
                }
            }
        }
    };

    const addTaskHeaderText = (projectName) => {
        const taskContent = document.getElementById('task-content');
        taskContent.children[0].textContent = projectName;
    };

    const removeViewTaskModal = () => {
        const taskViewContainer = document.getElementById('task-view-container');
        taskViewContainer.textContent = '';
    };

    const loadTaskInformations = (title, description, dueDate, priority) => {
        const taskTitleInput = document.getElementById('task-title-input');
        const taskDescriptionInput = document.getElementById('task-description-input');
        const taskDueDateInput = document.getElementById('task-duedate-input');
        const taskPriorityInputs = document.querySelectorAll('.task-priority');

        taskTitleInput.value = title;
        taskDescriptionInput.value = description;
        taskDueDateInput.value = dueDate;
        const selectedRadioButton = getTaskPriorityRadioButton(taskPriorityInputs, priority);
        selectedRadioButton.checked = true;
    };

    const toggleNewTaskButton = (isProject) => {
        const newTaskButton = document.getElementById('btn-new-task');

        if (isProject > 0) {
            newTaskButton.style.display = 'flex';
        } else if (isProject <= 0) {
            newTaskButton.style.display = 'none';
        }
    };

    // Project controller
    const addNewProject = (projectName) => {
        const newProject = Project(projectName);
        projectArray.addProject(newProject);
    };

    const removeProjectModal = () => {
        const projectModalContainer = document.getElementById('project-modal-container');
        const newProjectButton = document.getElementById('btn-new-project');
        projectModalContainer.textContent = '';
        newProjectButton.style.display = 'flex';
    };

    const openTaskModal = () => {
        removeProjectModal();
        ui.createTaskModal();
    };

    const updateProjectList = (projectList) => {
        const projectField = document.getElementById('project-field');
        projectField.textContent = '';

        let index = 0;
        projectList.forEach((project) => {
            projectField.appendChild(ui.createProjectItem(project, index));
            index += 1;
        });
    };

    const removeItemSelection = (itemList) => {
        itemList.forEach((item) => {
            item.classList.remove('item-selected');
        });
    };

    return {
        toggleNavBar,
        toggleNodeState,
        getTaskPriority,
        addNewProject,
        removeProjectModal,
        updateProjectList,
        removeItemSelection,
        addNewTask,
        replaceTask,
        openTaskModal,
        loadTaskInformations,
        addTaskHeaderText,
        updateTaskList,
        removeTaskModal,
        toggleNewTaskButton,
        removeViewTaskModal,
        toggleCheckboxLabelState
    };
})();

export default controller;
