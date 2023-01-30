import ui from './ui';
import { Project, projectArray } from './project';

const controller = (() => {
    // Task controller
    const loadTasks = (projectName) => {
        ui.addTaskHeaderText(projectName);
        ui.toggleNewTaskButton(projectArray.getProjects().length);
        ui.removeTaskModal();
    };

    const setTaskModalButtonsEventListener = () => {
        const addButton = document.getElementById('btn-add-task');
        const cancelButton = document.getElementById('btn-cancel-task');
        const taskTitleInput = document.getElementById('task-title-input');
        const taskDescriptionInput = document.getElementById('task-description-input');
        const taskDueDateInput = document.getElementById('task-due-date-input');
        const taskPriorityLowInput = document.getElementById('task-priority-low-input');
        const taskPriorityMediumInput = document.getElementById('task-priority-medium-input');
        const taskPriorityHighInput = document.getElementById('task-priority-high-input');
        const newTaskButton = document.getElementById('btn-new-task');

        addButton.addEventListener('click', () => {
            /*   if (projectArray.isTaskExist(taskTitleInput.value)) {
                ui.errorMsgTaskExist();
            } else if (
                taskTitleInput.value === null ||
                taskTitleInput.value.match(/^ *$/) !== null
            ) {
                ui.errorMsgTaskFieldEmpty();
            } else {
                const newTask = Task(taskTitleInput.value);
                projectArray.addProject(newTask);

                const taskField = document.getElementById('task-field');
                taskField.textContent = '';
                if (projectArray.getProjects().length > 0) {
                    ui.updateProjectList(projectArray.getProjects(), projectField);
                    setProjectSelectionEventListener();
                    setProjectRemoveEventListener();
                    openTaskModalEventListener();
                } else {
                    // ui.removeProjectInformation();
                }

                ui.removeProjectModal();
            }*/
        });

        cancelButton.addEventListener('click', () => {
            ui.removeTaskModal();
            ui.toggleNewTaskButton(projectArray.getProjects().length);
        });
    };

    const openTaskModalEventListener = () => {
        const newProjectButton = document.getElementById('btn-new-project');
        const newTaskButton = document.getElementById('btn-new-task');

        // Set event listener
        newTaskButton.addEventListener('click', () => {
            newTaskButton.style.display = 'none';
            newProjectButton.style.display = 'block';
            ui.removeProjectModal();
            ui.createTaskModal();
            setTaskModalButtonsEventListener();
        });
    };

    // Project controller
    const setProjectSelectionEventListener = () => {
        // Select the newly added project by default
        const projectItemList = document.querySelectorAll('.project-item');
        const projectItem = document.querySelectorAll('.project-item-left');
        const projectField = document.getElementById('project-field');

        const firstProjectItem = projectField.firstChild;
        const firstProjectName = firstProjectItem.firstChild.children[1].textContent;

        ui.removeProjectSelection(projectItemList);
        firstProjectItem.classList.add('item-selected');
        loadTasks(firstProjectName);

        // Set event listener
        projectItem.forEach((project) => {
            project.addEventListener('click', () => {
                ui.removeProjectSelection(projectItemList);
                project.parentNode.classList.add('item-selected');
                loadTasks(project.children[1].textContent);
            });
        });
    };

    const setProjectRemoveEventListener = () => {
        const projectList = document.querySelectorAll('.project-item-right');

        // Set event listener
        projectList.forEach((project) => {
            project.addEventListener('click', () => {
                projectArray.removeProject(project.dataset.index);

                const projectField = document.getElementById('project-field');
                projectField.textContent = '';

                if (projectArray.getProjects().length > 0) {
                    ui.updateProjectList(projectArray.getProjects(), projectField);
                    setProjectSelectionEventListener();
                    setProjectRemoveEventListener();
                } else {
                    loadTasks('');
                }
            });
        });
    };

    const setProjectModalButtonsEventListener = () => {
        const addButton = document.getElementById('btn-add-project');
        const cancelButton = document.getElementById('btn-cancel-project');
        const projectNameInput = document.getElementById('project-name-input');
        const newProjectButton = document.getElementById('btn-new-project');

        addButton.addEventListener('click', () => {
            if (projectArray.isProjectExist(projectNameInput.value)) {
                ui.errorMsgProjectExist();
            } else if (projectNameInput.value.match(/^ *$/) !== null) {
                ui.errorMsgProjectFieldEmpty();
            } else {
                const newProject = Project(projectNameInput.value);
                projectArray.addProject(newProject);

                const projectField = document.getElementById('project-field');
                projectField.textContent = '';

                ui.updateProjectList(projectArray.getProjects(), projectField);
                setProjectSelectionEventListener();
                setProjectRemoveEventListener();

                ui.removeProjectModal();
            }
        });

        projectNameInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                addButton.click();
            }
        });
        cancelButton.addEventListener('click', () => {
            ui.removeProjectModal();
            newProjectButton.style.display = 'flex';
        });
    };

    const openProjectModalEventListener = () => {
        const newProjectButton = document.getElementById('btn-new-project');

        ui.toggleNewTaskButton(projectArray.getProjects().length);

        // Set event listener
        newProjectButton.addEventListener('click', () => {
            newProjectButton.style.display = 'none';
            ui.removeTaskModal();
            ui.toggleNewTaskButton(projectArray.getProjects().length);
            ui.createProjectModal();
            setProjectModalButtonsEventListener();
        });
    };

    return { openProjectModalEventListener, openTaskModalEventListener };
})();

export default controller;
