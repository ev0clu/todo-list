const ui = (() => {
    // General UI
    /*const createEllipsisText = (str, maxLength) => {
        if (str.length <= maxLength) {
            return str;
        }
        const truncatedString = str.substring(0, maxLength);
        if (truncatedString.lastIndexOf('.') === -1) {
            return `${truncatedString}...`;
        }
        return `${truncatedString}...`;
    };*/

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

    const createCheckbox = (id, status) => {
        const taskCheckbox = document.createElement('input');
        taskCheckbox.name = id;
        taskCheckbox.id = id;
        taskCheckbox.type = 'checkbox';
        taskCheckbox.checked = status;
        taskCheckbox.classList.add('task-checkbox');

        return taskCheckbox;
    };

    const createSpanButton = (buttonName, buttonType) => {
        const button = document.createElement('button');
        button.classList.add(buttonName);
        const buttonIcon = document.createElement('span');
        buttonIcon.classList.add('material-symbols-outlined');
        buttonIcon.textContent = buttonType;

        button.appendChild(buttonIcon);

        return button;
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

    const createProjectItem = (project, index) => {
        const projectItem = document.createElement('li');
        projectItem.classList.add('project-item');
        projectItem.setAttribute('data-projectindex', `${index}`);

        const buttonProjectItemLeft = createSpanButton('project-item-left', 'checklist');
        const projectName = document.createElement('p');

        projectName.textContent = project.getProjectName();
        // projectName.textContent = project.getProjectName();
        buttonProjectItemLeft.appendChild(projectName);

        const buttonProjectItemRight = createSpanButton('project-item-right', 'delete');

        projectItem.append(buttonProjectItemLeft, buttonProjectItemRight);

        return projectItem;
    };

    // Task UI
    const createTaskHeaderText = (projectName) => {
        const taskContent = document.getElementById('task-content');
        taskContent.children[0].textContent = projectName;
    };

    const createViewTaskModal = (name, details, date, prio, status) => {
        const taskViewContainer = document.getElementById('task-view-container');

        const taskViewDiv = document.createElement('div');
        taskViewDiv.id = 'task-modal-view';

        const taskInfo = document.createElement('div');
        taskInfo.id = 'task-informations';
        const titleDiv = document.createElement('div');
        titleDiv.id = 'task-modal-view-title';
        const title = document.createElement('h1');
        title.textContent = name;
        titleDiv.appendChild(title);

        const descriptionDiv = document.createElement('div');
        descriptionDiv.id = 'task-modal-view-description';
        const descriptionTitle = document.createElement('p');
        descriptionTitle.textContent = 'Description:';
        const description = document.createElement('p');
        description.textContent = details;
        descriptionDiv.append(descriptionTitle, description);

        const dueDateDiv = document.createElement('div');
        dueDateDiv.id = 'task-modal-view-duedate';
        const dueDateTitle = document.createElement('p');
        dueDateTitle.textContent = 'Due Date:';
        const dueDate = document.createElement('p');
        dueDate.textContent = date;
        dueDateDiv.append(dueDateTitle, dueDate);

        const priorityDiv = document.createElement('div');
        priorityDiv.id = 'task-modal-view-priority';
        const priorityTitle = document.createElement('p');
        priorityTitle.textContent = 'Priority:';
        const priority = document.createElement('p');
        priority.textContent = prio;
        priorityDiv.append(priorityTitle, priority);

        taskInfo.appendChild(descriptionDiv);
        taskInfo.appendChild(dueDateDiv);
        taskInfo.appendChild(priorityDiv);

        taskViewDiv.appendChild(createSpanButton('btn-close-view-task-modal', 'cancel'));
        taskViewDiv.appendChild(titleDiv);
        taskViewDiv.appendChild(taskInfo);

        taskViewContainer.appendChild(taskViewDiv);
    };

    const generateID = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    };

    const createTaskItem = (checkStatus, taskName, projectIndex, taskIndex, dueDate, priority) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.setAttribute('data-projectindex', `${projectIndex}`);
        taskItem.setAttribute('data-taskindex', `${taskIndex}`);
        taskItem.classList.add(`priority-${priority}`);

        const taskItemLeft = document.createElement('div');
        taskItemLeft.classList.add('task-item-left');

        const taskItemMiddle = document.createElement('div');
        taskItemMiddle.classList.add('task-item-middle');
        taskItemMiddle.textContent = dueDate;

        const taskItemRight = document.createElement('div');
        taskItemRight.classList.add('task-item-right');

        const taskId = `${projectIndex}${taskIndex}${generateID(10)}`;
        const taskCheckbox = createCheckbox(taskId, checkStatus);

        const taskCheckboxLabel = createLabel(taskId, taskName);

        if (taskCheckbox.checked) {
            taskCheckboxLabel.classList.add('task-done');
        }

        taskItemLeft.append(taskCheckbox, taskCheckboxLabel);

        taskItemRight.append(
            createSpanButton('btn-task-view', 'visibility'),
            createSpanButton('btn-task-edit', 'edit'),
            createSpanButton('btn-task-remove', 'delete')
        );

        taskItem.append(taskItemLeft, taskItemMiddle, taskItemRight);

        return taskItem;
    };

    const replaceTaskItem = (eventTarget, newName, newDueDate, newPriority) => {
        const taskItem = eventTarget;

        taskItem.firstChild.lastChild.textContent = newName;
        taskItem.children[1].textContent = newDueDate;
        taskItem.className = '';
        taskItem.className = `task-item priority-${newPriority}`;
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
        dueDateDiv.appendChild(createLabel('task-duedate-input', 'Due Date*'));
        dueDateDiv.appendChild(
            createInput(
                'task-duedate-input',
                'task-duedate-input',
                'task-duedate-input',
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
        createProjectItem,
        errorMsgTaskExist,
        errorMsgTaskFieldEmpty,
        createTaskHeaderText,
        createTaskModal,
        createTaskItem,
        replaceTaskItem,
        createViewTaskModal
    };
})();

export default ui;
