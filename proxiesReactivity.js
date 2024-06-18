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

let compoundBill = { 
    electricity: 50,
    water: 10,
    internet: 40
};
const compoundBillPropTracker = new Map();

let total = compoundBill.water + compoundBill.electricity;

Object.keys(compoundBill).forEach((propertyName) => {
    compoundBillPropTracker.set(propertyName, new PropertyDependencyTracker());
});

const untrackedBill = compoundBill;
compoundBill = new Proxy(untrackedBill, {
    get: (bill, propertyName) => {
        compoundBillPropTracker.get(propertyName).subscribe();
        return bill[propertyName];
    },
    set: (bill, propertyName, newValue) => {
        bill[propertyName] = newValue;
        compoundBillPropTracker.get(propertyName).notify();
    }
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




