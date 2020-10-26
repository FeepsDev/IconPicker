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
			this.selectedCategories = [];
			this.searchValue = "";
			this.selectedInput = null;
			
			var pickerDiv = document.createElement("div");
			pickerDiv.classList.add("faPicker");
			document.body.appendChild(pickerDiv);
			this.pickerDiv = pickerDiv;
			
			this.searchBar = document.createElement("input");
			this.searchBar.classList.add("faPicker-searchBar");
			this.searchBar.setAttribute("type", "text");
			this.searchBar.setAttribute("placeholder", "Search...");
			this.pickerDiv.appendChild(this.searchBar);
			
			var self = this;
			const inputHandler = function(e){
				const val = e.target.value;
				self.searchValue = val.toLowerCase().trim();
				self.updateIcons();
			}
			this.searchBar.addEventListener("input", inputHandler);
			this.searchBar.addEventListener("propertychange", inputHandler); // IE8
			
			var group = document.createElement("div");
			group.classList.add("faPicker-container");
			this.pickerDiv.appendChild(group);
			
			this.catList = document.createElement("div");
			this.catList.classList.add("faPicker-categoriesList", "faPicker-hideScroll");
			group.appendChild(this.catList);
			
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
				self.selectedInput = this;
			};
		}
		
		addCategory(category){
			this.categories.push(category);
		}
		
		update(){
			this.updateCategories();
			this.updateIcons();
		}
		
		updateCategories(){
			while (this.catList.hasChildNodes()) {
				this.catList.removeChild(this.catList.lastChild); // Remove children
			}
			
			var ul = document.createElement("ul");
			
			for(const key in this.categories){
				var category = this.categories[key];
				
				var li = document.createElement("li");
				li.innerHTML = category.name;
				
				var self = this;
				li.addEventListener("click", function(){ // Add click listener here
					if (this.classList.contains("active")){
						this.classList.remove("active");
						
						const index = self.selectedCategories.indexOf(key);
						if (index > -1) {
							self.selectedCategories.splice(index, 1);
						}
					}else{
						this.classList.add("active");
						self.selectedCategories.push(key);
					}
					
					self.updateIcons();
				});
				
				ul.appendChild(li);
			}
			
			this.catList.appendChild(ul);
		}
		
		// This function rebuild the DOM objects.
		updateIcons(){
			while (this.iconsDiv.hasChildNodes()) {
				this.iconsDiv.removeChild(this.iconsDiv.lastChild); // Remove children
			}
			
			var test  = document.createElement("div");
			var table = document.createElement("table");
			var tBody = document.createElement("tBody");
			table.appendChild(tBody);
			
			var createdIcons = 0;
			var tr;
			for(var catKey in this.categories){
				var category = this.categories[catKey];
				
				if(this.searchValue.length === 0){
					if(this.selectedCategories.length !== 0){
						if(!this.selectedCategories.includes(catKey)){
							continue;
						}
					}
				}


				for(var key in category.icons){
					const icon = category.icons[key];
					
					
					if(this.searchValue.length !== 0){
						var found = false;
						
						if(icon.name.indexOf(this.searchValue) > -1){
							found = true;
						}else{
							for(const searches of icon.searchTerms){
								if (searches.indexOf(this.searchValue) > -1) {
									found = true;
									break;
								}
							}
						}
						
						if(!found){
							continue;
						}
					}
	
					
					for(var style of icon.styles){
						if(createdIcons % 6 == 0){
							tr = document.createElement("tr");
							tBody.appendChild(tr);
						}
						
						// Create the icon DOM
						const td = document.createElement("td");
						tr.appendChild(td);
						
						const btn = document.createElement("button");
						btn.classList.add("faPicker-btn");
						td.appendChild(btn);

						const i = document.createElement("i");
						i.classList.add(corresponding_classes[style]);
						i.classList.add("fa-" + icon.name);
						btn.appendChild(i);
						
						var self = this;
						btn.addEventListener("click", function(){ // Add click listener here
							self.selectedInput.value = i.className;
						});
						
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
