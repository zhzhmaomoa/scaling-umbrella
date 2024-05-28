const template = document.createElement("template");
template.innerHTML = `
	<style>
		.svg-x{
			fill:white;
			width:100%;
		}
		.horizontal-axis{
			stroke:#c0c1c6;
			stroke-width:.1rem;
		}
		.label{
			font-weight:lighter;
		}
		.y-label{
			font-size:.5rem;
		}
		.horizontal-axis-shadow{
			stroke-width:.01rem;
			stroke:rgb( 178,187,190 );
		}
		.line{
			fill:none;
		}
	</style>
	<svg class="svg-x" id="svg-x" viewBox="0 0 1000 300" >
		<line x1="0" y1="20" x2="1000" y2="20" class="horizontal-axis-shadow" ></line>
		<line x1="0" y1="70" x2="1000" y2="70" class="horizontal-axis-shadow" ></line>
		<line x1="0" y1="120" x2="1000" y2="120" class="horizontal-axis-shadow" ></line>
		<line x1="0" y1="170" x2="1000" y2="170" class="horizontal-axis-shadow" ></line>
		<line x1="0" y1="220" x2="1000" y2="220" class="horizontal-axis-shadow" ></line>
		<text x="10" y="260" class="label y-label">0</text>
		<line x1="0" y1="270" x2="1000" y2="270" id="horizontal-axis" class="horizontal-axis" ></line>
	</svg>
`
const colorPalette = ['#ea517f','#ede3e7','#7e2065','#35333c','#126bae']
class ChartSvg extends HTMLElement{
	constructor(){
		super();
		this._shadowRoot = this.attachShadow({mode:"open"});
		this._shadowRoot.appendChild(template.content.cloneNode(true));
		this.$svgX = this._shadowRoot.querySelector( "#svg-x" )
		this.$horizontalAxis = this._shadowRoot.querySelector("#horizontal-axis")
	}
	connectedCallback(){
	}
	static get observedAttributes(){
		return ["data-options"];
	}
	attributeChangedCallback(attrName,oldVal,newVal){
		switch(attrName){
			case 'data-options':
				this.render(newVal);
				break;
			default:
				break;
		}
	}
	render(options){
		const { xAxis, series } = JSON.parse(options);
		const items = xAxis.data;
		const halfLabelWidth = 1000/items.length/2;
		this.generateXAxis(items,halfLabelWidth);
		const maxYValue = this.generateYAxis(series);
		this.generateSeries(series,maxYValue,halfLabelWidth);
	}
	generateXAxis(items,halfLabelWidth){
		for( let i=0 ; i<items.length ; i++ ){
			const text = document.createElementNS('http://www.w3.org/2000/svg', 'text'); 
			text.append( items[i] );
			text.setAttribute( "x" , 2*halfLabelWidth*i + halfLabelWidth );
			text.setAttribute( "y" , "300" );
			text.setAttribute( "text-anchor", "middle" );
			text.classList.add( "label" );
			this.$svgX.append( text );
		} 
	}
	generateYAxis(series){
		let max = 0;
		for(let i=0; i < series.length; i++){
			const {data} = series[i];
			for(let j=0; j<data.length;j++){
				if(max<data[j]){
					max = data[j];
				}
			}
		}
		const temp = Math.pow(10,(max+"").length-1);
		max = Math.ceil(max/temp)*temp;
		const yUnit = max/5;
		for( let i=1; i<=5; i++){
			const text = document.createElementNS('http://www.w3.org/2000/svg', 'text'); 
			text.append(yUnit*i);
			text.setAttribute("x","10");
			text.setAttribute("y",15+50*(5-i));
			text.classList.add("y-label","label");
			this.$svgX.append(text);
		}
		return max;	
	}
	generateSeries(series,maxYValue,halfLabelWidth){
		for(let i=0; i<series.length;i++){
			const {data} = series[i];
			const polyline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
			const points = [];
			for(let j=0;j<data.length;j++){
				const x = 2*halfLabelWidth*j+halfLabelWidth;
				const rate = 1-data[j]/maxYValue;
				const y = 250*rate+20;
				points.push(x+","+y);
			}
			polyline.setAttribute("points",points.join(" "));
			polyline.setAttribute("stroke",colorPalette[i%colorPalette.length])
			polyline.classList.add("line");
			this.$svgX.append(polyline);
		}
	}
}
customElements.define("chart-svg",ChartSvg);
