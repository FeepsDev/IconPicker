IconPicker = (function(){
	const self = {};
	
	const default_options = {
		showCategories: true,
		showSearchBar: true,
		hideOnSelect: true,
		iconsPerRow: 6,
		searchText: "Search an icon...",
		onSelect: function(picker, inputDom, iconDom, icon){
			inputDom.value = iconDom.className;
		}
	};
	self.default_options = default_options;
	
	/*
		Main class that manage DOM objects
	*/
	self.Picker = (function () { // IE doesn't support "class" syntax
		function Picker(options){ // IE doesn't support default parameters
			const a = this; // Used to get a reference to "this" in callback functions (mainly events)
			
			// Options + Default option (IE doesn't have Object.assign function)
			this.options = options || {};
			for (let opt in default_options){
				if (default_options.hasOwnProperty(opt) && !this.options.hasOwnProperty(opt)){
					this.options[opt] = default_options[opt];
				}
			}
			
			// Variables
			this.categories = [];
			this.selectedCategories = [];
			this.searchValue = "";
			this.lastInput = null; // Used to know what was the last input that used the icon picker
			
			// Main div
			{
				this.pickerDiv = document.createElement("div");
				this.pickerDiv.classList.add("iconPicker");
				document.body.appendChild(this.pickerDiv);
			}
			
			// Search Bar
			if(this.options.showSearchBar){
				this.searchBar = document.createElement("input");
				this.searchBar.classList.add("iconPicker-searchBar");
				this.searchBar.setAttribute("type", "text");
				this.searchBar.setAttribute("placeholder", this.options.searchText);
				this.pickerDiv.appendChild(this.searchBar);
				
				const inputHandler = function(e){
					a.searchValue = e.target.value.toLowerCase().trim();
					a.updateIcons();
				}
				
				this.searchBar.addEventListener("input", inputHandler);
				this.searchBar.addEventListener("propertychange", inputHandler); // IE8
			}

			// Group that contains the icons list and the categories list.
			{
				this.mainGroup = document.createElement("div");
				this.mainGroup.classList.add("iconPicker-container");
				this.pickerDiv.appendChild(this.mainGroup);
				
				if(this.options.showCategories){
					this.catList = document.createElement("div");
					this.catList.classList.add("iconPicker-categoriesList");
					this.catList.classList.add("iconPicker-hideScroll");
					this.mainGroup.appendChild(this.catList);
				}

				this.iconsDiv = document.createElement("div");
				this.iconsDiv.classList.add("iconPicker-iconsList");
				this.mainGroup.appendChild(this.iconsDiv);
			}

			this.clickListener = function(){ // Listener used by enable/disable function
				/*
					Display and move the icon picker.
				*/
				
				const rect = this.getBoundingClientRect();
				a.pickerDiv.style.top = (rect.top + this.offsetHeight) + "px";
				a.pickerDiv.style.left = rect.left + "px";
				a.open();
				
				a.lastInput = this;
			};
			
			window.addEventListener("mouseup", function(e){
				// If clicked away from the icon picker, close it
				let target = e.target
				do{
					if(target == a.pickerDiv){
						return; // Ignore
					}
					
					target = target.parentNode;
				}while(target != undefined);
				
				a.close();
			});
		}
		
		/*
			The update functions rebuild the DOM objects
		*/
		
		Picker.prototype.update = function(){
			if(this.options.showCategories){
				this.updateCategories();
			}
			
			this.updateIcons();
		}
		
		Picker.prototype.updateCategories = function(){
			const a = this;
			
			while (this.catList.hasChildNodes()) {
				this.catList.removeChild(this.catList.lastChild); // Remove children
			}
			
			const ul = document.createElement("ul");
			for(let key in this.categories){
				const category = this.categories[key];
				
				const li = document.createElement("li");		
				li.addEventListener("click", function(){ // Add click listener here
					if (this.classList.contains("active")){
						this.classList.remove("active");
						
						// Remove by value the category from the array
						const index = a.selectedCategories.indexOf(key);
						if (index > -1) {
							a.selectedCategories.splice(index, 1);
						}
					}else{
						this.classList.add("active");
						a.selectedCategories.push(key);
					}
					
					a.updateIcons();
				});
				li.innerHTML = category.name;
				ul.appendChild(li);
			}
			
			this.catList.appendChild(ul);
		}
		
		Picker.prototype.updateIcons = function(){
			const a = this;
			
			while (this.iconsDiv.hasChildNodes()) {
				this.iconsDiv.removeChild(this.iconsDiv.lastChild); // Remove children
			}
			
			const scrollDiv  = document.createElement("div"); // Div used to correctly position the scroll bar.
			const table = document.createElement("table");
			const tBody = document.createElement("tBody");
			table.appendChild(tBody);
			
			let createdIcons = 0;
			let alreadyCreated = {}; // Because multiple category can have the same icon, so don't add the same icon two times.
			let tr;
			for(let catKey in this.categories){
				const category = this.categories[catKey];
				
				if(this.searchValue.length === 0){ // If the user is searching something we ignore categories.
					if(this.selectedCategories.length !== 0){
						if(!(this.selectedCategories.indexOf(catKey) > -1)){ // Only show the icons of selected categories.
							continue;
						}
					}
				}

				for(let iconKey in category.icons){
					const icon = category.icons[iconKey];
					
					if(alreadyCreated[icon.id]){
						continue;
					}
					
					/*
						Make the user's search, looking at the icon id and then at the "searchTerms"
					*/
					if(this.searchValue.length !== 0){
						let found = false;
						
						if(icon.id.indexOf(this.searchValue) > -1){
							found = true;
						}else{
							for(let searchKey in icon.searchTerms){
								const search = icon.searchTerms[searchKey];
								if (search.indexOf(this.searchValue) > -1) {
									found = true;
									break;
								}
							}
						}
						
						if(!found){
							continue;
						}
					}
	
					if(createdIcons % this.options.iconsPerRow == 0){
						tr = document.createElement("tr");
						tBody.appendChild(tr);
					}
					
					// Create the icon DOM
					{
						const td = document.createElement("td");
						
						const i = document.createElement("i");
						
						if(Array.isArray(icon.classes)){
							for (let clazz in icon.classes){
								i.classList.add(icon.classes[clazz]);
							}
						}else{
							i.className = icon.classes;
						}
						
						i.innerHTML = icon.content;
						
						
						const btn = document.createElement("button");
						btn.classList.add("iconPicker-btn");
						btn.addEventListener("click", function(){ // Add click listener here
							a.options.onSelect(a, a.lastInput, i, icon);
							
							if(a.options.hideOnSelect){
								a.close();
							}
						});
						
						tr.appendChild(td);
						td.appendChild(btn);
						btn.appendChild(i);
					}

					
					createdIcons += 1;
					alreadyCreated[icon.id] = true;
				}
			}
			
			scrollDiv.appendChild(table);
			this.iconsDiv.appendChild(scrollDiv);
		}
		
		Picker.prototype.addCategory = function(category){
			this.categories.push(category);
		}
		
		Picker.prototype.enable = function(domObj){
			domObj.addEventListener("click", this.clickListener);
		}
		
		Picker.prototype.disable = function(domObj){
			domObj.addEventListener("click", this.clickListener);
		}
		
		Picker.prototype.open = function(){
			this.pickerDiv.style.display = "block";
		}
		
		Picker.prototype.close = function(){
			this.pickerDiv.style.display = "none";
		}
		
		return Picker;
	}());
	
	/*
		Icon class (Act like a data container).
	*/
	self.Icon = (function () {
		function Icon(id, classes, searchTerms, optContent){
			this.id = id;
			this.classes = classes;
			this.searchTerms = searchTerms || [];
			this.content = optContent || "";
		}
		
		return Icon;
	}());
	
	/*
		Category class (Act like a data container).
	*/
	self.Category = (function () {
		function Category(name, icons){
			this.name = name;
			this.icons = icons || [];
		}
		
		return Category;
	}());

	return self;
})();
