class MySelect extends HTMLElement {
    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;
    #shadow;
    #allOptions = [];
    #selectedValues = [];
    #selectionCounter;

    constructor() {
        super();
        console.log('Hello World');
    }

    get value() {
        return this.#selectedValues.join(',');
    }

    set value(newValue) {
        if (typeof newValue === 'string') {
            this.#selectedValues = newValue ? newValue.split(',').map(v => v.trim()) : [];
        } else {
            this.#selectedValues = [];
        }
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

        this.#allOptions = Object.entries(valueToTextMap).map(([value, text]) => ({ value, text }));
        const builtOptionsBox = this.#renderOptions(this.#allOptions);
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

                .select-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
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

                .selection-counter {
                    color: #2F4F4F;
                    font-size: 16px;
                    font-weight: bold;
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

            <div class="select-container">
                <button class="select-button">КНОПКА</button>
                <span class="selection-counter">Выбрано: 0</span>
            </div>
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
        this.#selectionCounter = this.#shadow.querySelector('.selection-counter');

        this.#selectButton.addEventListener('click', () => this.#openPopup());
        this.#selectPopupSearch.addEventListener('input', (e) => this.#filterOptions(e.target.value));
        
        document.addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
                this.#closePopup();
            }
        });
    }

    #openPopup() {
        this.#selectPopup.classList.toggle("open");
    }

    #closePopup() {
        this.#selectPopup.classList.remove("open");
    }

    #filterOptions(searchText) {
        const filteredOptions = this.#allOptions.filter(option =>
            option.text.toLowerCase().includes(searchText.toLowerCase())
        );

        const builtOptionsBox = this.#renderOptions(filteredOptions);
        this.#optionsBox.replaceWith(builtOptionsBox);
        this.#optionsBox = builtOptionsBox;
    }

    #toggleSelection(value) {
        const index = this.#selectedValues.indexOf(value);
        if (index > -1) {
            this.#selectedValues.splice(index, 1);
        } else {
            this.#selectedValues.push(value);
        }
        this.#updateText();
    }

    #updateText() {
        this.#selectionCounter.textContent = `Выбрано: ${this.#selectedValues.length}`;
    }

    #renderOptions(options) {
        const listTemplate = document.createElement('template');
        const container = document.createElement('div');
        container.className = 'select-popup-options';

        options.forEach(({ value, text }) => {
            const optionTemplate = document.createElement('template');
            const isSelected = this.#selectedValues.includes(value);
            optionTemplate.innerHTML = `
                <label class="option" data-value="${value}">
                    <input type="checkbox" ${isSelected ? 'checked' : ''}/>
                    ${text}
                </label>
            `;
            container.append(optionTemplate.content.cloneNode(true));
        });

        container.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const value = e.target.closest('.option').dataset.value;
                this.#toggleSelection(value);
            }
        });

        listTemplate.content.append(container);
        return listTemplate.content.firstElementChild;
    }
}

const currentScript = document.currentScript;

const componentName = currentScript.dataset.name;

customElements.define(componentName, MySelect);
