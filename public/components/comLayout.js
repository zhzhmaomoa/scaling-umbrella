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
            <section class="menu-item"><a href="/platform/index.html">memory</a></section>
            <section class="menu-item"><a href="/platform/pages/redemptionCode.html">redemptionCode</a></section>
            <section class="menu-item"><a href="/platform/pages/member.html">member</a></section>
            <section class="menu-item"><a href="/platform/pages/contribution.html">contribution</a></section>
        </aside>
        <main class="main">
            <slot></slot>
        </main>
    </div>
`;
class ComLayout extends HTMLElement{
    constructor(){
        super();
        this._shadowRoot = this.attachShadow({mode:"closed"})
        this._shadowRoot.appendChild(template.content.cloneNode(true))
    }
}
customElements.define("com-layout",ComLayout);
