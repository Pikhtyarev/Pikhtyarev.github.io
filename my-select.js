class MySelect extends HTMLElement {
    constructor() {
        super();
        console.log('Hello World');
    }
}

const currentScript = document.currentScript;
const componentName = currentScript.dataset.name;

customElements.define(componentName, MySelect);
