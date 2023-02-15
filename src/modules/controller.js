import { format } from 'date-fns';
import ui from './ui';
import { Project, projectArray } from './project';
import Task from './task';
import storage from './storage';

const controller = (() => {
    // General controllers
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
            navBar.style.width = '100vw';
            navBar.style.left = '0';
            navToggleButton.textContent = 'close';
        }
    };

    const isWeek = (newDate) => {
        let result = false;

        const today = new Date();

        // Get the first day of the current week (Monday)
        // clone date object, so we don't mutate it
        const date = new Date(today);
        // get day of week
        const day = date.getDay();
        // day of month - day of week (-6 if Sunday), otherwise +1
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const firstDay = new Date(date.setDate(diff));

        // Get the last day of the current week (Sunday)
        const lastDay = new Date(firstDay);

        lastDay.setDate(lastDay.getDate() + 6);

        //firstDay = format(firstDay, 'yyyy-MM-dd');
        //lastDay = format(lastDay, 'yyyy-MM-dd');
        //console.log(format(firstDay, 'yyyy-MM-dd'), format(lastDay, 'yyyy-MM-dd'));

        if (newDate >= format(firstDay, 'yyyy-MM-dd') && newDate <= format(lastDay, 'yyyy-MM-dd')) {
            result = true;
        }

        return result;
    };

    const toggleNodeState = () => {
        const header = document.querySelector('header');
        const main = document.querySelector('main');
        const footer = document.querySelector('footer');

        header.classList.toggle('inactive-header');
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

    const toggleCheckboxLabelState = (projects, projectIndex, id, taskIndex, isChecked) => {
        const label = document.querySelector(`label[for="${id}"]`);

        if (isChecked) {
            label.classList.add('task-done');
            projects[projectIndex].toggleTaskStatus(taskIndex, true);
        } else {
            label.classList.remove('task-done');
            projects[projectIndex].toggleTaskStatus(taskIndex, false);
        }
        storage.saveLocal(projects[projectIndex].getTasks(), projectIndex, '', 'replace-tasks');
    };

    const addNewTask = (projects, projectIndex, title, description, dueDate, priority) => {
        const newTask = Task(title, description, dueDate, priority);
        projects[projectIndex].addTask(newTask);
        storage.saveLocal(newTask, projectIndex, '', 'add-task');
    };

    const removeTask = (projects, projectIndex, taskIndex) => {
        projects[projectIndex].removeTask(taskIndex);
        storage.saveLocal('', projectIndex, taskIndex, 'remove-task');
    };

    const replaceTask = (
        project,
        projectIndex,
        taskIndex,
        newName,
        newDescription,
        newDueDate,
        newPriority,
        eventTarget
    ) => {
        const navToday = document.getElementById('nav-today');
        const navWeek = document.getElementById('nav-week');

        const todayDate = format(new Date(), 'yyyy-MM-dd');

        project.setTaskName(taskIndex, newName);
        project.setTaskDescription(taskIndex, newDescription);
        project.seTaskDueDate(taskIndex, newDueDate);
        project.setTaskPriority(taskIndex, newPriority);

        storage.saveLocal(project.getTasks(), projectIndex, '', 'replace-tasks');

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
        const itemSelected = document.querySelectorAll('li');
        if (
            isProject > 0 &&
            !itemSelected[0].classList.contains('item-selected') &&
            !itemSelected[1].classList.contains('item-selected') &&
            !itemSelected[2].classList.contains('item-selected')
        ) {
            newTaskButton.style.display = 'flex';
        } else if (isProject <= 0) {
            newTaskButton.style.display = 'none';
        }
    };

    // Project controller
    const addNewProject = (projectName) => {
        const newProject = Project(projectName);
        projectArray.addProject(newProject);
        storage.saveLocal(projectName, '', '', 'add-project');
    };

    const removeProject = (projectIndex) => {
        const projectField = document.getElementById('project-field');
        projectArray.removeProject(projectIndex);
        projectField.textContent = '';
        storage.saveLocal('', projectIndex, '', 'remove-project');
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

    const loadDefaultTodoList = () => {
        // Project 1 with 3 tasks
        addNewProject('Learn web developement');

        addNewTask(
            projectArray.getProjects(),
            0,
            'Git Basics',
            'Get the basic workflow for using Git, which should enhance the understanding and demonstrate why Git is so useful.',
            '2023-02-06',
            'high'
        );

        addNewTask(
            projectArray.getProjects(),
            0,
            'HTML and CSS',
            'Get a basic overview of HTML, CSS and how they work together. Learn more about responsive design, animation, media quieries.',
            '2023-02-28',
            'high'
        );

        addNewTask(
            projectArray.getProjects(),
            0,
            'Javascript',
            'Get a basic overview of Javascript, such as variables, operators, functions. Learn about factory functions, modul pattern, javascript modules, API.',
            '2023-03-30',
            'medium'
        );

        // Project2 with 1 task
        addNewProject('Learn React');

        addNewTask(
            projectArray.getProjects(),
            1,
            'React basics',
            'Lear React: hook, lifecycle methods etc.',
            '2023-08-10',
            'low'
        );

        // Project3 with 4 tasks
        addNewProject('Household tasks');

        addNewTask(projectArray.getProjects(), 2, 'Car wash', 'Car wash', '2023-02-12', 'low');

        addNewTask(
            projectArray.getProjects(),
            2,
            'Bill payment',
            'Electric, Gas, Internet.',
            '2023-02-25',
            'medium'
        );

        addNewTask(
            projectArray.getProjects(),
            2,
            'Insurances payment',
            'House, Car.',
            '2023-02-12',
            'high'
        );

        addNewTask(
            projectArray.getProjects(),
            2,
            'Cut the grass',
            'Cut the grass.',
            '2023-03-13',
            'low'
        );

        updateProjectList(projectArray.getProjects());
    };

    return {
        toggleNavBar,
        toggleNodeState,
        getTaskPriority,
        addNewProject,
        removeProject,
        removeProjectModal,
        updateProjectList,
        removeItemSelection,
        addNewTask,
        removeTask,
        loadDefaultTodoList,
        replaceTask,
        openTaskModal,
        loadTaskInformations,
        updateTaskList,
        removeTaskModal,
        toggleNewTaskButton,
        removeViewTaskModal,
        toggleCheckboxLabelState
    };
})();

export default controller;
