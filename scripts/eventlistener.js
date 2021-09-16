class EventListener {
    constructor(obj, type, listener) {
        this.obj = obj;
        this.type = type;
        this.listener = listener;

        obj.addEventListener(type, listener);
    }

    remove() {
        this.obj.removeEventListener(this.type, this.listener);
    }
}

const defer_listeners = []

function createEventListener(obj, type, listener) {
    defer_listeners.push(new EventListener(obj, type, listener));
}

function removeEventListeners() {
    for (eventListener of defer_listeners) {
        eventListener.remove();
    }
}