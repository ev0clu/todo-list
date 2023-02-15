import './assets/style.css';
import event from './modules/event';
import controller from './modules/controller';
import storage from './modules/storage';

const isLocalStorageAvailable = storage.restoreLocal();

if (!isLocalStorageAvailable) {
    controller.loadDefaultTodoList();
}

event.initialEventListener();
