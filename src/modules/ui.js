const ui = (() => {
    const createTextInput = (inputID) => {
        const projectInput = document.createElement('input');
        projectInput.type = 'text';
        projectInput.id = inputID;

        return projectInput;
    };

    const createErrorField = (errorID) => {
        const errorParagraph = document.createElement('p');
        errorParagraph.id = errorID;

        return errorParagraph;
    };

    const errorMsgProjectExist = () => {
        const errorMsg = document.getElementById('project-warning');
        errorMsg.textContent = 'Project already exist';
    };

    const errorMsgProjectFieldEmpty = () => {
        const errorMsg = document.getElementById('project-warning');
        errorMsg.textContent = 'Project name is missing';
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

    const createProjectModal = () => {
        const projectModalDiv = document.getElementById('project-modal-container');

        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'btn-project-modal-container';

        buttonDiv.appendChild(createAddButton('btn-add-project'));
        buttonDiv.appendChild(createCancelButton('btn-cancel-project'));

        projectModalDiv.appendChild(createTextInput('project-name-input'));
        projectModalDiv.appendChild(createErrorField('project-warning'));
        projectModalDiv.appendChild(buttonDiv);
    };

    const removeProjectModal = () => {
        const projectModalContainer = document.getElementById('project-modal-container');
        const newProjectButton = document.querySelector('#btn-new-project');
        projectModalContainer.textContent = '';
        newProjectButton.style.display = 'block';
    };

    const createProjectItem = (project, index) => {
        const projectItem = document.createElement('li');
        projectItem.classList.add('project-item');

        const buttonProjectItemLeft = document.createElement('button');
        buttonProjectItemLeft.classList.add('project-item-left');

        const projectItemIcon = document.createElement('span');
        projectItemIcon.classList.add('material-symbols-outlined');
        projectItemIcon.textContent = 'checklist';

        const projectName = document.createElement('p');
        projectName.textContent = project.getName();

        const buttonProjectItemRight = document.createElement('button');
        buttonProjectItemRight.classList.add('project-item-right');
        buttonProjectItemRight.setAttribute('data-index', `${index}`);

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

    return {
        errorMsgProjectExist,
        errorMsgProjectFieldEmpty,
        createProjectModal,
        removeProjectModal,
        updateProjectList,
        removeProjectSelection
    };
})();

export default ui;
