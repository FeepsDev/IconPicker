const FAPicker = (function(){
	var corresponding_classes = {
		"solid": "fas",
		"regular": "far",
		"light": "fal",
		"duotone": "fad",
		"brands": "fab"
	};
	
    return function(options={searchBar: false}){
		var pickerDiv = document.createElement("div");
		pickerDiv.classList.add("faPicker");
		document.body.appendChild(pickerDiv);
		
		var icons = [];
		
		const clickListener = function(){
			// Moving
			var rect = this.getBoundingClientRect();
			pickerDiv.style.top = (rect.top + this.offsetHeight) + "px";
			pickerDiv.style.left = rect.left + "px";
			
			//Display
			pickerDiv.style.display = "block";
		}
		
		this.update = function(){
			// Build DOM elements
			var table = document.createElement("table");
			var tBody = document.createElement("tbody");
			table.appendChild(tBody);
			
			var i = 0;
				
			var tr = document.createElement("tr");
			tBody.appendChild(tr);
			console.log(icons);
			
		$.getJSON("https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/icons.json", function(data) {
			
			for(var key in data) {

				for(var style in data[key].styles){
					if (i == 4){
						tr = document.createElement("tr");
						tBody.appendChild(tr);
						
						i = 0;
					}
					var iconD = document.createElement("td");
					tr.appendChild(iconD);	
					iconD.innerHTML = '<button style="width:100%;heigth:100%"><i class="' + corresponding_classes[data[key].styles[style]] + ' fa-' + key + '"></i></button>	';
					i += 1;
				}
			} 
		});
			icons.forEach(function(icon){
				console.log("ic");

			});

			
			pickerDiv.appendChild(table);
		}
		
		this.setIcons = function(i){
			console.log(i);
			icons = i;
		}
		
		this.enable = function(domObj){
			domObj.addEventListener("click", clickListener);
		}
		
		this.disable = function(domObj){
			domObj.removeEventListener("click", clickListener);
		}
		
		// Icon object
		this.Icon = (function(){
			function Icon(faName, availableStyles, searchTerms){
				this.name = faName;
				this.availableStyles = availableStyles;
				this.searchTerms = searchTerms;
			}
			
			return Icon;
		})();
		
		// Category object
		this.Category = (function(){
			function Category(name, icons=[]){
				this.name = name;
				this.icons = icons;
			}
			
			Category.addIcon = function(icon){
				this.icons[icon.name] = icon;
			};
			
			Category.removeIcon = function(icon){
				if(typeof icon == "string"){
					this.icons[icon] = null;
				}else{
					this.icons[icon.name] = null;
				}
			}
			
			return Category;
		})();
	};
})();


