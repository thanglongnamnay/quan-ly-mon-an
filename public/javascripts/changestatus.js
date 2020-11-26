const changStatusDivList = [...document.getElementsByClassName('changeStatusBtn')];
const statusTextList = [...document.getElementsByClassName('orderStatus')];
for (let btnDiv of changStatusDivList) {
	btnDiv.onclick = e => {
		const orderID = e.target.id.slice(13);
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				let result = JSON.parse(this.response);
				if (result.status === 'Đang làm') {
					document.
						getElementById('orderStatus-'+orderID).
						innerText = 'Trạng thái: Đang làm';
					e.target.innerText = 'Đã xong';
				} else if (result.status === 'Đã xong') {
					document.
						getElementById('orderStatus-'+orderID).
						innerText = 'Trạng thái: Đã xong';
					e.target.classList.add('d-none');
				}
			}
		};
		xhr.open('POST', `/order/${orderID}/next-status`, true);
		xhr.send();
	};
}
for (let statusText of statusTextList) {
	const status = statusText.innerText.slice('Trạng thái: '.length);
	switch (status) {
	case 'Đang làm':
		statusText.classList.add('text-warning');
		break;
	case 'Đã xong':
		statusText.classList.add('text-success');
		break;
	}
}