const template = document.createElement("template")
template.innerHTML = /*html*/`
    <style>
        .leaf-x{
            position: relative;
            width:1rem;
            height: 1.5rem;
        }
        .leaf-x::before{
            content:"";
            position: absolute;
            width:1rem;
            height: 1.5rem;
            background-color:#b7ae8f;
        }
        .leaf-x::after{
            content:"";
            position: absolute;
            top:1rem;
            width:1rem;height:1rem;
            transform:rotate(45deg);
            background-color:#2e317c;
        }
        .leaf-x:active{
            height:2rem;
        }
    </style>
    <div class="leaf-x"></div>
`
class Leaf extends HTMLElement{
    constructor(){
        super();
        this._shadowRoot = this.attachShadow({mode:"closed"});
        this._shadowRoot.appendChild(template.content.cloneNode(true))
    }
}
customElements.define("le-af",Leaf)
