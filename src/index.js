const BASE_URL = "https://e-bae.herokuapp.com";
const ITEMS_URL = `${BASE_URL}/items`;
const overlayDiv = document.getElementById('overlay')
const specialBoxDiv = document.getElementById('specialBox')
const root = document.getElementById('root');
const body = document.getElementById('body')
const search_button = document.querySelector("#search_button");
const search_input = document.querySelector("#myinput");
const userBox = document.querySelector('#user');
const loginButton = document.querySelector('#login');
const loginDiv = document.querySelector('#login-div')
const loginInput = document.querySelector('#user-id');
const logoButton = document.querySelector('#logo');
const boughtButton = document.querySelector('#bought-items-btn');
const sellingButton = document.querySelector('#selling-items-btn');
const wrapper = document.getElementById('wrapper')
overlayDiv.className = 'overlay'
specialBoxDiv.className = 'specialBox'

function showSpecialDiv(e) {

	const itemCard = e.target.closest('.item-card');
	if (itemCard && userBox.dataset.buy === "1") {
		
		overlayDiv.style.opacity = .8;

		if(overlayDiv.style.display == "block"){
			overlayDiv.style.display = "none";
			specialBoxDiv.style.display = "none";
		} else {
			overlayDiv.style.display = "block";
			specialBoxDiv.style.display = "block";
		}

		specialBoxDiv.innerHTML = `
				<img src="${itemCard.dataset.img_url}" style="width:300px;height:300;">
				<h1 class='subtitle'><strong>${itemCard.dataset.name}</strong></h1>
				<p>${itemCard.dataset.description}</p>
				<h2>Price: <strong><span class='dolla'>$</span>${itemCard.dataset.price}</strong></h2>
				<button class='button' style="background-color: orange;" id="buy-button" data-id="${itemCard.dataset.id}" data-can-buy="1">Buy</button>`
	}
}

wrapper.addEventListener("click", showSpecialDiv);

function initialItems() {

	let fetchURL = ITEMS_URL + (userBox.dataset.id ? `?user_id=${userBox.dataset.id}` : "")

	fetch(fetchURL)
	.then(res => res.json())
	.then(itemIndexer);

	userBox.dataset.buy = 1;
}

function boughtItems() {


	fetch(`${BASE_URL}/bought_items/${userBox.dataset.id}`)
	.then(res => res.json())
	.then(itemIndexer);

	userBox.dataset.buy = 0;
}

function sellingItems() {

	fetch(`${BASE_URL}/selling_items/${userBox.dataset.id}`)
	.then(res => res.json())
	.then(itemIndexer);

	userBox.dataset.buy = 0;
}

initialItems();
search_button.addEventListener("click", searchItems);
loginButton.addEventListener("click", function () {

	const userId = loginInput.value;
	fetch(`${BASE_URL}/login?id=${userId}`)
	.then(res => res.json())
	.then(user => {

		let loggedInControls = `<span id='user-id' name='id' class='username'>
		<strong>Welcome ${user.name}!</strong></span>`;
		loginDiv.innerHTML = loggedInControls;
		loginDiv.className = "username-div";
		userBox.dataset.name = user.name;
		userBox.dataset.id = user.id;
		initialItems();
	 	Swal.fire({
			  type: 'success',
			  title: `Welcome back ${user.name}! Enjoy your shopping experience!`,
			  showConfirmButton: true,
			})
	});
});

logoButton.addEventListener("click", () => {

	initialItems();
});

boughtButton.addEventListener("click", () => {

	if (userBox.dataset.id !== undefined) {
		boughtItems();
	}
	else
		Swal.fire({
			  type: 'error',
			  title: 'You must be logged in to view bought items!',
			  showConfirmButton: true,
			})

});
sellingButton.addEventListener("click", () => {

	if (userBox.dataset.id !== undefined) {
		sellingItems();
	}
	else
		Swal.fire({
			  type: 'error',
			  title: 'You must be logged in to view selling items!',
			  showConfirmButton: true,
			})

});


