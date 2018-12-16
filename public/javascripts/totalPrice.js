(function() {
	let productAmountDivList = [...document.getElementsByClassName('product-amount')], 
		productTotalPriceDivList = [...document.getElementsByClassName('product-total-price')],
		productPriceDivList = [...document.getElementsByClassName('product-price')],
		productPriceList = productPriceDivList.map(div => parseInt(div.innerText)),
		totalPriceDiv = document.getElementById('total-price'),
		totalPriceInput = document.getElementById('totalPriceInput'),
		productTotalPriceList = [...productPriceList];
	totalPriceDiv.innerText = `Tổng tiền: ${productTotalPriceList.reduce((a, b) => a + b, 0)}đ`;
	for (let i = 0; i < productAmountDivList.length; ++i) {
		productAmountDivList[i].onmouseup = productAmountDivList[i].onkeyup = e => {
			productTotalPriceList[i] = productPriceList[i] * e.target.value;
			productTotalPriceDivList[i].innerText = productTotalPriceList[i] + 'đ';
			let totalPrice = productTotalPriceList.reduce((a, b) => a + b, 0);
			totalPriceDiv.innerText = `Tổng tiền: ${totalPrice}đ`;
			totalPriceInput.value = totalPrice;
		};
	}
})();