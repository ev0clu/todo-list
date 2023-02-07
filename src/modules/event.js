import controller from './controller';
import ui from './ui';
import { projectArray } from './project';

const event = (() => {
    const setViewTaskModalCloseButtonsEventListener = () => {
        const closeButton = document.querySelector('.btn-close-view-task-modal');

        // Set event listener
        closeButton.addEventListener('click', () => {
            controller.removeViewTaskModal();
            controller.toggleNodeState();
            controller.toggleNewTaskButton(projectArray.getProjects().length);
        });
    };

    const setViewTaskEventListener = (project) => {
        const taskViewButtons = document.querySelectorAll('.btn-task-view');
        const newTaskButton = document.getElementById('btn-new-task');

        // Set event listener
        taskViewButtons.forEach((task) => {
            task.addEventListener('click', () => {
                const taskIndex = task.parentNode.parentNode.dataset.index;
                newTaskButton.style.display = 'none';
                controller.removeProjectModal();
                controller.toggleNodeState();

                ui.createViewTaskModal(
                    project.getTaskName(taskIndex),
                    project.getTaskDescription(taskIndex),
                    project.getTaskDueDate(taskIndex),
                    project.getTaskPriority(taskIndex)
                );

                setViewTaskModalCloseButtonsEventListener();
            });
        });
    };

    const setEditTaskModalButtonsEventListener = (taskIndex) => {
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
                    const projectIndex = projectList[i].dataset.index;
                    const projects = projectArray.getProjects();
                    const project = projects[projectIndex];

                    if (project.isTaskExist(taskTitleInput.value)) {
                        if (
                            project.getTasksName().indexOf(taskTitleInput.value) !==
                            Number(taskIndex)
                        ) {
                            ui.errorMsgTaskExist();
                        } else {
                            const taskPriorityInput =
                                controller.getTaskPriority(taskPriorityInputs);

                            controller.replaceTask(
                                project,
                                taskIndex,
                                taskTitleInput.value,
                                taskDescriptionInput.value,
                                taskDueDateInput.value,
                                taskPriorityInput
                            );
                            controller.removeTaskModal();
                            controller.toggleNodeState();
                            controller.toggleNewTaskButton(projectArray.getProjects().length);
                            break;
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
                            taskPriorityInput
                        );
                        controller.removeTaskModal();
                        controller.toggleNodeState();
                        controller.toggleNewTaskButton(projectArray.getProjects().length);
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

    const setEditTaskEventListener = (project) => {
        const taskEditButtons = document.querySelectorAll('.btn-task-edit');
        const newTaskButton = document.getElementById('btn-new-task');

        // Set event listener
        taskEditButtons.forEach((task) => {
            task.addEventListener('click', () => {
                newTaskButton.style.display = 'none';

                const taskIndex = task.parentNode.parentNode.dataset.index;
                const taskTitle = project.getTaskName(taskIndex);
                const taskDescription = project.getTaskDescription(taskIndex);
                const taskDueDate = project.getTaskDueDate(taskIndex);
                const taskPriority = project.getTaskPriority(taskIndex);

                controller.removeProjectModal();
                controller.openTaskModal();
                controller.loadTaskInformations(
                    taskTitle,
                    taskDescription,
                    taskDueDate,
                    taskPriority
                );
                controller.toggleNodeState();

                setEditTaskModalButtonsEventListener(taskIndex);
            });
        });
    };

    const setCheckboxEventListener = (project) => {
        const checkboxes = document.querySelectorAll('.task-checkbox');

        // Set event listener
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                const taskId = checkbox.parentNode.parentNode.dataset.index;

                if (checkbox.checked) {
                    controller.toggleCheckboxLabelState(checkbox.id, true);
                    project.toggleTaskStatus(taskId, true);
                } else {
                    controller.toggleCheckboxLabelState(checkbox.id, false);
                    project.toggleTaskStatus(taskId, false);
                }
            });
        });
    };

    const setRemoveTaskEventListener = (project, projectIndex) => {
        const taskRemoveButtons = document.querySelectorAll('.btn-task-remove');
        const taskField = document.getElementById('task-field');

        // Set event listener
        taskRemoveButtons.forEach((task) => {
            task.addEventListener('click', () => {
                const taskIndex = task.parentNode.parentNode.dataset.index;

                controller.removeTaskModal();

                project.removeTask(taskIndex);

                if (project.getTasks().length > 0) {
                    controller.updateTaskList(projectIndex);
                    setCheckboxEventListener(project);
                    setViewTaskEventListener(project);
                    setRemoveTaskEventListener(project, projectIndex);
                } else {
                    taskField.textContent = '';
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
                    const projectIndex = projectList[i].dataset.index;
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
                        controller.updateTaskList(projectIndex);
                        controller.removeTaskModal();
                        controller.toggleNodeState();
                        controller.toggleNewTaskButton(projectArray.getProjects().length);
                        setCheckboxEventListener(project);
                        setViewTaskEventListener(project);
                        setEditTaskEventListener(project);
                        setRemoveTaskEventListener(project, projectIndex);
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

    // Project controller
    const setProjectSelectionEventListener = () => {
        // Select the newly added project by default
        const projectItemList = document.querySelectorAll('.project-item');
        const projectItem = document.querySelectorAll('.project-item-left');
        const projectField = document.getElementById('project-field');

        let projects = projectArray.getProjects();
        const firstProjectItem = projectField.firstChild;

        controller.removeProjectSelection(projectItemList);
        firstProjectItem.classList.add('item-selected');
        controller.addTaskHeaderText(projects[0].getProjectName());
        controller.updateTaskList(firstProjectItem.dataset.index);
        controller.toggleNewTaskButton(projectArray.getProjects().length);

        setCheckboxEventListener(projects[0]);
        setViewTaskEventListener(projects[0]);
        setEditTaskEventListener(projects[0]);
        setRemoveTaskEventListener(projects[0], 0);

        // Set event listener
        projectItem.forEach((project) => {
            project.addEventListener('click', () => {
                controller.removeProjectSelection(projectItemList);
                project.parentNode.classList.add('item-selected');
                projects = projectArray.getProjects();
                const projectIndex = project.parentNode.dataset.index;

                controller.addTaskHeaderText(projects[projectIndex].getProjectName());

                controller.updateTaskList(projectIndex);

                setCheckboxEventListener(projects[projectIndex]);
                setViewTaskEventListener(projects[projectIndex]);
                setEditTaskEventListener(projects[projectIndex]);
                setRemoveTaskEventListener(projects[projectIndex], projectIndex);
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
                projectArray.removeProject(project.parentNode.dataset.index);
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

    const initialEventListener = () => {
        openProjectModalEventListener();
        openTaskModalEventListener();
    };

    return { initialEventListener };
})();

export default event;
