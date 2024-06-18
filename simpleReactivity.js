let compoundBill = { 
    electricity: 50,
    water: 10,
    internet: 40
};


let total = 0;

let currentDependentFunction = null;

class PropertyDependencyTracker {
    constructor() {
        this.subscribers = [];
    }

    subscribe() {
        if(currentDependentFunction && !this.subscribers.includes(currentDependentFunction)) {
            this.subscribers.push(currentDependentFunction);
        }
    }

    notify() {
        this.subscribers.forEach((subscribedFunc) => subscribedFunc());
    }
}

Object.keys(compoundBill).forEach((propertyName) => {
    let propertyValue = compoundBill[propertyName];

    const dependencyTracker = new PropertyDependencyTracker();

    Object.defineProperty(compoundBill, propertyName, {
        get: () => {
            dependencyTracker.subscribe();
            return propertyValue;
        },
        set: (newValue) => {
            propertyValue = newValue;
            dependencyTracker.notify();
        }
        
    })
})

const watcher = (dependentFunc) => {
    currentDependentFunction = dependentFunc;
    dependentFunc();
    currentDependentFunction = null;
}

watcher(() => {
    const { electricity, water, internet } = compoundBill;
    total = electricity + water + internet;
});




