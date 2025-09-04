class MyPanel extends HTMLElement {
    #shadow;
    #isOpen = true;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({ mode: 'open' });
        this.#render();
        this.#addToggleHandler();
    }

    #render() {
        const header = this.getAttribute('header');
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
                    <span>${header}</span>
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