class MyPanel extends HTMLElement {
    #shadow;
    #isOpen = true;

    static observedAttributes = ['header', 'sub-header'];

    constructor() {
        super();
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.#render();
        this.#addToggleHandler();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.#shadow) {
            this.#updateAttribute(name, newValue);
        }
    }


    #render() {
        const header = this.getAttribute('header');
        const subHeader = this.getAttribute('sub-header')
        const currentDate = new Date().toLocaleDateString('ru-RU');

        this.#shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .panel {
                    border: 2px solid #9ACD32;
                    border-radius: 8px;
                    margin: 20px;
                    background: white;
                }
                
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #f0f8f0;
                    padding: 16px;
                    border-bottom: 2px solid #9ACD32;
                    font-weight: bold;
                    font-size: 18px;
                    color: #2F4F4F;
                }
                
                .panel-header-content {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                
                .panel-subheader {
                    font-size: 14px;
                    font-weight: normal;
                    color: #8e8e8e;
                    margin: 0;
                }
                
                .panel-footer {
                    padding: 10px 16px;
                    border-top: 1px solid #e0e0e0;
                    text-align: right;
                    font-size: 16px;
                    color: #8e8e8e;
                    background: #f9f9f9;
                    border-radius: 0 0 6px 6px;
                }
                
                .toggle-button {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                }
                
                .panel-content {
                    padding: 20px;
                    display: block;
                }

                .panel-content.hidden {
                    display: none;
                }
            </style>
            
            <div class="panel">
                <div class="panel-header">
                    <div class="panel-header-content">
                        <span class="panel-title">${header}</span>
                        ${subHeader ? `<span class="panel-subheader">${subHeader}</span>` : ''}
                    </div>
                    <button class="toggle-button">-</button>
                </div>
                
                <div class="panel-content">
                    <slot></slot>
                </div>
                
                <div class="panel-footer">
                    Создано: ${currentDate}
                </div>
            </div>
        `;
    }

    #updateAttribute(name, value) {
        if (name === 'header') {
            const titleElement = this.#shadow.querySelector('.panel-title');
            if (titleElement) {
                titleElement.textContent = value || '';
            }
        } else if (name === 'sub-header') {
            let subHeaderElement = this.#shadow.querySelector('.panel-subheader');

            if (value) {
                if (!subHeaderElement) {
                    const headerContent = this.#shadow.querySelector('.panel-header-content');
                    if (headerContent) {
                        subHeaderElement = document.createElement('span');
                        subHeaderElement.className = 'panel-subheader';
                        headerContent.appendChild(subHeaderElement);
                    }
                }
                if (subHeaderElement) {
                    subHeaderElement.textContent = value;
                }
            } else {
                if (subHeaderElement) {
                    subHeaderElement.remove();
                }
            }
        }
    }

    #addToggleHandler() {
        const toggleButton = this.#shadow.querySelector('.toggle-button');
        const content = this.#shadow.querySelector('.panel-content');

        toggleButton.addEventListener('click', () => {
            this.#isOpen = !this.#isOpen;
            content.classList.toggle('hidden');
            toggleButton.textContent = this.#isOpen ? '-' : '+';
        });
    }
}

customElements.define('my-panel', MyPanel);