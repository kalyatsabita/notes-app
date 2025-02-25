if (!customElements.get('loading-indicator')) {
  customElements.define('loading-indicator', class LoadingIndicator extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
        <style>
          .loading {
            display: none; /* Hidden by default */
            margin: 50px auto;
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 2s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
        <div class="loading"></div>
      `;
    }

    connectedCallback() {
      this.shadowRoot.querySelector('.loading').style.display = 'block';
    }
  });
}
