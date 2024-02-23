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
        this.$editForms = this._shadowRoot.querySelector("#editForms");
        this.$tdInTfoot = this._shadowRoot.querySelector(".tdInTfoot")
        this.$leafLeft = this._shadowRoot.querySelector("#leafLeft")
		this.$leafRight = this._shadowRoot.querySelector("#leafRight");
        this.tableStructure = {};
        this.tableStructureKeys = [];
        this.pageNum = 1;
        this.pageSize = 5;
        this.queryResult = [];
        this.imgPreviewArr = [];
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
                this.tableStructure = fields;
                this.tableStructureKeys = Object.keys(fields);
                this.handleTbody();
                break;
        }
    }
    handleSetCaption(newCaption){
        this.$caption.replaceChildren(newCaption);
    }
    async handleTbody(){
        this.$tdInTfoot.setAttribute("colspan",this.tableStructureKeys.length+1)
        this.queryResult =await this.asyncQuery(this.pageNum,this.pageSize);
        this.$editForms.replaceChildren();
        this.$tbody.replaceChildren();
        for(let i = 0; i < this.imgPreviewArr.length;i++){
            window.URL.revokeObjectURL(this.imgPreviewArr[i])
        }
        this.handleSetThead();
        this.handleSetQueryResult()
        if(this.pageNum === 1){
            this.handleSetAddingRow()
        }
        this.handleSetLeaf();
    }
    handleSetThead(){
        this.$theadContent.replaceChildren();
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
            for(let [eleName,properties] of Object.entries(this.tableStructure)){
                const input = document.createElement("input")
                input.setAttribute("name",eleName);
                input.setAttribute("form","editFormId"+this.queryResult[i].id);
                let type;
                for(let [attributeName,attributeValue] of Object.entries(properties)){
                    input.setAttribute(attributeName,attributeValue)
                    if(attributeName==='type'){
                        type = attributeValue;
                    }
                }  
                input.setAttribute("value",this.queryResult[i][eleName])
                input.classList.add("input");

                const cell = row.insertCell(cellIndex)
                if(type==='file'){
                    const imgEditing = document.createElement("img");
					imgEditing.classList.add("input","table-img")
					imgEditing.setAttribute("src",this.queryResult[i][eleName])
					input.addEventListener("change",(e)=>{
						const imgPreview = window.URL.createObjectURL(e.target.files[0]);
						this.imgPreviewArr.push(imgPreview)
						imgEditing.setAttribute("src",imgPreview)
					})
					const img = document.createElement("img");
					img.classList.add("table-img","text")
                    img.setAttribute("src",this.queryResult[i][eleName])
                    cell.append(img,input,imgEditing);
                }else{
                    const text = document.createElement("span");
                    if(eleName!=='id'){
                        text.classList.add("text")
                    }
                    text.append(this.queryResult[i][eleName])
                    cell.append(text,input);
                }
                cellIndex++;
            }
            row.classList.add("table-row");
            const cell = row.insertCell(cellIndex)
			const editBtn =this.generateEditBtn(this.queryResult[i].id,row)
            const deleteBtn = this.generateDeleteBtn(this.queryResult[i]);
            cell.append(editBtn,deleteBtn)
        }
    }
    generateEditBtn(rowId,row){
        const editForm = document.createElement("form")
        editForm.setAttribute("id","editFormId"+rowId)
        editForm.addEventListener("submit",(e)=>{
            e.preventDefault();
            throttle(async (e)=>{
                await this.asyncEdit(editForm);
                this.handleTbody();
            })
        })
        this.$editForms.append(editForm)
        const editBtn = document.createElement("button")
        editBtn.append("edit")
        editBtn.classList.add("operation-btn",'active')
        editBtn.addEventListener("click",function(e){
            editBtn.classList.remove("active")
            confirmBtn.classList.add("active")
            cancelBtn.classList.add("active")
            row.classList.add("active");
        })
        const confirmBtn = document.createElement("button")
        confirmBtn.append("save")
        confirmBtn.classList.add("operation-btn")
        confirmBtn.setAttribute("form","editFormId"+rowId);
        const cancelBtn = document.createElement("button")
        cancelBtn.append("cancel");
        cancelBtn.classList.add("operation-btn")
        cancelBtn.addEventListener("click",function(e){
            editBtn.classList.add("active")
            confirmBtn.classList.remove("active")
            cancelBtn.classList.remove("active")
            row.classList.remove("active")
        })
        const x = document.createElement("span");
        x.append(editBtn,confirmBtn,cancelBtn);
        return x;
    }
    generateDeleteBtn(rowData){
        const deleteBtn = document.createElement("button");
        deleteBtn.append("delete");
        deleteBtn.classList.add("operation-btn","active");
        deleteBtn.addEventListener("click",function(e){
            deleteBtn.classList.remove("active");
            confirmBtn.classList.add("active");
            cancelBtn.classList.add("active")
        })
        const confirmBtn = document.createElement("button");
        confirmBtn.append("confirm delete!");
        confirmBtn.classList.add("operation-btn");
        confirmBtn.addEventListener("click",(e)=>{
            throttle(async ()=>{
                await this.asyncDeleteOne(rowData);
                this.handleTbody();
             })
        })
        const cancelBtn = document.createElement("button");
        cancelBtn.append("repent");
        cancelBtn.classList.add("operation-btn");
        cancelBtn.addEventListener("click",function(e){
            deleteBtn.classList.add("active");
            confirmBtn.classList.remove("active");
            cancelBtn.classList.remove("active")
        })
        const x = document.createElement("span");
        x.append(deleteBtn,confirmBtn,cancelBtn);
        return x;
    }
    handleSetLeaf(){
        this.$leafLeft.classList.remove("inActive");
        this.$leafRight.classList.remove("inActive");
        if(this.pageNum===1){
            this.$leafLeft.classList.add("inActive");
        }
        if(this.queryResult.length < this.pageSize){
            this.$leafRight.classList.add("inActive")
        }
    }
    handleSetEvents(events){
        const {asyncQuery,asyncAdd,asyncEdit,asyncDeleteOne} = events;
        this.asyncQuery=new Function('return '+asyncQuery)();
        this.$leafLeft.addEventListener("click",()=>{
            this.pageNum--;
            this.handleTbody()
        })
        this.$leafRight.addEventListener("click",()=>{
            this.pageNum++;
            this.handleTbody()
        })
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
    disconnectedCallback(){
        for(let i = 0; i < this.imgPreviewArr.length;i++){
            window.URL.revokeObjectURL(this.imgPreviewArr[i])
        }
    }
}
customElements.define("com-table",ComTable);
