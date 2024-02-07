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
            background-color:#fbb612;
        }
        .leaf-x::after{
            content:"";
            position: absolute;
            top:1rem;
            width:1rem;height:1rem;
            transform:rotate(45deg);
            background-color:#2e317c;
        }
        .leaf-x:hover .leaf-x::before{
            background-color:black;  
        }
    </style>
    <div class="leaf-x"></div>
`
export default class Leaf extends HTMLElement{
    constructor(){
        super();
        this._shadowRoot = this.attachShadow({mode:"closed"});
        this._shadowRoot.appendChild(template.content.cloneNode(true))
    }
}