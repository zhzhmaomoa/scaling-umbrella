const template = document.createElement("template");
template.innerHTML = /*html*/`
    <style>
        .x{
            display: flex;
            height: 100vh;
        }
        .menu{
            background-color:#248067;
            width:fit-content;
        }
        .menu-item{
            margin:2rem;
            color:white;
        }
        .main{
            width:-moz-available;
            width:-webkit-fill-available;
            width:stretch;
            background-color:#2e317c;
        }
    </style>
    <div class="x">
        <aside class="menu">
            <section class="menu-item">memory</section>
            <section class="menu-item">redemptionCode</section>
            <section class="menu-item">member</section>
            <section class="menu-item">contribution</section>
        </aside>
        <main class="main">
            <slot></slot>
        </main>
    </div>
`;
export default class Layout extends HTMLElement{
    constructor(){
        super();
        this._shadowRoot = this.attachShadow({mode:"closed"})
        this._shadowRoot.appendChild(template.content.cloneNode(true))
    }
}