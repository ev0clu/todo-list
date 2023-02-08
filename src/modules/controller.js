import ui from './ui';
import { Project, projectArray } from './project';
import Task from './task';
import { format, compareAsc } from 'date-fns';

const controller = (() => {
    const toggleNodeState = () => {
        const header = document.querySelector('header');
        const main = document.querySelector('main');
        const footer = document.querySelector('footer');

        header.classList.toggle('inactive');
        main.classList.toggle('inactive');
        footer.classList.toggle('inactive');
    };

    // Nav controller
    const prepareInboxTasks = () => {
        const taskField = document.getElementById('task-field');
        taskField.textContent = '';

        const tasksArray = [];

        const projects = projectArray.getProjects();

        for (let i = 0; i < projects.length; i++) {
            for (let j = 0; j < projects[i].getTasks().length; j++) {
                tasksArray.push(projects[i].getTasks()[j]);
            }
        }

        const sortedTasks = tasksArray.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        return sortedTasks;
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

    const replaceTask = (project, taskIndex, newName, newDescription, newDueDate, newPriority) => {
        project.setTaskName(taskIndex, newName);
        project.setTaskDescription(taskIndex, newDescription);
        project.seTaskDueDate(taskIndex, newDueDate);
        project.setTaskPriority(taskIndex, newPriority);

        ui.replaceTaskItem(taskIndex, newName, newDueDate, newPriority);
    };

    const removeTaskModal = () => {
        const taskModalContainer = document.getElementById('task-modal-container');
        taskModalContainer.textContent = '';
    };

    const updateTaskList = (projects, projectIndex, itemSelected) => {
        const taskField = document.getElementById('task-field');

        if (itemSelected === 'project-item') {
            taskField.textContent = '';
        }

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
        newProjectButton.style.display = 'block';
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
        prepareInboxTasks,
        getTaskPriority,
        toggleNodeState,
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
