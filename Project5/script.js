// global constant for selected item, avoiding adding a listener - is it a good practice?
// const furnitureItem = {
// 	id: null,
// 	name: '',
// 	description: '',
// 	price: 0,
// 	img: null,
// 	varnish: {},
// };

let selectedVarnish = '';

let selectedItem = {
	id: null,
	name: '',
	description: '',
	price: 0,
	img: null,
	varnish: {}
};


// session storage
if (isNaN(parseInt(localStorage.getItem('shoppingCart'))))
	localStorage.setItem('shoppingCart', 0);

updateCartItems();

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
			addItm(item);
		}
	}

	const openDetailedView = document.querySelectorAll(".list-item");

	for (let i = 0; i < openDetailedView.length; i++) {
		openDetailedView[i].addEventListener('click', () => {
			itemDetailedView.classList.add('item-detailed-view-active');
			popupOverlay.classList.add('overlay-active');
			detailedView(openDetailedView[i]);
		});
	}
};

function detailedView(item) {
	if (item == null) return;

	//selectedItem = Object.create(furnitureItem);

	// update currently viewed item
	selectedItem.id = item.dataset.id;
	selectedItem.name = item.dataset.name;
	selectedItem.description = item.dataset.description;
	selectedItem.price = item.dataset.price;
	selectedItem.img = item.dataset.img;
	// varnish has to be processes and will be added below
		
	const popupWindowTitle = document.getElementById('item-detailed-view-header--title');
	const popupWindowPrice = document.getElementById('item-detailed-view-body--price');
	const popupWindowDescription = document.getElementById('item-detailed-view-body--description');
	const popupWindowVarnish = document.getElementById('item-detailed-view-body--varnish');
	const popupWindowImg = document.getElementById('item-detailed-view-body--img');

	const form = document.createElement("form");
	form.id = "varnishOption";
	const submit = document.createElement("input");

	popupWindowTitle.innerHTML = item.dataset.name;
	popupWindowPrice.innerHTML = '£' + item.dataset.price;
	popupWindowDescription.innerHTML = item.dataset.description;
	popupWindowImg.src = item.dataset.img;

	const colours = item.dataset.varnish.split(",");

	selectedItem.varnish = {};

	for (let i = 0; i < colours.length; i++) {
		// add varnishes to selectedItem object and initialize added to cart = 0
		const varnish = colours[i];
		selectedItem.varnish[varnish] = 0;

		const varnishRadio = document.createElement("input");
		const varnishRadioLabel = document.createElement("label");
		const lineBreak = document.createElement("br");

		varnishRadio.classList.add("mr-2");

		varnishRadio.type = "radio";
		varnishRadio.id = colours[i];
		varnishRadio.value = colours[i];
		varnishRadio.name = "varnish";
		varnishRadio.setAttribute("onClick", "changeVarnish(this.value)");

		varnishRadioLabel.for = colours[i];
		varnishRadioLabel.innerHTML = colours[i];

		

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
	// submit.addEventListener('click', () => {
	// 	addToCart();
	// });

	form.appendChild(submit);

	popupWindowVarnish.appendChild(form);
	
	itemDetailedView.classList.add('active');
	popupOverlay.classList.add('active');

	itemDetailedViewCloseButton.addEventListener('click', () => {
		closePopupWindow();
		form.remove();
		// reset varnish and selected item
		selectedVarnish = '';
	})
}

function changeVarnish(newColour) {
	selectedVarnish = newColour;
}

function updateCartItems() {
	const cart = document.getElementById('items-in-cart');
	cart.innerHTML = parseInt(localStorage.getItem('shoppingCart'));
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
function addItm(item) {
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
		
	list.appendChild(product);
}

function addRow(name, arg) {
	let row = document.createElement("div");
	const lowerCaseName = name.toLowerCase();
	row.className += "row " + lowerCaseName;

	// add dolar sign
	if (name === "Price") arg = "£"+ arg;

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


// Shopping cart

let updateQuantityBtns = document.getElementsByClassName('update-quantity');

for (let i = 0; i < updateQuantityBtns.length; i++) {
	updateQuantityBtns[i].addEventListener('click', () => {
		updateTotal();
	});
}

function updateTotal() {
	let total = 0;
	const items = document.getElementById('shopping-cart-items').children;
	for (let i = 0; i < items.length; i++) {
		const qtyElement = items[i].getElementsByClassName('shopping-cart-col-quantity-input')[0];

		// check input before updating
		checkInput(qtyElement);

		const qty = qtyElement.value;
		const price = parseFloat(items[i].getElementsByClassName('shopping-cart-col-price')[0].innerHTML.replace('£',''));
		let partial = Math.round(price * qty * 100) / 100;
		total = Math.round((total + partial) * 100) / 100;
	}
	const totalSpan = document.getElementById('shopping-cart-total');
	totalSpan.innerHTML = '£' + total;
}

function checkInput(inputElement) {
	if (isNaN(inputElement.value) || inputElement.value < 0)
		inputElement.value = 0;
}

function updateProductInCart() {
	let itemsInCart = JSON.parse(localStorage.getItem('itemsInCart'));
	if (itemsInCart == null) {
		itemsInCart = {
			[selectedItem.id]: selectedItem
		}
	}
	else {
		// if 'brand new' item is being added to shopping cart
		if (itemsInCart[selectedItem.id] == undefined) {
			itemsInCart = {
				...itemsInCart,
				[selectedItem.id]: selectedItem
			}
		}
	}
	itemsInCart[selectedItem.id].varnish[selectedVarnish] += 1;
	localStorage.setItem('itemsInCart', JSON.stringify(itemsInCart));
}

function addToCart() {
	event.preventDefault();

	// if no varnish selected, prompt user
	if (selectedVarnish == '') {
		alert("Please select varnish");
		return;
	}
	// get no of items already added
	let itemsInCart = parseInt(localStorage.getItem('shoppingCart')) + 1;
	// update local storage and nav
	localStorage.setItem('shoppingCart', itemsInCart);
	updateCartItems();
	updateProductInCart();
}

function checkInput(inputElement) {
	if (isNaN(inputElement.value) || inputElement.value < 0)
		inputElement.value = 0;
}

//
// cart.html
// 

function populateCart() {
	let cart = JSON.parse(localStorage.getItem('itemsInCart'));

	if (cart != null) {
		const itemsList = document.getElementById('shopping-cart-items');
		for (let obj in cart) {
			for (let varn in cart[obj].varnish) {
				if (cart[obj].varnish[varn] > 0) {
					
					const cartRow = document.createElement('div');
					cartRow.className += "shopping-cart-row";
					cartRow.style = "height: 120px";

					const item = document.createElement('div');
					item.className += "shopping-cart-col shopping-cart-col-item";

					const itemImg = document.createElement('img');
					itemImg.className += "mh-100";
					itemImg.style = "width: 120px";
					itemImg.src = cart[obj].img;
					item.appendChild(itemImg);

					const itemName = document.createElement('h6');
					itemName.className += "pl-4";
					itemName.innerHTML = cart[obj].name + " with <span class='cartVarnish'>" + varn + "</span> varnish";
					item.appendChild(itemName);

					const itemQty = document.createElement('div');
					itemQty.className += "shopping-cart-col shopping-cart-col-quantity";
					const itemQtyInput = document.createElement('input');
					itemQtyInput.className += "shopping-cart-col-quantity-input";
					itemQtyInput.type = "number";
					itemQtyInput.value = cart[obj].varnish[varn];
					const itemQtyUpdate = document.createElement('a');
					itemQtyUpdate.className += "update-quantity";
					itemQtyUpdate.href = "#";
					itemQtyUpdate.innerHTML = "Update";

					itemQty.appendChild(itemQtyInput);
					itemQty.appendChild(itemQtyUpdate);

					const itemPrice = document.createElement('div');
					itemPrice.className += "shopping-cart-col shopping-cart-col-price";
					itemPrice.innerHTML = "£" + cart[obj].price;

					cartRow.appendChild(item);
					cartRow.appendChild(itemQty);
					cartRow.appendChild(itemPrice);

					itemsList.appendChild(cartRow);
				}
			}
			
		}
	}

	updateTotal();
}

populateCart();