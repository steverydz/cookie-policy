class CookiePolicy extends HTMLElement {
  constructor() {
    super();

    this.template = document.createElement('template');

    const cookiePolicyElement = `
      <div class="cookie-policy">
        <dialog
          tabindex="0"
          open="open"
          role="alertdialog"
          class="p-notification p-notification--cookie-policy"
          aria-labelledby="cookie-policy-title"
          aria-describedby="cookie-policy-content"
        >
          <h1 id="cookie-policy-title" class="u-off-screen">
            Cookie policy notification
          </h1>
          <span
            class="p-notification__content"
            id="cookie-policy-content"
            role="document"
            tabindex="0"
          >
          </span>
        </dialog>
      </div>
    `;

    this.template.innerHTML = '<slot />';
    this.attachShadow({
      mode: 'open',
    });
  }

  /**
   * Set a cookie util
   * @param {string} name - Name of the cookie
   * @param {string} value - Value of the cookie
   * @param {integrer} exdays - When cookie should expire
   */
  setCookie(name, value, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}`;
  }

  /**
   * Get value of specific cookie
   * @param {string} nameParam - Name of the cookie
   */
  getCookie(nameParam) {
    const name = `${nameParam}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  connectedCallback() {
    const duration = this.getAttribute('duration');

    if (this.getCookie('_cookies_accepted')) {
      return;
    }

    this.shadowRoot.appendChild(this.template.content.cloneNode(true));

    if (duration) {
      setTimeout(() => {
        this.shadowRoot.innerHTML = '';
      }, duration);
    }
  }
}

customElements.define('cookie-policy', CookiePolicy);
