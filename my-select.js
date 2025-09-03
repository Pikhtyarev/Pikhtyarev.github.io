class MySelect extends HTMLElement {
    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;

    constructor() {
        super();
        console.log('Hello World');
    }

    connectedCallback() {
        this.#createTemplate();
        this.#processOptions();
    }

    #processOptions() {
        const optionElements = Array.from(this.querySelectorAll('option'));
        const valueToTextMap = optionElements.reduce((acc, option) => {
            acc[option.value] = option.textContent;
            return acc;
        }, {});

        const optionsArray = Object.entries(valueToTextMap).map(([value, text]) => ({ value, text }));
        const builtOptionsBox = this.#renderOptions(optionsArray);
        this.#optionsBox.replaceWith(builtOptionsBox);
        this.#optionsBox = builtOptionsBox;
        optionElements.forEach((el) => el.remove());
    }

    #createTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
            <button class="select-button">Кнопка</button>
            <div class="select-popup">
                <input class="select-popup-search" placeholder="Search..." />
                <div class="select-popup-options"></div>
            </div>
        `;

        this.append(template.content.cloneNode(true));

        this.#selectButton = this.querySelector('.select-button');
        this.#selectPopup = this.querySelector('.select-popup');
        this.#selectPopupSearch = this.querySelector('.select-popup-search');
        this.#optionsBox = this.querySelector('.select-popup-options');
    }

    #renderOptions(options) {
        const listTemplate = document.createElement('template');
        const container = document.createElement('div');
        container.className = 'select-popup-options';

        options.forEach(({ value, text }) => {
            const optionTemplate = document.createElement('template');
            optionTemplate.innerHTML = `
                <label class="option" data-value="${value}"><input type="checkbox"/>${text}</label>
            `;
            container.append(optionTemplate.content.cloneNode(true));
        });

        listTemplate.content.append(container);
        return listTemplate.content.firstElementChild;
    }
}

const currentScript = document.currentScript;
const componentName = currentScript.dataset.name;

customElements.define(componentName, MySelect);
