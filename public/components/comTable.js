const template = document.createElement("template")
template.innerHTML = /*html*/`
	<link rel="stylesheet" href="/public.css"/>
    <style>
        .table-x{
            padding:0 1rem;
        }
        .table{
            border-collapse: collapse;
            width: 100%;
        }
        .caption{
            margin: 1rem 0;
        }
        th, td {
            padding: 0.25rem;
            text-align: left;
            border: 1px solid #ccc;
            height: 3rem;
        }
        .table-row .input{
            display: none;
        }
        .table-row.active .input{
            display: inline-block;
        }
        .table-row.active .text{
            display: none;
        }
        .table-img{
            object-fit: contain;
            height: 100%;
            vertical-align: middle;
        }
        .operation-btn{
            display: none;
        }
        .operation-btn.active{
            display: inline-block;
        }
        .tdInTfoot{
            border: 0;
            padding: 0;
            position: relative;
            height: 0;
        }
        .leaf{
            position:absolute;
            top:0;
        }
        .leaf:nth-child(2){
            right: 1rem;
        }
        .leaf.inActive{
            visibility: hidden;
        }
    </style>
    <div  class="table-x" id="table-x">
        <form id="addForm"></form>
        <section id="editForms"></section>
        <table class="table">
            <caption id="caption" class="caption"></caption>
            <thead>
                <tr id="theadContent">
                </tr>
            </thead>
            <tbody id="tbody">

            </tbody>
            <tfoot>
                <tr>
                    <td class="tdInTfoot">
                        <com-leaf class="leaf" id="leafLeft"></com-leaf>
                        <com-leaf class="leaf" id="leafRight"></com-leaf>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
`
import "/components/comLeaf.js"
import {throttle} from "/common.js"
class ComTable extends HTMLElement{
    constructor(){
        super();
        this._shadowRoot = this.attachShadow({mode:"closed"})
        this._shadowRoot.appendChild(template.content.cloneNode(true))
        this.$caption = this._shadowRoot.querySelector("#caption")
        this.$theadContent = this._shadowRoot.querySelector("#theadContent")
        this.$tbody = this._shadowRoot.querySelector("#tbody")
        this.$addForm = this._shadowRoot.querySelector("#addForm")
        this.$tdInTfoot = this._shadowRoot.querySelector(".tdInTfoot")
        this.tableStructure = {};
        this.tableStructureKeys = [];
        this.pageNum = 1;
        this.pageSize = 5;
        this.queryResult = [];
        this.asyncQuery=async function(){};
        this.asyncAdd=async function(){};
        this.asyncEdit=async function(){};
        this.asyncDeleteOne=async function(){};
    }
    static get observedAttributes(){
        return ['caption',"content"]
    }
    attributeChangedCallback(attrName,oldVal,newVal){
        switch(attrName){
            case 'caption':
                this.handleSetCaption(newVal)
                break;
            case 'content':
                const {fields,events} = JSON.parse(newVal);
                console.log(newVal)
                this.handleSetEvents(events)
                this.handleTbody(fields);
                break;
        }
    }
    handleSetCaption(newCaption){
        this.$caption.replaceChildren(newCaption);
    }
    async handleTbody(newVal){
        this.tableStructure = newVal;
        this.tableStructureKeys = Object.keys(this.tableStructure);
        this.$tdInTfoot.setAttribute("colspan",this.tableStructureKeys.length+1)
        this.queryResult =await this.asyncQuery(this.pageNum,this.pageSize);
        this.$tbody.replaceChildren();
        this.handleSetThead();
        this.handleSetQueryResult()
        if(this.pageNum === 1){
            this.handleSetAddingRow()
        }
    }
    handleSetThead(){
        for(let textNode of this.tableStructureKeys){
            const th = document.createElement("th");
            th.append(textNode);
            this.$theadContent.append(th);
        }
        const th = document.createElement("th");
        th.append("operation");
        this.$theadContent.append(th)
    }
    handleSetAddingRow(){
        const formId = this.$addForm.getAttribute("id")
        const row0 = this.$tbody.insertRow(0);
        let index = 1;
        for(let [eleName,properties] of Object.entries(this.tableStructure)){
            if(eleName==='id'){
                const cell0 = row0.insertCell(0);
                cell0.append("add")
            }else{
                const cell = row0.insertCell(index);
                const input = document.createElement("input")
                input.setAttribute("name",eleName);
                input.setAttribute("form",formId);
                for(let [attributeName,attributeValue] of Object.entries(properties)){
                    input.setAttribute(attributeName,attributeValue)
                }   
                cell.append(input)
                index++;
            }
        }
        const saveBtn = document.createElement("button");
        saveBtn.append("save");
        saveBtn.setAttribute("form",formId)
        const cell = row0.insertCell(index);
        cell.append(saveBtn)
    }
    handleSetQueryResult(){
        for(let i = 0; i < this.queryResult.length; i++){
            const row = this.$tbody.insertRow(i);
            let cellIndex = 0;
            for(let j of this.tableStructureKeys){
                const text = document.createElement("span");
                text.append(this.queryResult[i][j])
                const cell = row.insertCell(cellIndex)
                cell.append(text);
                cellIndex++;
            }
            const cell = row.insertCell(cellIndex)
            cell.append("操作")
        }
    }
    handleSetEvents(events){
        const {asyncQuery,asyncAdd,asyncEdit,asyncDeleteOne} = events;
        this.asyncQuery=new Function('return '+asyncQuery)();
        this.asyncAdd=new Function('return '+asyncAdd)();
        this.$addForm.addEventListener("submit",(e)=>{
            e.preventDefault();
            throttle(async ()=>{
               await this.asyncAdd(this.$addForm);
               this.handleTbody();
            })
        })
        this.asyncEdit=new Function('return '+asyncEdit)();
        this.asyncDeleteOne=new Function('return '+asyncDeleteOne)();
    }
}
customElements.define("com-table",ComTable);
