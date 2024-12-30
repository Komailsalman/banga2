window.onload = () => {
    const deletedOrders = JSON.parse(localStorage.getItem('deletedOrders')) || [];
    const deletedOrdersBody = document.getElementById('deleted-orders-body');

    deletedOrders.forEach(order => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${order.orderNumber}</td>
            <td>
                ${order.orders.map(item => `${item.product} (${item.count})`).join('<br>')}
            </td>
            <td>${order.totalPrice} ريال</td>
            <td>${new Date(order.timestamp).toLocaleDateString()} ${new Date(order.timestamp).toLocaleTimeString()}</td>
        `;

        deletedOrdersBody.appendChild(row);
    });
};


function loadDeletedOrders() {
    const deletedOrders = JSON.parse(localStorage.getItem('deletedOrders')) || [];
    const tableBody = document.getElementById('deleted-orders-body');
    tableBody.innerHTML = ''; // مسح المحتوى الحالي

    deletedOrders.forEach((order, index) => {
        const row = document.createElement('tr');

        // عمود رقم الطلب
        const orderNumberCell = document.createElement('td');
        orderNumberCell.textContent = order.orderNumber;

        // عمود المنتجات
        const productsCell = document.createElement('td');
        const productsList = order.orders.map(
            item => `${item.product} (${item.count}) - ${item.price} ريال`
        ).join('<br>');
        productsCell.innerHTML = productsList;

        // عمود طريقة الدفع
        const paymentMethodCell = document.createElement('td');
        paymentMethodCell.textContent = order.paymentMethod || 'غير محدد';

        // عمود الإجمالي
        const totalPriceCell = document.createElement('td');
        totalPriceCell.textContent = `${order.totalPrice} ريال`;

        // عمود التاريخ
        const dateCell = document.createElement('td');
        const orderDate = new Date(order.timestamp).toLocaleDateString();
        const orderTime = new Date(order.timestamp).toLocaleTimeString();
        dateCell.textContent = `${orderDate} ${orderTime}`;

        // عمود زر عرض التفاصيل
        const detailsCell = document.createElement('td');
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'عرض';
        detailsButton.classList.add('details-btn');
        detailsButton.onclick = () => showOrderDetailsWithSweetAlert(order);
        detailsCell.appendChild(detailsButton);

        // عمود تاريخ النقل
        const transferDateCell = document.createElement('td');
        const transferDate = new Date(order.transferTimestamp || Date.now());
        const transferDateText = `${transferDate.toLocaleDateString()} ${transferDate.toLocaleTimeString()}`;
        transferDateCell.textContent = transferDateText;

        // عمود زر الحذف
        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'حذف';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = () => deleteDeletedOrder(index);
        deleteCell.appendChild(deleteButton);

        // إضافة الأعمدة إلى الصف
        row.appendChild(orderNumberCell);
        row.appendChild(productsCell);
        row.appendChild(paymentMethodCell);
        row.appendChild(totalPriceCell);
        row.appendChild(dateCell);
        row.appendChild(detailsCell);
        row.appendChild(transferDateCell);
        row.appendChild(deleteCell);

        // إضافة الصف إلى الجدول
        tableBody.appendChild(row);
    });

    // عرض رسالة إذا لم يكن هناك طلبات
    if (deletedOrders.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.setAttribute('colspan', '8');
        emptyCell.textContent = 'لا توجد طلبات محذوفة';
        emptyCell.style.textAlign = 'center';
        tableBody.appendChild(emptyCell);
    }
}

// استدعاء الدالة عند تحميل الصفحة
window.onload = loadDeletedOrders;

// وظيفة حذف الطلب من قائمة المحذوفات
function deleteDeletedOrder(index) {
    const confirmed = confirm("هل أنت متأكد أنك تريد حذف هذا الطلب؟");
    if (confirmed) {
        const deletedOrders = JSON.parse(localStorage.getItem('deletedOrders')) || [];
        deletedOrders.splice(index, 1); // حذف الطلب بناءً على الفهرس
        localStorage.setItem('deletedOrders', JSON.stringify(deletedOrders));
        loadDeletedOrders(); // تحديث العرض
    }
}



// استدعاء الدالة عند تحميل الصفحة
window.onload = loadDeletedOrders;


function moveOrderToDeleted(order) {
    const deletedOrders = JSON.parse(localStorage.getItem('deletedOrders')) || [];
    order.transferTimestamp = new Date().toISOString(); // إضافة الطابع الزمني للنقل
    deletedOrders.push(order);
    localStorage.setItem('deletedOrders', JSON.stringify(deletedOrders));
}


function showOrderDetailsWithSweetAlert(order) {
    const productsTable = `
        <table style="width: 100%; border-collapse: collapse; text-align: center;">
            <thead>
                <tr>
                    <th style="border: 1px solid black; padding: 5px;">العدد</th>
                    <th style="border: 1px solid black; padding: 5px;">المنتج</th>
                    <th style="border: 1px solid black; padding: 5px;">السعر</th>
                </tr>
            </thead>
            <tbody>
                ${order.orders.map(item => `
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">${item.count}</td>
                        <td style="border: 1px solid black; padding: 5px;">${item.product}</td>
                        <td style="border: 1px solid black; padding: 5px;">${item.price} ريال</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    Swal.fire({
        title: `تفاصيل الطلب رقم ${order.orderNumber}`,
        html: `
            <p><strong>طريقة الدفع:</strong> ${order.paymentMethod || 'غير محدد'}</p>
            <p><strong>الإجمالي:</strong> ${order.totalPrice} ريال</p>
            ${productsTable}
        `,
        width: '80%',
        confirmButtonText: 'إغلاق',
        showCancelButton: false,
        focusConfirm: false
    });
}

function navigateTo(page) {
    window.location.href = page;
}

