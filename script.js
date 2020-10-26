const FAPicker = (function(){
	var self = {};
	
	var corresponding_classes = {
		"solid": "fas",
		"regular": "far",
		"light": "fal",
		"duotone": "fad",
		"brands": "fab"
	};
	
	self.Picker = class {
		constructor(){
			this.categories = [];
			
			var pickerDiv = document.createElement("div");
			pickerDiv.classList.add("faPicker");
			document.body.appendChild(pickerDiv);
			this.pickerDiv = pickerDiv;
			
			this.searchBar = document.createElement("input");
			this.searchBar.classList.add("faPicker-searchBar");
			this.searchBar.setAttribute("type", "text");
			this.searchBar.setAttribute("placeholder", "Search...");
			this.pickerDiv.appendChild(this.searchBar);
			
			var group = document.createElement("div");
			group.classList.add("faPicker-container");
			this.pickerDiv.appendChild(group);
			
			this.categoriesList = document.createElement("div");
			this.categoriesList.classList.add("faPicker-categoriesList", "faPicker-hideScroll");
			group.appendChild(this.categoriesList);
			
			this.iconsDiv = document.createElement("div");
			this.iconsDiv.classList.add("faPicker-iconsList");
			group.appendChild(this.iconsDiv);
			
			this.clickListener = function(){
				console.log("Clicked");
				
				var rect = this.getBoundingClientRect();
				pickerDiv.style.top = (rect.top + this.offsetHeight) + "px";
				pickerDiv.style.left = rect.left + "px";
				
				//Display
				pickerDiv.style.display = "block";
				
				
			};
		}
		
		addCategory(category){
			this.categories.push(category);
		}
		
		// This function rebuild the DOM objects.
		update(){
			this.iconsDiv.innerHTML = ""; // Reset the div
			this.categoriesList.innerHTML = "";
			
			var ul = document.createElement("ul");
			this.categoriesList.appendChild(ul);
			
			var test  = document.createElement("div");
			var table = document.createElement("table");
			var tBody = document.createElement("tBody");
			table.appendChild(tBody);
			
			var createdIcons = 0;
			var tr;
			for(var category of this.categories){
				
				var li = document.createElement("li");
				ul.appendChild(li);
				li.innerHTML = category.name;
				
				
				for(var key in category.icons){
					var icon = category.icons[key];
					
					for(var style of icon.styles){
						if(createdIcons % 6 == 0){
							tr = document.createElement("tr");
							tBody.appendChild(tr);
						}
						
						// Create the icon DOM
						var td = document.createElement("td");
						tr.appendChild(td);
						
						var btn = document.createElement("button");
						btn.classList.add("faPicker-btn");
						td.appendChild(btn);

						var i = document.createElement("i");
						i.classList.add(corresponding_classes[style]);
						i.classList.add("fa-" + icon.name);
						btn.appendChild(i);
						
						createdIcons += 1;
					}
				}
			}
			
			test.appendChild(table);
			this.iconsDiv.appendChild(test);
		}
		
		enable(domObj){
			domObj.addEventListener("click", this.clickListener);
		}
		
		disable(domObj){
			domObj.addEventListener("click", this.clickListener);
		}
	}
	
	self.Icon = class {
		constructor(name, styles, searchTerms){
			this.name = name;
			this.styles = styles;
			this.searchTerms = searchTerms;
		}
	}
	
	self.Category = class {
		constructor(name, icons=[]){
			this.name = name;
			this.icons = icons;
		}
		
		addIcon(icon){
			this.icons[icon.name] = icon;
		}
		
		removeIcon(icon){
			if(typeof icon == "string"){
				this.icons[icon] = null;
			}else{
				this.icons[icon.name] = null;
			}
		}
	}

	return self;
})();
