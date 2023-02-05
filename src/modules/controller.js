import ui from './ui';
import { Project, projectArray } from './project';
import Task from './task';

const controller = (() => {
    // Task controller

    const toggleNodeState = () => {
        const header = document.querySelector('header');
        const main = document.querySelector('main');
        const footer = document.querySelector('footer');

        header.classList.toggle('inactive');
        main.classList.toggle('inactive');
        footer.classList.toggle('inactive');
    };

    const getTaskPriority = (taskPriority) => {
        let priority = '';
        for (let i = 0; i < taskPriority.length; i++) {
            if (taskPriority[i].checked) {
                switch (taskPriority[i].id) {
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

    const removeTaskModal = () => {
        const taskModalContainer = document.getElementById('task-modal-container');
        taskModalContainer.textContent = '';
    };

    const updateTaskList = (projectIndex) => {
        const taskField = document.getElementById('task-field');
        taskField.textContent = '';

        const projects = projectArray.getProjects();
        const project = projects[projectIndex];

        for (let i = 0; i < project.getTasks().length; i++) {
            taskField.appendChild(
                ui.createTaskItem(
                    project.getProjectName(),
                    project.getTaskStatus(i),
                    project.getTaskName(i),
                    i,
                    project.getTaskDueDate(i),
                    project.getTaskPriority(i)
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

    const removeProjectSelection = (projectList) => {
        projectList.forEach((item) => {
            item.classList.remove('item-selected');
        });
    };

    const toggleNewTaskButton = (isProject) => {
        const newTaskButton = document.getElementById('btn-new-task');

        if (isProject > 0) {
            newTaskButton.style.display = 'flex';
        } else {
            newTaskButton.style.display = 'none';
        }
    };

    return {
        getTaskPriority,
        toggleNodeState,
        addNewProject,
        removeProjectModal,
        updateProjectList,
        removeProjectSelection,
        addNewTask,
        openTaskModal,
        addTaskHeaderText,
        updateTaskList,
        removeTaskModal,
        toggleNewTaskButton,
        removeViewTaskModal,
        toggleCheckboxLabelState
    };
})();

export default controller;