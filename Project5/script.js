const list = document.getElementById("list");
const carousel = document.getElementById("carousel");
const itemDetailedView = document.getElementById("item-detailed-view");
const popupOverlay = document.getElementById("overlay")
const itemDetailedViewCloseButton = document.getElementById("item-detailed-view--close");
let apiRequest = new XMLHttpRequest();

apiRequest.open('GET', 'http://localhost:3000/api/furniture/');
apiRequest.send();

apiRequest.onreadystatechange = () => {
	if (apiRequest.status === 404) {
		// handle "Not Found"
		// returned
	}
	if (apiRequest.readyState === 4) {
		const response = JSON.parse(apiRequest.response);
		// list.textContent = response[1].varnish;

		// handle a case when fewer than 3 items are returned
		for (let i = 0; i < 3; i++) {
			addElementCarousel(response[i], i);
		}
		for (let item of response) {
			addImg(item);
		}
	}

	const openDetailedView = document.querySelectorAll(".list-item");

	for (let i = 0; i < openDetailedView.length; i++) {
		openDetailedView[i].addEventListener('click', () => {
			// const item = document.querySelector(openDetailedView[i]);
			console.log(openDetailedView[i].dataset.id);

			itemDetailedView.classList.add('item-detailed-view-active');
			popupOverlay.classList.add('overlay-active');
			detailedView(openDetailedView[i]);
		});
	}
};

function detailedView(item) {
	if (item == null) return;

	const id = item.dataset.id;
	const name = item.dataset.name;
	const description = item.dataset.description;
	const price = item.dataset.price;
	const varnish = item.dataset.varnish;
	const img = item.dataset.img;
		
	const popupWindowTitle = document.getElementById('item-detailed-view-header--title');
	const popupWindowPrice = document.getElementById('item-detailed-view-body--price');
	const popupWindowDescription = document.getElementById('item-detailed-view-body--description');
	const popupWindowVarnish = document.getElementById('item-detailed-view-body--varnish');
	const popupWindowImg = document.getElementById('item-detailed-view-body--img');

	const form = document.createElement("form");
	form.id = "varnishOption";
	const submit = document.createElement("input");

	popupWindowTitle.innerHTML = name;
	popupWindowPrice.innerHTML = price + "$";
	popupWindowDescription.innerHTML = description;
	popupWindowImg.src = img;

	const colours = varnish.split(",");

	// const chosenVarnish = "";

	for (let colour = 0; colour < colours.length; colour++) {
		const varnishRadio = document.createElement("input");
		const varnishRadioLabel = document.createElement("label");
		const lineBreak = document.createElement("br");

		varnishRadio.classList.add("mr-2");

		varnishRadio.type = "radio";
		varnishRadio.id = colours[colour];
		varnishRadio.value = colours[colour];
		varnishRadio.name = "varnish";
		varnishRadio.setAttribute("onClick", "changeVarnish(this.value)");

		varnishRadioLabel.for = colours[colour];
		varnishRadioLabel.innerHTML = colours[colour];

		

		form.appendChild(varnishRadio);
		form.appendChild(varnishRadioLabel);
		form.appendChild(lineBreak);
	}


	submit.type = "submit";
	submit.value = "Add to cart";

	// ==========
	// Lesson learned: cannot change 'onclick' attribute by accessing it directly (submit.onclick), like others...
	// ==========
	submit.setAttribute("onClick", "addToCart()");

	form.appendChild(submit);

	popupWindowVarnish.appendChild(form);
	


	itemDetailedView.classList.add('active');
	popupOverlay.classList.add('active');

	itemDetailedViewCloseButton.addEventListener('click', () => {
		closePopupWindow();
		form.remove();
	})
}

function changeVarnish(newColour) {
	console.log(newColour);
}

function addToCart() {
	event.preventDefault();
	console.log("added to cart");
}

function closePopupWindow () {
	itemDetailedView.classList.remove('item-detailed-view-active');
	popupOverlay.classList.remove('overlay-active');
}


function addElementCarousel(item, itemNumber) {
	// create product div
	let product = document.createElement("div");
	product.className += "carousel-item";

	if (itemNumber === 0) product.classList.add("active");

	const img = document.createElement("img");
	img.src = item.imageUrl;
	img.className += "d-block mx-auto w-100";
	// add alt
	product.appendChild(img);
	carousel.appendChild(product);
}
function addImg(item) {
	const product = document.createElement("a");
	product.className += "container list-item col-4 border p-2";
	product.style.height = "250px";
	product.style.width = "250px";
	product.setAttribute("data-id", item._id);
	product.setAttribute("data-price", item.price);
	product.setAttribute("data-description", item.description);
	product.setAttribute("data-varnish", item.varnish);
	product.setAttribute("data-name", item.name);
	product.setAttribute("data-img", item.imageUrl);
	//product.href = "item.html";

	const img = document.createElement("img");
	img.src = item.imageUrl;
	img.className += "mx-auto h-100 w-100 list-item-image";
	// add alt
	product.appendChild(img);

	const title = document.createElement("div");
	title.className += "product-toggle-title";
	// these two are separate elements to enable CSS transformation
	const h3 = document.createElement("h3");
	h3.className += "product-toggle-title--title";
	h3.innerHTML = item.name;
	title.appendChild(h3);
	product.appendChild(title);

	list.appendChild(product);
}

function addElement(item) {
	// create product div
	let product = document.createElement("div");
	product.className += "list-item col-4 border p-2";

	product.setAttribute("data-id", item._id);
	// product.appendChild(addRow("ID", item._id));
	product.appendChild(addRow("Name", item.name));
	product.appendChild(addRow("Varnish", item.varnish));
	product.appendChild(addRow("Price", item.price));
	product.appendChild(addRow("Description", item.description));
		
		// product.innerHTML = "Product ID: " + item._id + '<br />' + "Varnish: " + item.varnish + '<br />' + "name: " + item.name + '<br />' + "price: " + item.price + "$" + '<br />' + "description: " + item.description + '<br />' + '<br />';
	list.appendChild(product);
}

function addRow(name, arg) {
	let row = document.createElement("div");
	const lowerCaseName = name.toLowerCase();
	row.className += "row " + lowerCaseName;

	// add dolar sign
	if (name === "Price") arg += "$";

	let col1 = addCol(name, true);
	let col2 = addCol(arg, false);

	row.appendChild(col1);
	row.appendChild(col2);

	return row;
}

function addCol(data, title) {
	let col = document.createElement("div");
	col.className += "col-sm ";
	col.innerHTML = data;
	if (title) col.innerHTML += ":";

	return col;
}