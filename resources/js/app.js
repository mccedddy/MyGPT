//import { sendMessage, startNewChat, handleKeyPress, autoResizeTextarea, initializeChat } from './mygpt.js';

// Dynamic import to support both module and global contexts
import('./mygpt.js').then(module => {
    // Expose only what the HTML needs
    window.sendMessage = module.sendMessage;
    window.startNewChat = module.startNewChat;
    window.handleKeyPress = module.handleKeyPress;
    window.autoResizeTextarea = module.autoResizeTextarea;

    // Initialize on load
    window.addEventListener('load', module.initializeChat);
});
