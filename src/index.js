const BASE_URL = "http://localhost:3000/";
const ITEMS_URL = `${BASE_URL}items`;
const overlayDiv = document.getElementById('overlay')
const specialBoxDiv = document.getElementById('specialBox')
const body = document.getElementById('body')
const wrapper = document.getElementById('wrapper')
const search_button = document.querySelector("#search_button");
const search_input = document.querySelector("#myinput");
const userBox = document.querySelector('#user');
const loginButton = document.querySelector('#login');
const loginDiv = document.querySelector('#login-div')
const loginInput = document.querySelector('#user-id');
overlayDiv.className = 'overlay'
specialBoxDiv.className = 'specialBox'

function initialItems() {

	fetch(ITEMS_URL)
	.then(res => res.json())
	.then(itemIndexer);
}

initialItems();
search_button.addEventListener("click", searchItems);
loginButton.addEventListener("click", function () {

	const userId = loginInput.value;
	fetch(`${BASE_URL}/login?id=${userId}`)
	.then(res => res.json())
	.then(user => {

		let loggedInControls = `<span id='user-id' name='id' class='username'>
		<strong>Username:</strong>${user.name}</span>
		<button id="logout" class="button is-link login-btn">logout</button>`;
		loginDiv.innerHTML = loggedInControls;
		loginDiv.className = "username-div";
		userBox.dataset.name = user.name;
		userBox.dataset.id = user.id;
	 	Swal.fire({
			  type: 'success',
			  title: `Welcome back ${user.name}! Enjoy your shopping experience!`,
			  showConfirmButton: true,
			})
	});
});

specialBoxDiv.addEventListener("click", (e) => {

	if (e.target.id === "buy-button") {
		if (userBox.dataset.id !== undefined) {
			console.log("you can boy now!");
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
				console.log(json);
				if (json.response === "success")
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

	wrapper.innerHTML = "";
	event.preventDefault();
	fetch(`${ITEMS_URL}?search=${search_input.value}`)
		.then(res => res.json())
		.then(itemIndexer)
}

function itemIndexer(items){
	items.forEach(listItems)
}


wrapper.addEventListener("click", (e) => {

	const itemCard = e.target.closest('.item-card');
	if (itemCard) {
		
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
				<button class='button' style="background-color: orange;" id="buy-button" data-id="${itemCard.dataset.id}" >Buy</button>`
	}
})

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

function listItems(item){

	const indexDiv = document.createElement('div')
		indexDiv.className = "card item-card"
		indexDiv.dataset.description = item.description;
		indexDiv.dataset.name = item.name
		indexDiv.dataset.price = item.price
		indexDiv.dataset.state = item.state
		indexDiv.dataset.img_url = item.img_url
		indexDiv.dataset.id = item.id
		indexDiv.dataset.user_id = item.user_id

	const cardImgDiv = document.createElement('div')
		cardImgDiv.className = 'card-image'
	const cardFigure = document.createElement('figure')
		cardFigure.className = 'image is-4by3'
		cardFigure.innerHTML = `<img src="${item.img_url}">`
	const contentDiv = document.createElement('div')
		contentDiv.className = 'card-content'
		contentDiv.innerHTML = `
			<h1 class='subtitle'><strong>${item.name}</strong></h1>
			<p>${item.description}</p>`

		wrapper.appendChild(indexDiv)
		indexDiv.appendChild(cardImgDiv)
		indexDiv.appendChild(contentDiv)
		cardImgDiv.appendChild(cardFigure)

	}
	
	//--------------------New Item--------------->
	
	const newItemBtn = document.getElementById('new-item-btn')
	const newItemSpecialBoxDiv = document.getElementById('new-item-specialBox-div')
	const cancelBtn = document.getElementById('cancel')
	
newItemBtn.addEventListener('click', () => {
	overlayDiv.style.opacity = 0.8;
	
	if(overlayDiv.style.display == "block"){
		overlayDiv.style.display = "none";
		newItemSpecialBoxDiv.style.display = "none";
	} else {
		overlayDiv.style.display = "block";
		newItemSpecialBoxDiv.style.display = "block";
	}
})

const newItemForm = document.getElementById('new-item-form')

newItemForm.addEventListener('submit', () => {
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
	}).then(res => res.json())
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

})

// cancelBtn.addEventListener('click', () => {
// 	console.log(cancelBtn)
// 	if(overlayDiv.style.display == "block"){
// 		console.log("Yo");
// 		overlayDiv.style.display = "none";
// 		newItemSpecialBoxDiv.style.display = "none";
// 	} else {
// 		overlayDiv.style.display = "block";
// 		newItemSpecialBoxDiv.style.display = "block";
// 	}
// })