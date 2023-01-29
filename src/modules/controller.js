import ui from './ui';
import { Project, projectArray } from './project';

const controller = (() => {
    const setProjectSelectionEventListener = () => {
        // Select the newly added project by default
        const projectItemList = document.querySelectorAll('.project-item');
        const projectItem = document.querySelectorAll('.project-item-left');
        const projectField = document.getElementById('project-field');
        const buttonNewTaskContainer = document.getElementById('btn-new-task-container');
        const firstProjectItem = projectField.firstChild;
        const firstProjectLeftButton = projectField.firstChild.firstChild;

        ui.removeProjectSelection(projectItemList);
        firstProjectItem.classList.add('item-selected');
        buttonNewTaskContainer.classList.replace(
            'btn-new-task-container-inactive',
            'btn-new-task-container-active'
        );

        //ui.showProjectInformation(firstProjectLeftButton.children[1].textContent);

        // Set event listener
        projectItem.forEach((project) => {
            project.addEventListener('click', () => {
                ui.removeProjectSelection(projectItemList);
                project.parentNode.classList.add('item-selected');
                //ui.showProjectInformation(project.children[1].textContent);
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
                    // ui.removeProjectInformation();
                }
            });
        });
    };

    const setProjectModalButtonsEventListener = () => {
        const addButton = document.getElementById('btn-add-project');
        const cancelButton = document.getElementById('btn-cancel-project');
        const projectNameInput = document.getElementById('project-name-input');

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
                if (projectArray.getProjects().length > 0) {
                    ui.updateProjectList(projectArray.getProjects(), projectField);
                    setProjectSelectionEventListener();
                    setProjectRemoveEventListener();
                } else {
                    // ui.removeProjectInformation();
                }

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
        });
    };

    const openProjectModalEventListener = () => {
        const newProjectButton = document.querySelector('#btn-new-project');

        // Set event listener
        newProjectButton.addEventListener('click', () => {
            newProjectButton.style.display = 'none';
            ui.createProjectModal();
            setProjectModalButtonsEventListener();
        });
    };

    return { openProjectModalEventListener };
})();

export default controller;
