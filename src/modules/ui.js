const ui = (() => {
    // General UI
    const createLabel = (id, text) => {
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = text;

        return label;
    };

    const createInput = (className, name, id, type, isRequired) => {
        const input = document.createElement('input');
        input.classList.add(className);
        input.name = name;
        input.id = id;
        input.type = type;
        input.required = isRequired;

        return input;
    };

    const createTextArea = (name, id, rows, cols, resize) => {
        const textArea = document.createElement('textarea');
        textArea.name = name;
        textArea.id = id;
        textArea.rows = rows;
        textArea.cols = cols;
        textArea.style.resize = resize;

        return textArea;
    };

    const createErrorField = (errorID) => {
        const errorParagraph = document.createElement('p');
        errorParagraph.id = errorID;

        return errorParagraph;
    };

    const createAddButton = (buttonID) => {
        const addButton = document.createElement('button');
        addButton.id = buttonID;
        addButton.textContent = 'Add';

        return addButton;
    };

    const createCancelButton = (buttonID) => {
        const cancelButton = document.createElement('button');
        cancelButton.id = buttonID;
        cancelButton.textContent = 'Cancel';

        return cancelButton;
    };

    // Project UI
    const errorMsgProjectExist = () => {
        const errorMsg = document.getElementById('project-warning');
        errorMsg.textContent = 'Project already exist';
    };

    const errorMsgProjectFieldEmpty = () => {
        const errorMsg = document.getElementById('project-warning');
        errorMsg.textContent = 'Project name is missing';
    };

    const createProjectModal = () => {
        const projectModalDiv = document.getElementById('project-modal-container');

        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'btn-project-modal-container';

        buttonDiv.appendChild(createAddButton('btn-add-project'));
        buttonDiv.appendChild(createCancelButton('btn-cancel-project'));

        projectModalDiv.appendChild(
            createInput('project-name-input', 'project-name-input', 'project-name-input', 'text')
        );
        projectModalDiv.appendChild(createErrorField('project-warning'));
        projectModalDiv.appendChild(buttonDiv);
    };

    const removeProjectModal = () => {
        const projectModalContainer = document.getElementById('project-modal-container');
        const newProjectButton = document.getElementById('btn-new-project');
        projectModalContainer.textContent = '';
        newProjectButton.style.display = 'block';
    };

    const createProjectItem = (project, index) => {
        const projectItem = document.createElement('li');
        projectItem.classList.add('project-item');
        projectItem.setAttribute('data-index', `${index}`);

        const buttonProjectItemLeft = document.createElement('button');
        buttonProjectItemLeft.classList.add('project-item-left');

        const projectItemIcon = document.createElement('span');
        projectItemIcon.classList.add('material-symbols-outlined');
        projectItemIcon.textContent = 'checklist';

        const projectName = document.createElement('p');
        projectName.textContent = project.getProjectName();

        const buttonProjectItemRight = document.createElement('button');
        buttonProjectItemRight.classList.add('project-item-right');

        const projectRemoveIcon = document.createElement('span');
        projectRemoveIcon.classList.add('material-symbols-outlined');
        projectRemoveIcon.textContent = 'delete';

        buttonProjectItemLeft.append(projectItemIcon, projectName);
        buttonProjectItemRight.appendChild(projectRemoveIcon);
        projectItem.append(buttonProjectItemLeft, buttonProjectItemRight);

        return projectItem;
    };

    const updateProjectList = (projectList, projectField) => {
        let index = 0;
        projectList.forEach((project) => {
            projectField.appendChild(createProjectItem(project, index));
            index += 1;
        });
    };

    const removeProjectSelection = (projectList) => {
        projectList.forEach((item) => {
            item.classList.remove('item-selected');
        });
    };

    // Task UI
    const toggleCheckboxLabelState = (id, isChecked) => {
        const label = document.querySelector(`label[for="${id}"]`);
        console.log(label);
        if (isChecked) {
            label.classList.add('task-done');
        } else {
            label.classList.remove('task-done');
        }
    };

    const addTaskHeaderText = (projectName) => {
        const taskContent = document.getElementById('task-content');
        taskContent.children[0].textContent = projectName;
    };

    const createTaskItem = (projectName, checkStatus, taskName, index, dueDate, priority) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.setAttribute('data-index', `${index}`);
        taskItem.classList.add(`priority-${priority}`);

        const taskItemLeft = document.createElement('div');
        taskItemLeft.classList.add('task-item-left');
        const taskCheckbox = document.createElement('input');
        taskCheckbox.name = `${projectName}${taskName}`;
        taskCheckbox.id = `${projectName}${taskName}`;
        taskCheckbox.type = 'checkbox';
        taskCheckbox.checked = checkStatus;
        taskCheckbox.classList.add('task-checkbox');

        const taskCheckboxLabel = createLabel(`${projectName}${taskName}`, taskName);
        if (taskCheckbox.checked) {
            taskCheckboxLabel.classList.add('task-done');
        }

        const taskItemMiddle = document.createElement('div');
        taskItemMiddle.classList.add('task-item-middle');
        taskItemMiddle.textContent = dueDate;

        const taskItemRight = document.createElement('div');
        taskItemRight.classList.add('task-item-right');
        const taskViewIcon = document.createElement('span');
        taskViewIcon.classList.add('material-symbols-outlined');
        taskViewIcon.textContent = 'visibility';
        const taskEditIcon = document.createElement('span');
        taskEditIcon.classList.add('material-symbols-outlined');
        taskEditIcon.textContent = 'edit';
        const taskRemoveIcon = document.createElement('span');
        taskRemoveIcon.classList.add('material-symbols-outlined');
        taskRemoveIcon.textContent = 'delete';

        taskItemLeft.append(taskCheckbox, taskCheckboxLabel);
        taskItemRight.append(taskViewIcon, taskEditIcon, taskRemoveIcon);

        taskItem.append(taskItemLeft, taskItemMiddle, taskItemRight);

        return taskItem;
    };

    const updateTaskList = (projectName, checkStatus, taskName, index, dueDate, priority) => {
        const taskField = document.getElementById('task-field');

        taskField.appendChild(
            createTaskItem(projectName, checkStatus, taskName, index, dueDate, priority)
        );

        /*
        for (let i = 0; i < tasks.length; i++) {
            console.log('task name: ', project.getTaskName(i));
            console.log('task info: ', project.getTaskDescription(i));
            console.log('task date: ', project.getTaskDueDate(i));
            console.log('task prio: ', project.getTaskPriority(i));
        }
*/
        /*console.log('project name: ', project.getProjectName());

        for (let i = 0; i < tasks.length; i++) {
            console.log('task name: ', project.getTaskName(i));
            console.log('task info: ', project.getTaskDescription(i));
            console.log('task date: ', project.getTaskDueDate(i));
            console.log('task prio: ', project.getTaskPriority(i));
        }*/
    };

    const createTaskModal = () => {
        const taskModalContainer = document.getElementById('task-modal-container');

        const taskModalDiv = document.createElement('form');
        taskModalDiv.id = 'task-modal';
        taskModalDiv.method = 'post';

        const titleDiv = document.createElement('div');
        titleDiv.classList.add('task-modal-input');
        titleDiv.appendChild(createLabel('task-title-input', 'Title*'));
        const title = createInput(
            'task-title-input',
            'task-title-input',
            'task-title-input',
            'text',
            true
        );
        titleDiv.appendChild(title);

        const descriptionDiv = document.createElement('div');
        descriptionDiv.classList.add('task-modal-input');

        const descriptionLable = createLabel('task-description-input', 'Description');
        const descriptionSpan = document.createElement('span');
        descriptionSpan.classList.add('description-input-sublabel');
        descriptionSpan.textContent = ' (optional)';
        descriptionLable.appendChild(descriptionSpan);

        descriptionDiv.appendChild(descriptionLable);
        descriptionDiv.appendChild(
            createTextArea('task-description-input', 'task-description-input', '3', '30', 'none')
        );

        const dueDateDiv = document.createElement('div');
        dueDateDiv.classList.add('task-modal-input');
        dueDateDiv.appendChild(createLabel('task-due-date-input', 'Due Date*'));
        dueDateDiv.appendChild(
            createInput(
                'task-due-date-input',
                'task-due-date-input',
                'task-due-date-input',
                'date',
                true
            )
        );

        const priorityLowDiv = document.createElement('div');
        priorityLowDiv.appendChild(
            createInput('task-priority', 'task-priority', 'task-priority-low', 'radio', true)
        );
        priorityLowDiv.appendChild(createLabel('task-priority-low', 'Low'));

        const priorityMediumDiv = document.createElement('div');
        priorityMediumDiv.appendChild(
            createInput('task-priority', 'task-priority', 'task-priority-medium', 'radio', true)
        );
        priorityMediumDiv.appendChild(createLabel('task-priority-medium', 'Medium'));

        const priorityHighDiv = document.createElement('div');
        priorityHighDiv.appendChild(
            createInput('task-priority', 'task-priority', 'task-priority-high', 'radio', true)
        );
        priorityHighDiv.appendChild(createLabel('task-priority-high', 'High'));

        const priorityFieldset = document.createElement('fieldset');
        const priorityLegend = document.createElement('legend');
        priorityLegend.textContent = 'Select Priority*';
        priorityFieldset.append(priorityLegend, priorityLowDiv, priorityMediumDiv, priorityHighDiv);

        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'btn-task-modal-container';
        buttonDiv.appendChild(createAddButton('btn-add-task'));
        buttonDiv.appendChild(createCancelButton('btn-cancel-task'));

        taskModalDiv.appendChild(titleDiv);
        taskModalDiv.appendChild(descriptionDiv);
        taskModalDiv.appendChild(dueDateDiv);
        taskModalDiv.appendChild(priorityFieldset);
        taskModalDiv.appendChild(createErrorField('task-warning'));
        taskModalDiv.appendChild(buttonDiv);

        taskModalContainer.appendChild(taskModalDiv);
    };

    const removeTaskModal = () => {
        const taskModalContainer = document.getElementById('task-modal-container');
        taskModalContainer.textContent = '';
    };

    const toggleNewTaskButton = (isProject) => {
        const newTaskButton = document.getElementById('btn-new-task');

        if (isProject > 0) {
            newTaskButton.style.display = 'flex';
        } else {
            newTaskButton.style.display = 'none';
        }
    };

    const errorMsgTaskExist = () => {
        const errorMsg = document.getElementById('task-warning');
        errorMsg.textContent = 'Task already exist';
    };

    const errorMsgTaskFieldEmpty = () => {
        const errorMsg = document.getElementById('task-warning');
        errorMsg.textContent = 'Task name is missing';
    };

    return {
        errorMsgProjectExist,
        errorMsgProjectFieldEmpty,
        createProjectModal,
        removeProjectModal,
        updateProjectList,
        removeProjectSelection,
        toggleCheckboxLabelState,
        addTaskHeaderText,
        updateTaskList,
        createTaskModal,
        removeTaskModal,
        toggleNewTaskButton,
        errorMsgTaskExist,
        errorMsgTaskFieldEmpty
    };
})();

export default ui;
