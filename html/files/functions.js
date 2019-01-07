$( document ).ready(function() {

	class ProgressRing extends HTMLElement {
		constructor() {
			super();
			const background = this.getAttribute('background-color');
			const color = this.getAttribute('color');
			const stroke = this.getAttribute('stroke');
			const radius = this.getAttribute('radius');
			const normalizedRadius = radius - stroke * 2;
			this._circumference = normalizedRadius * 2 * Math.PI;
	
			this._root = this.attachShadow({mode: 'open'});
			this._root.innerHTML = `
				<svg height="${radius * 2}" width="${radius * 2}">
					 <circle
						 stroke="${color}"
						 stroke-dasharray="${this._circumference} ${this._circumference}"
						 style="stroke-dashoffset:${this._circumference}"
						 stroke-width="${stroke}"
						 fill="${background}"
						 r="${normalizedRadius}"
						 cx="${radius}"
						 cy="${radius}"
					/>
				</svg>
	
				<style>
					circle {
						transition: stroke-dashoffset 0.35s;
						transform: rotate(-90deg);
						transform-origin: 50% 50%;
					}
				</style>
			`;
		}
		
		setProgress(percent) {
			const offset = this._circumference - (percent / 100 * this._circumference);
			const circle = this._root.querySelector('circle');
			circle.style.strokeDashoffset = offset; 
		}
	
		static get observedAttributes() {
			return ['progress'];
		}
	
		attributeChangedCallback(name, oldValue, newValue) {
			if (name === 'progress') {
				this.setProgress(newValue);
			}
		}
	}
	
	window.customElements.define('progress-ring', ProgressRing);
});

/*function to hide and show specified elements*/
function hideElement(elemName){
	$(elemName).removeClass('shown');
	$(elemName).addClass('hidden');
}
function showElement(elemName){
	$(elemName).addClass('shown');
	$(elemName).removeClass('hidden');
}


function showMessage(msg, closeAfter){
	document.getElementById("page-content").innerHTML += '<div id="error" class="error-div"><span id="error-text">'+msg+'</span>  <span class="closebtn" onclick="closeError()">&times;</span> </div>';
	console.log(msg);
	if(closeAfter !== undefined){
		setTimeout(function(){
			document.getElementById("error").remove();
		},closeAfter);
	}
}

function getResponse(adr, callback, timeoutCallback, timeout, method){
	if(timeoutCallback === undefined) {
		timeoutCallback = function(){
			showMessage("error loading "+adr);
		};
	}
	if(timeout === undefined) timeout = 8000; 
	if(method === undefined) method = "GET";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4){
			if(xmlhttp.status == 200){
				callback(xmlhttp.responseText);
			}
			else timeoutCallback();
		}
	};
	xmlhttp.open(method, adr, true);
	xmlhttp.send();
	xmlhttp.timeout = timeout;
	xmlhttp.ontimeout = timeoutCallback;
}

/*code the add elem.remove() function*/

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};


function closeError(){
	document.getElementById("error").remove();
}



function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
}


