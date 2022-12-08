class WcRelogio extends HTMLElement {
  static observedAttributes = ["tipo"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.atualizaRelogio();

    this.intervalId = setInterval(() => {
      this.atualizaRelogio();
    }, 1000);
  }

  disconnectedCallback() {
    clearInterval(this.intervalId);
  }

  attributeChangedCallback() {
    this.atualizaRelogio();
  }

  atualizaRelogio() {
    let analogico = this.getAttribute("tipo") === "analogico";
    if (analogico) {
      this.atualizaRelogioAnalogico();
    } else {
      this.shadowRoot.textContent = getHoraFormatada();
    }
  }

  atualizaRelogioAnalogico() {
    let date = new Date();
    let s = date.getSeconds();
    let m = date.getMinutes() + s / 60;
    let h = (date.getHours() % 12) + m / 60;

    let marcas = "";
    for (let angulo = 0; angulo < 360; angulo += 6) {
      if (angulo % 30 === 0) {
        let hora = angulo / 30;
        let rad = (angulo / 360) * 2 * Math.PI - Math.PI / 2;
        let x = Math.cos(rad) * 35;
        let y = Math.sin(rad) * 35;
        marcas += `<path transform="rotate(${angulo})" d="M 0 -42 v -3" stroke="red" />\n`;
        marcas += `<text text-anchor="middle" dominant-baseline="middle" font-size="10px" x="${x}" y="${y}" stroke="none">${hora}</text>\n`;
      } else {
        marcas += `<path transform="rotate(${angulo})" d="M 0 -43 v -2" stroke-width="1" />\n`;
      }
    }

    this.shadowRoot.innerHTML = `
      <svg width="100" height="100">
        <g transform="translate(50, 50)" stroke="black" stroke-width="2">
          ${marcas}
          <circle cx="0" cy="0" r="45" fill="none" />

          <path transform="rotate(${
            h * (360 / 12)
          })" d="M 0 0 v -35" stroke-width="3" />
          <circle cx="0" cy="0" r="3" fill="black" stroke="none" />

          <path transform="rotate(${m * (360 / 60)})" d="M 0 0 v -40" />

          <path transform="rotate(${
            s * (360 / 60)
          })" d="M 0 0 v -40" stroke="red" />
          <circle cx="0" cy="0" r="2" fill="red" stroke="none" />
        </g>
      </svg>
    `;
  }
}

function getHoraFormatada() {
  let date = new Date();
  let h = String(date.getHours()).padStart(2, "0");
  let m = String(date.getMinutes()).padStart(2, "0");
  let s = String(date.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;

  //return date.toLocaleTimeString();
}

customElements.define("wc-relogio", WcRelogio);
