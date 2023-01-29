import ui from './ui';
import { Project, projectArray } from './project';

const controller = (() => {
    const projectModalButtonsEventListener = () => {
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
                    //setProjectSelectionEvent();
                    //setProjectRemoveEvent();
                } else {
                    ui.removeProjectInformation();
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
        const newProjectButton = document.querySelector('.btn-new-project');

        // Set event listener
        newProjectButton.addEventListener('click', () => {
            newProjectButton.style.display = 'none';
            ui.createProjectModal();
            projectModalButtonsEventListener();
        });
    };

    return { openProjectModalEventListener };
})();

export default controller;
