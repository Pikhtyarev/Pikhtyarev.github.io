class MySelect extends HTMLElement {
    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;
    #shadow;

    constructor() {
        super();
        console.log('Hello World');
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: "open" });
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
            <style>
                :host {
                    position: relative;
                    display: inline-block;
                }
        
                .select-button {
                    background: linear-gradient(135deg, #ADFF2F 0%, #9ACD32 100%);
                    border: 2px solid #9ACD32;
                    border-radius: 12px;
                    padding: 16px 32px;
                    cursor: pointer;
                    color: #2F4F4F;
                    min-width: 200px;
                    text-align: center;
                    font-size: 20px;
                }
                
                .select-button:hover {
                    background: linear-gradient(135deg, #9ACD32 0%, #ADFF2F 100%);
                }
                
                .select-popup {
                    display: none;
                    background: white;
                    border: 2px solid #9ACD32;
                    border-radius: 12px;
                    width: 100%;
                    overflow: hidden;
                }
        
                .select-popup.open {
                    display: block;
                }
                
                .select-popup-search {
                    width: 100%;
                    padding: 16px;
                    border: none;
                    border-bottom: 2px solid #f0f0f0;
                    outline: none;
                    box-sizing: border-box;
                    background: #fafafa;
                }
                
                .select-popup-search:focus {
                    background: white;
                    border-bottom-color: #9ACD32;
                }
                
                .select-popup-options {
                    padding: 8px;
                }
        
                .option {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border-bottom: 1px solid #f8f8f8;
                    margin: 0 8px;
                    border-radius: 8px;
                }
                
                .option:hover {
                    background: linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%);
                }
            </style>

            <button class="select-button">КНОПКА</button>
            <div class="select-popup">
                <input class="select-popup-search" placeholder="Search..." />
                <div class="select-popup-options"></div>
            </div>
        `;

        this.#shadow.appendChild(template.content.cloneNode(true));

        this.#selectButton = this.#shadow.querySelector('.select-button');
        this.#selectPopup = this.#shadow.querySelector('.select-popup');
        this.#selectPopupSearch = this.#shadow.querySelector('.select-popup-search');
        this.#optionsBox = this.#shadow.querySelector('.select-popup-options');

        this.#selectButton.addEventListener('click', () => this.#openPopup());
    }

    #openPopup() {
        this.#selectPopup.classList.toggle("open");
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
