import { Project, projectArray } from './project';
import Task from './task';
import ui from './ui';

const ProjectData = (name) => {
    let tasks = [];

    return {
        get projectName() {
            return name;
        },
        set addTask(item) {
            tasks.push(item);
        },
        set replaceTaskArray(item) {
            tasks = item;
        },
        get taskArray() {
            return tasks;
        }
    };
};

const storage = (() => {
    /*const storageData = [
        {
            projectData: {
                projectName: '',
                tasks: []
            },
            projectData2: {
                projectName: '',
                tasks: []
            }
        }
    ];*/
    const storageData = [];

    // Save to Local Storage
    const saveLocal = (item, projectIndex, taskIndex, operation) => {
        if (operation === 'add-project') {
            const newProject = ProjectData(item);
            storageData.push(newProject);
        } else if (operation === 'remove-project') {
            storageData.splice(projectIndex, 1);
        } else if (operation === 'add-task') {
            storageData[projectIndex].addTask = item;
        } else if (operation === 'replace-tasks') {
            storageData[projectIndex].replaceTaskArray = item;
        } else if (operation === 'remove-task') {
            const tasks = storageData[projectIndex].taskArray;
            tasks.splice(taskIndex, 1);
            storageData[projectIndex].replaceTaskArray = tasks;
        }

        console.log('save: ', storageData);
        localStorage.setItem('Projects', JSON.stringify(storageData));
    };

    // Restore from Local Storage
    const restoreLocal = () => {
        let isLocalStorageAvailable = false;
        let restoreData = JSON.parse(localStorage.getItem('Projects'));
        //console.log('load: ', restoreData);
        if (restoreData == null) {
            // If localstorage is empty, add default books into the library
            restoreData = [];
        } else {
            isLocalStorageAvailable = true;
            for (let i = 0; i < restoreData.length; i++) {
                const newStorageProject = ProjectData(restoreData[i].projectName);
                storageData.push(newStorageProject);

                const projectField = document.getElementById('project-field');
                const newProject = Project(storageData[i].projectName);
                projectArray.addProject(newProject);
                projectField.appendChild(ui.createProjectItem(newProject, i));

                for (let j = 0; j < restoreData[i].taskArray.length; j++) {
                    const newTask = Task(
                        restoreData[i].taskArray[j].name,
                        restoreData[i].taskArray[j].description,
                        restoreData[i].taskArray[j].dueDate,
                        restoreData[i].taskArray[j].priority,
                        restoreData[i].taskArray[j].status
                    );
                    storageData[i].addTask = newTask;
                    projectArray.getProjects()[i].addTask(newTask);

                    console.log(storageData);
                }
            }
        }
        return isLocalStorageAvailable;
    };

    return { saveLocal, restoreLocal };
})();

export default storage;