specialBoxDiv.addEventListener("click", (e) => {

	if (e.target.id === "buy-button") {
		if (userBox.dataset.id !== undefined) {
			const itemId = e.target.dataset.id;
			fetch(`${BASE_URL}/items/${itemId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify({item_id: itemId, user_id: userBox.dataset.id})
			})
			.then(res => res.json())
			.then((json) => {

				if (json.response === "success") {

					const boughtItem = document.querySelector(`.item-card[data-id="${itemId}"]`);
					boughtItem.remove();
					// you have bought the item
					Swal.fire({
					  type: 'success',
					  title: 'You have bought the item!',
					  showConfirmButton: true,
					}).then(
						() => {
							overlayDiv.style.opacity = 0;
							
							if(overlayDiv.style.display == "block"){
								overlayDiv.style.display = "none";
								specialBoxDiv.style.display = "none";
							} else {
								overlayDiv.style.display = "block";
								specialBoxDiv.style.display = "block";
							}
						}
					)
				}
				else
					// you are not logged in
					Swal.fire({
					  type: 'error',
					  title: 'You must be logged in to buy items!',
					  showConfirmButton: true,
					}).then(
						() => {
							overlayDiv.style.opacity = 0;
							
							if(overlayDiv.style.display == "block"){
								overlayDiv.style.display = "none";
								specialBoxDiv.style.display = "none";
							} else {
								overlayDiv.style.display = "block";
								specialBoxDiv.style.display = "block";
							}
						}
					)
			});
		}
		else {
			// show error because you are not logged in
			Swal.fire({
			  type: 'error',
			  title: 'You must be logged in to buy items!',
			  showConfirmButton: true,
			}).then(() => {
					overlayDiv.style.opacity = 0;
					
					if(overlayDiv.style.display == "block"){
						overlayDiv.style.display = "none";
						specialBoxDiv.style.display = "none";
					} else {
						overlayDiv.style.display = "block";
						specialBoxDiv.style.display = "block";
					}
				})
		}
	}
});



// Go to the index route with search parameter corresponding to the item you searched for
// then display each item that is returned from the search
function searchItems(event) {

	let fetchURL = `${ITEMS_URL}?search=${search_input.value}` + 
		(userBox.dataset.id ? `&user_id=${userBox.dataset.id}` : "")

	event.preventDefault();
	fetch(fetchURL)
	.then(res => res.json())
	.then(itemIndexer)
}

function itemIndexer(items){

	wrapper.innerHTML = "";
	items.forEach(listItems);
}




overlayDiv.addEventListener("click", () => {
	overlayDiv.style.opacity = 0;
	newItemForm.reset();
	
	if(overlayDiv.style.display == "block"){
		overlayDiv.style.display = "none";
		specialBoxDiv.style.display = "none";
		newItemSpecialBoxDiv.style.display = "none";
	} else {
		overlayDiv.style.display = "block";
		specialBoxDiv.style.display = "block";
	}
})

function listItems(item, index){

	const indexDiv = document.createElement('div')
		indexDiv.className = "card item-card"
		indexDiv.dataset.description = item.description;
		indexDiv.dataset.name = item.name
		indexDiv.dataset.price = item.price
		indexDiv.dataset.state = item.state
		indexDiv.dataset.img_url = item.img_url
		indexDiv.dataset.id = item.id
		indexDiv.dataset.user_id = item.user_id
		indexDiv.dataset.user_name = item.user_name

		if ((index + 1) % 6 !== 0) {
			indexDiv.style.marginRight = "1rem";
		}
		const cardImgDiv = document.createElement('div')
		cardImgDiv.className = 'card-image'
		const cardFigure = document.createElement('figure')
		cardFigure.className = 'image is-4by3'
		cardFigure.innerHTML = `<img src="${item.img_url}">`
		const contentDiv = document.createElement('div')
		contentDiv.className = 'card-content'
		contentDiv.innerHTML = `
			<h1 class='subtitle'><strong>${item.name}</strong></h1>
			${item.user_name ? `<p><strong>Seller:</strong> ${item.user_name}</p>` : ""}
			<br />
			<p>${item.description}</p>`

		indexDiv.appendChild(cardImgDiv)
		indexDiv.appendChild(contentDiv)
		cardImgDiv.appendChild(cardFigure)
		wrapper.appendChild(indexDiv)
}
	
	//--------------------New Item--------------->
	
const newItemBtn = document.getElementById('new-item-btn')
const newItemSpecialBoxDiv = document.getElementById('new-item-specialBox-div')
const cancelBtn = document.getElementById('cancel')

newItemBtn.addEventListener('click', () => {
	if (userBox.dataset.id !== undefined) {

		overlayDiv.style.opacity = 0.8;
		
		if(overlayDiv.style.display == "block"){
			overlayDiv.style.display = "none";
			newItemSpecialBoxDiv.style.display = "none";
		} else {
			overlayDiv.style.display = "block";
			newItemSpecialBoxDiv.style.display = "block";
		}
	}
	else {
		Swal.fire({
		  type: 'error',
		  title: 'You must be logged in to sell items!',
		  showConfirmButton: true,
		});
	}
})

const newItemForm = document.getElementById('new-item-form')

newItemForm.addEventListener('submit', () => {
	if (userBox.dataset.id !== undefined) {

		event.preventDefault()

		const nameInput = document.getElementById('name-input')
		const descInput = document.getElementById('desc-input')
		const imgInput = document.getElementById('img-input')
		const priceInput = document.getElementById('price-input')

		fetch(ITEMS_URL, {
			method: "POST",
			headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
			}, 
			body: JSON.stringify({ 
	            "name": nameInput.value, 
				"description": descInput.value,
				"price": priceInput.value,
				"img_url": imgInput.value,
				"user_id": 2,
				"state": "sell"
			})
		})
		.then(res => res.json())
		.then((item) => {
			listItems(item);
			newItemForm.reset();
			return Swal.fire({
				type: 'success',
				title: 'Your item is up for sale! Happy Selling!',
				showConfirmButton: true
			})
		}).then(() => {
			overlayDiv.style.opacity = 0.8;
			
			if(overlayDiv.style.display == "block"){
				overlayDiv.style.display = "none";
				newItemSpecialBoxDiv.style.display = "none";
			} else {
				overlayDiv.style.display = "block";
				newItemSpecialBoxDiv.style.display = "block";
			}
		})

	}

})
