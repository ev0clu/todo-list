import './assets/style.css';
import event from './modules/event';
import controller from './modules/controller';
import storage from './modules/storage';

//controller.loadDefaultTodoList();
storage.restoreLocal();
event.initialEventListener();
