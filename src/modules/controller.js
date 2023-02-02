import ui from './ui';
import { Project, projectArray } from './project';
import Task from './task';

const controller = (() => {
    // Task controller
    const setCheckboxEventListener = () => {
        const checkboxes = document.querySelectorAll('.task-checkbox');

        // Set event listener
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    console.log('Checkbox is checked..');
                } else {
                    console.log('Checkbox is not checked..');
                }
            });
        });
    };

    const loadTaskField = (projectIndex) => {
        const taskField = document.getElementById('task-field');
        taskField.textContent = '';
        if (projectIndex !== null) {
            const projects = projectArray.getProjects();
            const project = projects[projectIndex];

            ui.addTaskHeaderText(project.getProjectName());

            for (let i = 0; i < project.getTasks().length; i++) {
                ui.updateTaskList(
                    project.getProjectName(),
                    project.getTaskName(i),
                    i,
                    project.getTaskPriority(i)
                );
            }

            setCheckboxEventListener();
            ui.toggleNewTaskButton(projectArray.getProjects().length);
            ui.removeTaskModal();
        } else {
            ui.addTaskHeaderText('');
            ui.toggleNewTaskButton(projectArray.getProjects().length);
            ui.removeTaskModal();
        }
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

    const setTaskModalButtonsEventListener = () => {
        const formTaskModal = document.querySelector('form');
        const cancelButton = document.getElementById('btn-cancel-task');

        const taskTitleInput = document.getElementById('task-title-input');
        const taskDescriptionInput = document.getElementById('task-description-input');
        const taskDueDateInput = document.getElementById('task-due-date-input');
        const taskPriorityInputs = document.querySelectorAll('.task-priority');

        const newTaskButton = document.getElementById('btn-new-task');

        const projectList = document.querySelectorAll('.project-item');

        formTaskModal.addEventListener('submit', (event) => {
            // default button action should not be taken
            // button does not let to 'submit' the page
            event.preventDefault();

            for (let i = 0; i < projectList.length; i++) {
                if (projectList[i].classList.contains('item-selected')) {
                    const projectIndex = projectList[i].dataset.index;
                    const projects = projectArray.getProjects();
                    const project = projects[projectIndex];
                    if (project.isTaskExist(taskTitleInput.value)) {
                        ui.errorMsgTaskExist();
                    } else if (taskTitleInput.value.match(/^ *$/) !== null) {
                        ui.errorMsgTaskFieldEmpty();
                    } else {
                        const taskPriorityInput = getTaskPriority(taskPriorityInputs);

                        const newTask = Task(
                            taskTitleInput.value,
                            taskDescriptionInput.value,
                            taskDueDateInput.value,
                            taskPriorityInput
                        );

                        project.addTask(newTask);
                        loadTaskField(projectIndex);
                        ui.removeTaskModal();
                        ui.toggleNewTaskButton(projectArray.getProjects().length);
                        break;
                    }
                }
            }
        });

        cancelButton.addEventListener('click', (event) => {
            // default button action should not be taken
            // button does not check 'input's required'
            event.preventDefault();
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
            //newProjectButton.style.display = 'block';
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
        loadTaskField(firstProjectItem.dataset.index);

        // Set event listener
        projectItem.forEach((project) => {
            project.addEventListener('click', () => {
                ui.removeProjectSelection(projectItemList);
                project.parentNode.classList.add('item-selected');
                loadTaskField(project.parentNode.dataset.index);
            });
        });
    };

    const setProjectRemoveEventListener = () => {
        const projectRemoveButton = document.querySelectorAll('.project-item-right');
        const projectField = document.getElementById('project-field');

        // Set event listener
        projectRemoveButton.forEach((project) => {
            project.addEventListener('click', () => {
                projectArray.removeProject(project.parentNode.dataset.index);

                projectField.textContent = '';

                if (projectArray.getProjects().length > 0) {
                    ui.updateProjectList(projectArray.getProjects(), projectField);
                    setProjectSelectionEventListener();
                    setProjectRemoveEventListener();
                } else {
                    loadTaskField(null);
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
            } else if (
                projectNameInput.value === null ||
                projectNameInput.value.match(/^ *$/) !== null
            ) {
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
