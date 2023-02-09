import controller from './controller';
import ui from './ui';
import { projectArray } from './project';

const event = (() => {
    // Task events
    const setViewTaskModalCloseButtonsEventListener = () => {
        const closeButton = document.querySelector('.btn-close-view-task-modal');

        // Set event listener
        closeButton.addEventListener('click', () => {
            controller.removeViewTaskModal();
            controller.toggleNodeState();
            controller.toggleNewTaskButton(projectArray.getProjects().length);
        });
    };

    const setViewTaskEventListener = (projects) => {
        const taskViewButtons = document.querySelectorAll('.btn-task-view');
        const newTaskButton = document.getElementById('btn-new-task');

        // Set event listener
        taskViewButtons.forEach((task) => {
            task.addEventListener('click', () => {
                const taskIndex = task.parentNode.parentNode.dataset.taskindex;
                const projectIndex = task.parentNode.parentNode.dataset.projectindex;
                newTaskButton.style.display = 'none';
                controller.removeProjectModal();
                controller.toggleNodeState();

                ui.createViewTaskModal(
                    projects[projectIndex].getTaskName(taskIndex),
                    projects[projectIndex].getTaskDescription(taskIndex),
                    projects[projectIndex].getTaskDueDate(taskIndex),
                    projects[projectIndex].getTaskPriority(taskIndex)
                );

                setViewTaskModalCloseButtonsEventListener();
            });
        });
    };

    const setEditTaskModalButtonsEventListener = (projectIndex, taskIndex, eventTarget) => {
        const formTaskModal = document.querySelector('form');
        const cancelButton = document.getElementById('btn-cancel-task');

        const taskTitleInput = document.getElementById('task-title-input');
        const taskDescriptionInput = document.getElementById('task-description-input');
        const taskDueDateInput = document.getElementById('task-duedate-input');
        const taskPriorityInputs = document.querySelectorAll('.task-priority');

        formTaskModal.addEventListener('submit', (e) => {
            // default button action should not be taken
            // button does not let to 'submit' the page
            e.preventDefault();

            const projects = projectArray.getProjects();
            const project = projects[projectIndex];

            if (project.isTaskExist(taskTitleInput.value)) {
                if (project.getTasksName().indexOf(taskTitleInput.value) !== Number(taskIndex)) {
                    ui.errorMsgTaskExist();
                } else {
                    const taskPriorityInput = controller.getTaskPriority(taskPriorityInputs);

                    controller.replaceTask(
                        project,
                        taskIndex,
                        taskTitleInput.value,
                        taskDescriptionInput.value,
                        taskDueDateInput.value,
                        taskPriorityInput,
                        eventTarget
                    );
                    controller.removeTaskModal();
                    controller.toggleNodeState();
                    controller.toggleNewTaskButton(projectArray.getProjects().length);
                }
            } else if (taskTitleInput.value.match(/^ *$/) !== null) {
                ui.errorMsgTaskFieldEmpty();
            } else {
                const taskPriorityInput = controller.getTaskPriority(taskPriorityInputs);

                controller.replaceTask(
                    project,
                    taskIndex,
                    taskTitleInput.value,
                    taskDescriptionInput.value,
                    taskDueDateInput.value,
                    taskPriorityInput,
                    eventTarget
                );
                controller.removeTaskModal();
                controller.toggleNodeState();
                controller.toggleNewTaskButton(projectArray.getProjects().length);
            }
        });

        cancelButton.addEventListener('click', (e) => {
            // default button action should not be taken
            // button does not check 'input's required'
            e.preventDefault();
            controller.removeTaskModal();
            controller.toggleNodeState();
            controller.toggleNewTaskButton(projectArray.getProjects().length);
        });
    };

    const setEditTaskEventListener = (projects) => {
        const taskEditButtons = document.querySelectorAll('.btn-task-edit');
        const newTaskButton = document.getElementById('btn-new-task');

        // Set event listener
        taskEditButtons.forEach((task) => {
            task.addEventListener('click', (e) => {
                newTaskButton.style.display = 'none';

                const taskIndex = task.parentNode.parentNode.dataset.taskindex;
                const projectIndex = task.parentNode.parentNode.dataset.projectindex;
                const taskTitle = projects[projectIndex].getTaskName(taskIndex);
                const taskDescription = projects[projectIndex].getTaskDescription(taskIndex);
                const taskDueDate = projects[projectIndex].getTaskDueDate(taskIndex);
                const taskPriority = projects[projectIndex].getTaskPriority(taskIndex);

                controller.removeProjectModal();
                controller.openTaskModal();
                controller.loadTaskInformations(
                    taskTitle,
                    taskDescription,
                    taskDueDate,
                    taskPriority
                );
                controller.toggleNodeState();

                setEditTaskModalButtonsEventListener(
                    projectIndex,
                    taskIndex,
                    e.target.parentNode.parentNode.parentNode
                );
            });
        });
    };

    const setCheckboxEventListener = (projects) => {
        const checkboxes = document.querySelectorAll('.task-checkbox');

        // Set event listener
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                const taskIndex = checkbox.parentNode.parentNode.dataset.taskindex;
                const projectIndex = checkbox.parentNode.parentNode.dataset.projectindex;

                if (checkbox.checked) {
                    controller.toggleCheckboxLabelState(checkbox.id, true);
                    projects[projectIndex].toggleTaskStatus(taskIndex, true);
                } else {
                    controller.toggleCheckboxLabelState(checkbox.id, false);
                    projects[projectIndex].toggleTaskStatus(taskIndex, false);
                }
            });
        });
    };

    const setTaskRemoveEventListener = (projects, selectedItem) => {
        const taskRemoveButtons = document.querySelectorAll('.btn-task-remove');
        const taskField = document.getElementById('task-field');

        // Set event listener
        taskRemoveButtons.forEach((task) => {
            task.addEventListener('click', () => {
                const taskIndex = task.parentNode.parentNode.dataset.taskindex;
                const projectIndex = task.parentNode.parentNode.dataset.projectindex;

                controller.removeTaskModal();

                projects[projectIndex].removeTask(taskIndex);
                taskField.textContent = '';

                if (selectedItem === 'nav-inbox') {
                    let loop = false;
                    for (let i = 0; i < projects.length; i++) {
                        for (let j = 0; j < projects[i].getTasks().length; j++) {
                            if (projects[i].getTasks().length > 0) {
                                loop = true;
                                break;
                            }
                        }
                        if (loop === true) {
                            break;
                        }
                    }
                    if (loop === true) {
                        for (let i = 0; i < projects.length; i++) {
                            controller.updateTaskList(projects, i, 'nav-inbox');
                        }

                        setCheckboxEventListener(projects);
                        setViewTaskEventListener(projects);
                        setEditTaskEventListener(projects);
                        setTaskRemoveEventListener(projects, 'nav-inbox');
                    } else {
                        taskField.textContent = '';
                    }
                } else if (selectedItem === 'project-item') {
                    if (projects[projectIndex].getTasks().length > 0) {
                        controller.updateTaskList(projects, projectIndex, 'project-item');
                        setCheckboxEventListener(projects);
                        setViewTaskEventListener(projects);
                        setEditTaskEventListener(projects);
                        setTaskRemoveEventListener(projects, 'project-item');
                    } else {
                        taskField.textContent = '';
                    }
                }
            });
        });
    };

    const setTaskModalButtonsEventListener = () => {
        const formTaskModal = document.querySelector('form');
        const cancelButton = document.getElementById('btn-cancel-task');

        const taskTitleInput = document.getElementById('task-title-input');
        const taskDescriptionInput = document.getElementById('task-description-input');
        const taskDueDateInput = document.getElementById('task-duedate-input');
        const taskPriorityInputs = document.querySelectorAll('.task-priority');

        const projectList = document.querySelectorAll('.project-item');

        formTaskModal.addEventListener('submit', (e) => {
            // default button action should not be taken
            // button does not let to 'submit' the page
            e.preventDefault();

            for (let i = 0; i < projectList.length; i++) {
                if (projectList[i].classList.contains('item-selected')) {
                    const projectIndex = projectList[i].dataset.projectindex;
                    const projects = projectArray.getProjects();
                    const project = projects[projectIndex];
                    if (project.isTaskExist(taskTitleInput.value)) {
                        ui.errorMsgTaskExist();
                    } else if (taskTitleInput.value.match(/^ *$/) !== null) {
                        ui.errorMsgTaskFieldEmpty();
                    } else {
                        const taskPriorityInput = controller.getTaskPriority(taskPriorityInputs);

                        controller.addNewTask(
                            project,
                            taskTitleInput.value,
                            taskDescriptionInput.value,
                            taskDueDateInput.value,
                            taskPriorityInput
                        );

                        controller.updateTaskList(projects, projectIndex, 'project-item');
                        controller.removeTaskModal();
                        controller.toggleNodeState();
                        controller.toggleNewTaskButton(projectArray.getProjects().length);
                        setCheckboxEventListener(projects);
                        setViewTaskEventListener(projects);
                        setEditTaskEventListener(projects);
                        setTaskRemoveEventListener(projects, 'project-item');
                        break;
                    }
                }
            }
        });

        cancelButton.addEventListener('click', (e) => {
            // default button action should not be taken
            // button does not check 'input's required'
            e.preventDefault();
            controller.removeTaskModal();
            controller.toggleNodeState();
            controller.toggleNewTaskButton(projectArray.getProjects().length);
        });
    };

    const openTaskModalEventListener = () => {
        const newTaskButton = document.getElementById('btn-new-task');

        // Set event listener
        newTaskButton.addEventListener('click', () => {
            newTaskButton.style.display = 'none';

            controller.openTaskModal();
            controller.toggleNodeState();
            setTaskModalButtonsEventListener();
        });
    };

    // Project events
    const setProjectSelectionEventListener = () => {
        // Select the newly added project by default
        const itemList = document.querySelectorAll('li');
        const projectItem = document.querySelectorAll('.project-item-left');
        const projectField = document.getElementById('project-field');
        const newProjectButton = document.getElementById('btn-new-project');

        let projects = projectArray.getProjects();
        const firstProjectItem = projectField.firstChild;

        controller.removeItemSelection(itemList);
        firstProjectItem.classList.add('item-selected');
        controller.addTaskHeaderText(projects[0].getProjectName());
        controller.updateTaskList(projects, firstProjectItem.dataset.projectindex, 'project-item');
        controller.toggleNewTaskButton(projectArray.getProjects().length);

        setCheckboxEventListener(projects);
        setViewTaskEventListener(projects);
        setEditTaskEventListener(projects);
        setTaskRemoveEventListener(projects, 'project-item');

        // Set event listener
        projectItem.forEach((project) => {
            project.addEventListener('click', () => {
                newProjectButton.style.display = 'flex';
                controller.removeItemSelection(itemList);
                controller.toggleNewTaskButton(projects.length);
                project.parentNode.classList.add('item-selected');
                projects = projectArray.getProjects();

                const projectIndex = project.parentNode.dataset.projectindex;

                controller.addTaskHeaderText(projects[projectIndex].getProjectName());
                controller.updateTaskList(projects, projectIndex, 'project-item');

                setCheckboxEventListener(projects);
                setViewTaskEventListener(projects);
                setEditTaskEventListener(projects);
                setTaskRemoveEventListener(projects, 'project-item');
            });
        });
    };

    const setProjectRemoveEventListener = () => {
        const projectRemoveButton = document.querySelectorAll('.project-item-right');
        const projectField = document.getElementById('project-field');
        const taskField = document.getElementById('task-field');

        // Set event listener
        projectRemoveButton.forEach((project) => {
            project.addEventListener('click', () => {
                projectArray.removeProject(project.parentNode.dataset.projectindex);
                projectField.textContent = '';

                if (projectArray.getProjects().length > 0) {
                    controller.updateProjectList(projectArray.getProjects());
                    setProjectSelectionEventListener();
                    setProjectRemoveEventListener();
                } else {
                    controller.toggleNewTaskButton(projectArray.getProjects().length);
                    controller.addTaskHeaderText('');
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
                controller.addNewProject(projectNameInput.value);
                controller.updateProjectList(projectArray.getProjects());
                controller.removeProjectModal();
                setProjectSelectionEventListener();
                setProjectRemoveEventListener();
            }
        });

        projectNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addButton.click();
            }
        });
        cancelButton.addEventListener('click', () => {
            controller.removeProjectModal();
            newProjectButton.style.display = 'flex';
        });
    };

    const openProjectModalEventListener = () => {
        const newProjectButton = document.getElementById('btn-new-project');
        controller.toggleNewTaskButton(projectArray.getProjects().length);

        // Set event listener
        newProjectButton.addEventListener('click', () => {
            newProjectButton.style.display = 'none';
            ui.createProjectModal();
            setProjectModalButtonsEventListener();
        });
    };

    // Other events

    const setNavItemSelectionEventListener = () => {
        // Select the newly added project by default
        const navList = document.querySelectorAll('.nav-item');
        const newProjectButton = document.getElementById('btn-new-project');

        // Set event listener
        navList.forEach((item) => {
            item.addEventListener('click', () => {
                const projects = projectArray.getProjects();
                const items = document.querySelectorAll('li');

                controller.removeProjectModal();
                controller.removeItemSelection(items);
                controller.toggleNewTaskButton(-1);
                item.classList.add('item-selected');
                controller.addTaskHeaderText(item.lastElementChild.textContent);

                const taskField = document.getElementById('task-field');
                taskField.textContent = '';

                if (item.id === 'nav-inbox') {
                    for (let i = 0; i < projects.length; i++) {
                        controller.updateTaskList(projects, i, 'nav-inbox');
                    }
                } else if (item.id === 'nav-today') {
                    for (let i = 0; i < projects.length; i++) {
                        controller.updateTaskList(projects, i, 'nav-today');
                    }
                }

                setCheckboxEventListener(projects);
                setViewTaskEventListener(projects);
                setEditTaskEventListener(projects);
                setTaskRemoveEventListener(projects, 'nav-inbox');
                controller.toggleNewTaskButton(null);
            });
        });
    };

    const initialEventListener = () => {
        const selectedDefaultItem = document.getElementById('nav-inbox');
        selectedDefaultItem.classList.add('item-selected');
        controller.addTaskHeaderText(selectedDefaultItem.lastElementChild.textContent);
        openProjectModalEventListener();
        openTaskModalEventListener();
        setNavItemSelectionEventListener();
    };

    return { initialEventListener };
})();

export default event;
