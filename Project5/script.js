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

const MAX_LIMIT_PER_ITEM = 100;
const MAX_LIMIT_PER_ORDER = 1000;


// local storage
if (isNaN(parseInt(localStorage.getItem('shoppingCart'))))
	localStorage.setItem('shoppingCart', 0);

updateCartItems();

const list = document.getElementById("list");
const carousel = document.getElementById("carousel");
const itemDetailedView = document.getElementById("item-detailed-view");
const popupOverlay = document.getElementById("overlay")
const itemDetailedViewCloseButton = document.getElementById("item-detailed-view--close");

const API = 'http://localhost:3000/api/furniture/';
let apiRequest = new XMLHttpRequest();

if ($('body').is('.home-page')) {

	apiRequest.open('GET', API);
	apiRequest.send();

}

apiRequest.onreadystatechange = () => {
	if (apiRequest.status === 404) {
		// handle "Not Found" returned
	}

	if (apiRequest.readyState === 4) {
		const response = JSON.parse(apiRequest.response);

		// i < min(3, response.length)
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

	// === add alt ===
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

// =============
// Shopping cart
// =============

if ($('body').is('.cart-page')) {
	populateCart();
}

function updateTotal() {
	let total = 0;

	if (document.getElementById('shopping-cart-items').children != null) {

		const items = document.getElementById('shopping-cart-items').children;
		for (let i = 0; i < items.length; i++) {
			const qtyElement = items[i].getElementsByClassName('shopping-cart-col-quantity-input')[0];

			// check input before updating
			const qty = checkInput(qtyElement.value);
			qtyElement.value = qty;

			const price = parseFloat(items[i].getElementsByClassName('shopping-cart-col-price')[0].innerHTML.replace('£',''));
			let partial = Math.round(price * qty * 100) / 100;
			total = Math.round((total + partial) * 100) / 100;
		}
	}

	const totalSpan = document.getElementById('shopping-cart-total');
	totalSpan.innerHTML = '£' + total;
}

function checkInput(input) {
	if (isNaN(input) || input < 0) {
		return 0;
	}
	else {
		if (input > MAX_LIMIT_PER_ITEM) {
			alert('To order more than 100 units, please contact our customer service');
			return MAX_LIMIT_PER_ITEM;
		}
		else return Math.floor(input);
	}
}

function updateProductInCart(fromCart, newQty = 1) {
	let itemsInCart = JSON.parse(localStorage.getItem('itemsInCart')); 
	let prevQty = 0;

	// if updated doesn't come from the cart page, it means the item is already present in local storage object
	if (!fromCart) {
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

		itemsInCart[selectedItem.id].varnish[selectedVarnish] += newQty;
	}
	// Update was made inside the cart
	else {
		itemsInCart[selectedItem.id].varnish[selectedVarnish] != undefined
		prevQty = itemsInCart[selectedItem.id].varnish[selectedVarnish];
		
		itemsInCart[selectedItem.id].varnish[selectedVarnish] = newQty;

		// same item with other varnishes might still be in the cart
		// if not, however, delete the item
		itemsInCart = checkIfDelete(itemsInCart);
	}

	localStorage.setItem('itemsInCart', JSON.stringify(itemsInCart));

	// return the difference between old and new qty - default is 1, unless update came from cart.html
	updateTotalItems(newQty - prevQty);
}

// this function is called when 'Add To Cart' button is clicked
function addToCart() {
	event.preventDefault();

	// prevent ordering more than 1000 items in a single order
	if (totalItemsInCart > MAX_LIMIT_PER_ORDER) {
		alert('For wholesale orders, please contact our customer service');
		return;
	}

	// if no varnish selected, prompt user
	if (selectedVarnish == '') {
		alert("Please select varnish");
		return;
	}

	updateProductInCart(false);
}

function checkIfDelete(itemsInCart) {
	for (let varn in itemsInCart[selectedItem.id].varnish) {
		if (itemsInCart[selectedItem.id].varnish[varn] != 0) {
			return itemsInCart;
		}
	}

	// if we got here, there are no varnishes with this ID in the cart
	itemsInCart[selectedItem.id] = undefined;

	return itemsInCart;

}

// update total number of items in local storage
function updateTotalItems(change) {
	let numberOfItems = totalItemsInCart() + change;
	localStorage.setItem('shoppingCart', numberOfItems);

	// refresh navbar
	updateCartItems();

}

// update number displayed in navbar
function updateCartItems() {
	const cart = document.getElementById('items-in-cart');
	if (cart != null) {
		cart.innerHTML = totalItemsInCart();
	}
}

function totalItemsInCart() {
	return parseInt(localStorage.getItem('shoppingCart'));
}

function populateCart() {
	let cart = JSON.parse(localStorage.getItem('itemsInCart'));

	if (cart != null) {
		const itemsList = document.getElementById('shopping-cart-items');
		for (let obj in cart) {
			for (let varn in cart[obj].varnish) {
				if (cart[obj].varnish[varn] > 0) {
					
					const cartRow = document.createElement('div');
					cartRow.className += "shopping-cart-row";

					// DATASET
					// add dataset for future cart updates
					cartRow.dataset['id'] = cart[obj].id;
					cartRow.dataset['varnish'] = varn;

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
					itemPrice.className += "shopping-cart-col shopping-cart-col-price justify-content-end pr-4";
					itemPrice.innerHTML = "£" + cart[obj].price;

					cartRow.appendChild(item);
					cartRow.appendChild(itemQty);
					cartRow.appendChild(itemPrice);

					itemsList.appendChild(cartRow);
				}
			}
			
		}
		updateTotal();
	}
}

let updateQuantityBtns = document.getElementsByClassName('update-quantity');

for (let i = 0; i < updateQuantityBtns.length; i++) {
	updateQuantityBtns[i].addEventListener('click', () => {
		updateLocalStorage(event.target);
	});
}

// when 'Update' button is clicked in cart.html
function updateLocalStorage(updateButton) {
	let cart = JSON.parse(localStorage.getItem('itemsInCart'));

	// update parent's parent
	const row = updateButton.parentElement.parentElement;

	// THIS HAS GOTTEN OUT OF HAND...
	// USING THE GLOBAL VARIABLE IN THE BEGINNING HAS CREATED PROBLEMS NOW
	// TOO MUCH REFACTORING WOULD BE NECESSARY TO FIX THIS...
	// THEREFORE, I HAVE TO DO IT THE UGLY WAY...
	selectedVarnish = row.dataset.varnish;
	selectedItem.id = row.dataset.id;

	// NOT ideal, but updateTotal checks input, so must be passed first
	updateTotal();

	const qty = updateButton.parentElement.children[0].value;

	// remove row from the cart
	if (qty == 0) {
		row.className += " fade-shrink";
	}

	updateProductInCart(true, qty);
}

async function submitOrder() {
	event.preventDefault();

	if (!checkForm()) {
		alert('Please double check the contact details');
		return;
	}

	// check if there is anything in the cart
	if (parseInt(localStorage.getItem('shoppingCart')) > 0) {
		const order = getOrderInfo();

		if (order != undefined) {
			if (await sendToAPI(order)) {
				// reset form manually and clear localStorage
				document.getElementById("order-confirmation").reset();
				localStorage.clear();
			}
			else alert('Your order was not processed');
		}
		else alert("We are sorry. There is a problem with an item in your cart.")
	}
	else alert('Your cart is empty');
}

function getOrderInfo() {
	const form = document.getElementById('order-confirmation');
	const order = {
		contact : {
			firstName : form.elements["fname"].value,
			lastName : form.elements["lname"].value,
			address : form.elements["address"].value,
			city : form.elements["city"].value,
			email : form.elements["email"].value
		},
		products : getProdArray()
	}

	return order;
}

function getProdArray() {
	const cart = JSON.parse(localStorage.getItem('itemsInCart'));
	let itemsLeftToAdd = parseInt(localStorage.getItem('shoppingCart'));
	const arr = [];

	for (let item in cart) {
		// iterate over varnishes, as they store quantities
		for (let varn in cart[item].varnish) {
			while (cart[item].varnish[varn] > 0) {
				cart[item].varnish[varn] -= 1;
				arr.push(item);
				itemsLeftToAdd -= 1;
			}

			// break out early, if no items left to add
			if (itemsLeftToAdd == 0)
				break;
		}
	}

	return arr;
}

function checkForm() {
	const form = document.getElementById('order-confirmation');

	// Basic checks are done by HTML

	if (strip(form.elements["fname"].value).length === 0 || strip(form.elements["lname"].value).length === 0 ||
	 	strip(form.elements["city"].value).length === 0 || strip(form.elements["address"].value).length === 0) {
		return false;
	}

	return true;
}

// strips white spaces only, but could also remove digits and punctuation
function strip(str) {
	return str.replace(/^\s+|\s+$/g, ''); 
}

function makeRequest(data) {
	return new Promise((resolve, reject) => {
		let request = new XMLHttpRequest();
		request.open('POST', API + 'order');
		request.onreadystatechange = () => {
			if (request.readyState === 4) {
				console.log(request)
				if (request.status === 201) {
					resolve(JSON.parse(request.response));
				}
				else if (request.status === 0 || (request.status >= 500 && request.status < 600)) {
					reject({error: 'Server did not reply'});
				}
				else {
					reject(JSON.parse(request.response));
				}
			}
		};
		request.setRequestHeader('Content-Type', 'application/json');
		request.send(JSON.stringify(data));
	});
}

async function sendToAPI(data) {
	try {
		const requestPromise = makeRequest(data);
		const response = await requestPromise;

		if (response.orderId != undefined) {
			alert(`Your order ${response.orderId} is being processed`);
			return true;
		}
		else {
			alert("Something went wrong");
			return false;
		}
	}
	catch(errorResponse) {
		alert('Request failed with error: ' + errorResponse.error);
		return false;
	}
}