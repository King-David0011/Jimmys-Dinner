const menuEl = document.getElementById('menu')
const orderEl = document.getElementById('order')
const thanksEl = document.getElementById('thanks')
const thanksMessageEl = document.getElementById('thanks-message')
const ratingMessageEl = document.getElementById('rating-message')
const starEls = document.querySelectorAll('.star')
const modalEl = document.getElementById('modal')
const paymentForm = document.getElementById('payment-form')

let orderArray = JSON.parse(localStorage.getItem('orderArray')) || []

document.addEventListener('click', function(e){
    if (e.target.dataset.add) {
        handleAddClick(e.target.dataset.add)
    } else if (e.target.dataset.remove) {
        handleRemoveClick(e.target.dataset.remove)
    } else if (e.target.dataset.star) {
        handleStarClick(e.target.dataset.star)
    } else if (e.target.id === 'complete-btn') {
        modalEl.classList.remove('hidden')
    } else if (e.target.id === 'close-modal') {
        modalEl.classList.add('hidden')
    }
})

paymentForm.addEventListener('submit', function(e){
    e.preventDefault()

    const customerName = document.getElementById('name').value

    modalEl.classList.add('hidden')
    paymentForm.reset()

    orderArray = []
    renderOrder()

    resetRating()
    thanksMessageEl.textContent = `Thanks, ${customerName}! Your order is on its way!`
    thanksEl.classList.remove('hidden')
})

function handleAddClick(itemId){
    const chosenItem = menuArray.filter(function(item){
        return item.id === Number(itemId)
    })[0]

    orderArray.push(chosenItem)
    thanksEl.classList.add('hidden')
    renderOrder()
}

function handleRemoveClick(index){
    orderArray.splice(Number(index), 1)
    renderOrder()
}

function handleStarClick(rating){
    for (let i = 0; i < starEls.length; i++) {
        if (Number(starEls[i].dataset.star) <= Number(rating)) {
            starEls[i].classList.add('active')
        } else {
            starEls[i].classList.remove('active')
        }
    }
    ratingMessageEl.textContent = `You gave us ${rating} out of 5. Thank you!`
}

function resetRating(){
    for (let i = 0; i < starEls.length; i++) {
        starEls[i].classList.remove('active')
    }
    ratingMessageEl.textContent = ''
}

function hasMealDeal(){
    let hasDrink = false
    let hasMeal = false

    for (let i = 0; i < orderArray.length; i++) {
        if (orderArray[i].name === 'Beer') {
            hasDrink = true
        } else {
            hasMeal = true
        }
    }

    return hasDrink && hasMeal
}

function getMenuHtml(){
    return menuArray.map(function(item){
        return `
            <div class="menu-item">
                <div class="menu-emoji">${item.emoji}</div>
                <div class="menu-info">
                    <h3>${item.name}</h3>
                    <p class="ingredients">${item.ingredients.join(', ')}</p>
                    <p class="price">$${item.price}</p>
                </div>
                <button class="add-btn" data-add="${item.id}" aria-label="Add ${item.name} to order">+</button>
            </div>
        `
    }).join('')
}

function renderOrder(){
    localStorage.setItem('orderArray', JSON.stringify(orderArray))

    if (orderArray.length === 0) {
        orderEl.classList.add('hidden')
        orderEl.innerHTML = ''
        return
    }

    let orderItemsHtml = ''
    let totalPrice = 0

    for (let i = 0; i < orderArray.length; i++) {
        const item = orderArray[i]
        totalPrice += item.price

        orderItemsHtml += `
            <div class="order-item">
                <h3>${item.name}</h3>
                <button class="remove-btn" data-remove="${i}">remove</button>
                <p class="order-price">$${item.price}</p>
            </div>
        `
    }

    let discount = 0
    let discountHtml = ''

    if (hasMealDeal()) {
        discount = totalPrice * 0.1
        discountHtml = `
            <div class="discount">
                <p>Meal deal, 10% off</p>
                <p>-$${discount.toFixed(2)}</p>
            </div>
        `
    }

    const finalPrice = totalPrice - discount

    orderEl.innerHTML = `
        <h2>Your order</h2>
        ${orderItemsHtml}
        ${discountHtml}
        <div class="total">
            <p>Total price:</p>
            <p>$${finalPrice.toFixed(2)}</p>
        </div>
        <button id="complete-btn" class="green-btn">Complete order</button>
    `
    orderEl.classList.remove('hidden')
}

menuEl.innerHTML = getMenuHtml()
renderOrder()