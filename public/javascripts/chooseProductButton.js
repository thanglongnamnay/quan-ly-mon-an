const chooseProductButtonDivList = [...document.getElementsByClassName('chooseProductButton')];
const cancelDivList = [...document.getElementsByClassName('cancel')];
const inputBoxList = [...document.getElementsByClassName('product-amount')];
const str_obj = (str = document.cookie) => {
	let strList = str.split('; ');
	let result = {};
	for (let i = 0; i < strList.length; i++) {
		let cur = strList[i].split('=');
		result[cur[0]] = cur[1];
	}
	return result;
};
const cookie = str_obj();
let productIDList = cookie.productIDList ? cookie.productIDList.split('-') : [];
let productAmountList = cookie.productAmountList ? cookie.productAmountList.split('-') : [];
const removeProduct = (productID) => {
	const index = productIDList.indexOf(productID);
	productIDList.splice(index, 1);
	productAmountList.splice(index, 1);
};
// document.cookie = `productIDList = `;
// document.cookie = `productAmountList = `;
const setCookie = () => {
	document.cookie = 'productIDList=' + productIDList.join('-') + ';path=/';
	document.cookie = 'productAmountList=' + productAmountList.join('-') + ';path=/';
};

for (let button of chooseProductButtonDivList) {
	const productID = button.id.slice(20);
	if (productIDList.find(id => id == productID)) {
		button.innerText = 'Bỏ chọn';
		button.classList.remove('btn-primary');
		button.classList.add('btn-danger');
	}
	button.onclick = e => {
		e.preventDefault();
		if (e.target.innerText[0] === 'C') { //Chọn món này
			e.target.innerText = 'Bỏ chọn';
			e.target.classList.remove('btn-primary');
			e.target.classList.add('btn-danger');
			if (!productIDList.find(id => id == productID)) {
				productIDList.push(productID);
				productAmountList.push('1');
			}
		} else {
			e.target.innerText = 'Chọn món này';
			e.target.classList.remove('btn-danger');
			e.target.classList.add('btn-primary');
			removeProduct(productID);
		}
		setCookie();
	};
}
for (let button of cancelDivList) {
	const productID = button.id.slice('cancel-'.length);
	button.onclick = e => {
		e.preventDefault();
		const inputBox = document.getElementById('product-amount-' + productID);
		inputBox.value = 0;
		e.target.parentElement.parentElement.className = 'd-none';
		removeProduct(productID);
		if (productIDList.length === 0) {
			document.getElementById('submitButton').className = 'btn btn-primary btn-lg d-none';
		}
		setCookie();
	};
}
for (let inputBox of inputBoxList) {
	const productID = inputBox.id.slice('product-amount-'.length);
	inputBox.onchange = e => {
		const index = productIDList.indexOf(productID);
		productAmountList[index] = e.target.value;
		setCookie();
	};
}