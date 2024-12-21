window.onload = () => {
    const editOrder = JSON.parse(localStorage.getItem('editOrder'));
    if (editOrder) {
        // إضافة الطلب المعدل إلى الجدول
        editOrder.orders.forEach(item => {
            // ضمان أن السعر والعدد يتم جلبهما كقيم رقمية
            const price = parseFloat(item.price);
            const count = parseInt(item.count);

            // التأكد من صحة القيم قبل الإضافة
            if (!isNaN(price) && !isNaN(count)) {
                addToTable(item.product, price / count); // تمرير السعر الفردي إلى الدالة
            } else {
                console.error(`القيم غير صالحة للمنتج: ${item.product}`);
            }
        });

        // عرض رقم الطلب المعدل
        document.getElementById("order-number").innerText = editOrder.orderNumber;

        // لا نحذف `editOrder` حتى يتم الحفظ أو الإلغاء
    } else {
        // إذا لم يكن هناك طلب معدل، عرض رقم الطلب الجديد
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const newOrderNumber = orders.length > 0
            ? Math.max(...orders.map(order => order.orderNumber)) + 1
            : 1;
        document.getElementById("order-number").innerText = newOrderNumber;
    }
};




let orderNumber = localStorage.getItem("lastOrderNumber") 
        ? parseInt(localStorage.getItem("lastOrderNumber")) 
        : 1;

document.getElementById("order-number").innerText = orderNumber;

let totalPrice = 0; // الإجمالي

function addToTable(productName, unitPrice) {
    const tableBody = document.getElementById('product-table-body');
    const totalPriceElement = document.getElementById('total-price');

    // التحقق إذا كان المنتج موجودًا
    let existingRow = Array.from(tableBody.rows).find(row => row.cells[1].textContent === productName);

    if (existingRow) {
        // إذا كان المنتج موجودًا، قم بزيادة العدد وتحديث السعر الإجمالي
        const countCell = existingRow.cells[0];
        const priceCell = existingRow.cells[2];

        let count = parseInt(countCell.textContent) + 1;
        countCell.textContent = count;

        let totalProductPrice = count * unitPrice;
        priceCell.textContent = `${totalProductPrice} ريال`;

        // تحديث الإجمالي الكلي
        const currentTotal = parseFloat(totalPriceElement.textContent) || 0;
        totalPriceElement.textContent = `${(currentTotal + unitPrice)} ريال`;
        return;
    }

    // إنشاء صف جديد
    const newRow = document.createElement('tr');

    // إضافة العدد (ابدأ من 1)
    const countCell = document.createElement('td');
    countCell.textContent = 1;

    // إضافة المنتج
    const productCell = document.createElement('td');
    productCell.textContent = productName;

    // إضافة السعر (ابدأ بالسعر الفردي)
    const priceCell = document.createElement('td');
    priceCell.textContent = `${unitPrice} ريال`;

    // إضافة زر الحذف
    // إضافة زر الحذف
const deleteCell = document.createElement('td');
const deleteButton = document.createElement('button');
deleteButton.textContent = 'حذف';
deleteButton.classList.add('delete-btn', 'no-print'); // إضافة فئة no-print
deleteButton.onclick = () => {
    const count = parseInt(countCell.textContent);
    totalPriceElement.textContent = `${(parseFloat(totalPriceElement.textContent) - (count * unitPrice))} ريال`;
    tableBody.removeChild(newRow); // حذف الصف من الجدول
};
deleteCell.appendChild(deleteButton);


    // إضافة الأعمدة إلى الصف
    newRow.appendChild(countCell);
    newRow.appendChild(productCell);
    newRow.appendChild(priceCell);
    newRow.appendChild(deleteCell);

    // إضافة الصف إلى الجدول
    tableBody.appendChild(newRow);

    // تحديث الإجمالي الكلي
    const currentTotal = parseFloat(totalPriceElement.textContent) || 0;
    totalPriceElement.textContent = `${(currentTotal + unitPrice)} ريال`;
}




function saveOrdersToLocalStorage() {
    const tableBody = document.getElementById('product-table-body');
    const rows = Array.from(tableBody.rows);

    // استخراج الطلبات من الجدول
    const orders = rows.map(row => {
        return {
            product: row.cells[1].textContent,
            price: parseFloat(row.cells[2].textContent), // تأكد من أن السعر رقمي
            count: parseInt(row.cells[0].textContent) // تأكد من أن العدد رقمي
        };
    });
    

    // جلب الطلبات السابقة
    const previousOrders = JSON.parse(localStorage.getItem('orders')) || [];

    // التحقق إذا كان هذا طلب معدل
    const editOrder = JSON.parse(localStorage.getItem('editOrder'));
    if (editOrder) {
        // حذف الطلب القديم من القائمة
        const orderIndex = previousOrders.findIndex(order => order.orderNumber === editOrder.orderNumber);
        if (orderIndex !== -1) {
            previousOrders.splice(orderIndex, 1); // حذف الطلب القديم
        }

        // إنشاء الطلب الجديد بنفس الرقم
        previousOrders.push({
            orderNumber: editOrder.orderNumber, // الاحتفاظ برقم الطلب القديم
            orders: orders,
            totalPrice: orders.reduce((sum, item) => sum + item.price * item.count, 0),
            timestamp: new Date().toISOString() // الطابع الزمني الجديد
        });

        // إزالة الطلب المعدل من التخزين المؤقت
        localStorage.removeItem('editOrder');
    } else {
        // إذا لم يكن الطلب معدلاً، أنشئ طلبًا جديدًا
        const newOrderNumber = previousOrders.length > 0
            ? Math.max(...previousOrders.map(order => order.orderNumber)) + 1
            : 1; // تحديد الرقم التالي

        previousOrders.push({
            orderNumber: newOrderNumber,
            orders: orders,
            totalPrice: orders.reduce((sum, item) => sum + item.price * item.count, 0),
            timestamp: new Date().toISOString() // الطابع الزمني
        });

        // تحديث الرقم الأخير
        localStorage.setItem('lastOrderNumber', newOrderNumber);
    }

    // حفظ الطلبات
    localStorage.setItem('orders', JSON.stringify(previousOrders));

    // تحديث رقم الطلب في الصفحة الرئيسية
    document.getElementById("order-number").innerText =
        previousOrders.length > 0
            ? Math.max(...previousOrders.map(order => order.orderNumber)) + 1
            : 1;
}




function clearTable() {
    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = '';
    document.getElementById('total-price').textContent = '0 ريال';
}




function printAndClear() {
    const table = document.getElementById('order-table');
    if (!table) {
        alert("الجدول غير موجود!");
        return;
    }

    // إنشاء نسخة جديدة من الجدول للطباعة فقط
    const printTable = table.cloneNode(true);

    // حذف العمود الخاص بالحذف من نسخة الجدول
    const rows = printTable.rows;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells.length > 3) { // التأكد أن العمود موجود
            rows[i].deleteCell(3); // حذف العمود الرابع (عمود زر الحذف)
        }
    }

    // الحصول على التاريخ والوقت الحاليين
    const now = new Date();
    const orderDate = now.toLocaleDateString(); // الحصول على التاريخ
    const orderTime = now.toLocaleTimeString(); // الحصول على الوقت

    const logo = new Image();
    logo.src = "https://i.ibb.co/drZnrmK/bangalogo.png";
    logo.onload = function () {
        // محتوى الطباعة
        const printContent = `
            <div style="text-align: center; ">
                <img src="${logo.src}" alt="شعار" style="width: 100px; margin-bottom: 10px;">
                <h2>فاتورة الطلب</h2>
                <p style="font-size: 12px;"><strong>تاريخ الطلب:</strong> ${orderDate} | <strong>وقت الطلب:</strong> ${orderTime}</p>
            </div>
            ${printTable.outerHTML}
            <div style="text-align: center; margin-top: 20px;">
                <p>شكراً لتعاملكم معنا</p>
            </div>
            <div style="height: 1000px;"></div> <!-- إضافة مساحة فارغة -->

        `;

        // دالة لطباعة المحتوى في نافذة جديدة
        function printContentWindow(content) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>فاتورة الطلب</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                direction: rtl;
                                text-align: center;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin: auto;
                            }
                            th, td {
                                border: 1px solid #000;
                                padding: 8px;
                                text-align: center;
                            }
                        </style>
                    </head>
                    <body>
                        ${content}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }

        // طباعة النسخة الأولى
        printContentWindow(printContent);

        // طباعة النسخة الثانية بعد تأخير بسيط (1 ثانية)
        setTimeout(() => printContentWindow(printContent), 50);

        // حفظ الطلبات في Local Storage
        saveOrdersToLocalStorage();

        // مسح الجدول
        clearTable();
    };

    // معالجة الخطأ إذا لم يتم تحميل الشعار
    logo.onerror = function () {
        alert("تعذر تحميل الشعار. يرجى التحقق من الرابط.");
    };
}









// قراءة الطلبات من localStorage
const orders = JSON.parse(localStorage.getItem("savedOrders")) || [];
const tableBody = document.getElementById("orders-body");

// عرض الطلبات في الجدول
orders.forEach((order, index) => {
    const row = document.createElement("tr");
    const items = order.items.map(item => `${item.product} (${item.price})`).join("<br>");

    row.innerHTML = `
        <td>${order.orderNumber}</td>
        <td>${items}</td>
        <td>${order.total} ريال</td>
        <td>
            <button onclick="deleteOrder(${index})" style="background-color: red; color: white; padding: 5px; border: none; border-radius: 5px; cursor: pointer;">
                حذف
            </button>
        </td>
    `;

    tableBody.appendChild(row);
});

// وظيفة حذف الطلب
function deleteOrder(index) {
    if (confirm("هل أنت متأكد أنك تريد حذف هذا الطلب؟")) {
        // حذف الطلب من المصفوفة
        orders.splice(index, 1);

        // تحديث localStorage
        localStorage.setItem("savedOrders", JSON.stringify(orders));

        // إعادة تحميل الصفحة لتحديث الجدول
        location.reload();
    }
}
function resetOrderNumber() {
    // عرض رسالة تأكيد للمستخدم
    const confirmReset = confirm("هل أنت متأكد أنك تريد تجديد رقم الطلب إلى 1؟");
    if (confirmReset) {
        // إعادة تعيين رقم الطلب في localStorage
        orderNumber = 1;
        localStorage.setItem("lastOrderNumber", orderNumber);

        // تحديث رقم الطلب في الصفحة
        document.getElementById("order-number").innerText = orderNumber;

        // عرض رسالة نجاح
        alert("تم تجديد رقم الطلب بنجاح!");
    }
}

function addCustomPriceProduct() {
    // اسم المنتج الافتراضي
    const productName = "مخصص";

    // طلب السعر من المستخدم
    const productPrice = parseFloat(prompt("أدخل سعر المنتج (ريال):"));
    if (isNaN(productPrice) || productPrice <= 0) {
        alert("يجب إدخال سعر صالح!");
        return;
    }

    // إضافة المنتج إلى الجدول
    addToTable(productName, productPrice);
}

function printDirectly() {
    const table = document.getElementById('order-table');
    if (!table) {
        alert("الجدول غير موجود!");
        return;
    }

    const printTable = table.cloneNode(true);

    // حذف العمود الخاص بالحذف من نسخة الجدول
    const rows = printTable.rows;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells.length > 3) {
            rows[i].deleteCell(3); // حذف العمود الرابع (عمود زر الحذف)
        }
    }

    const now = new Date();
    const orderDate = now.toLocaleDateString();
    const orderTime = now.toLocaleTimeString();

    const madaAmount = parseFloat(document.getElementById('mada-amount').value) || 0;
    const cashAmount = parseFloat(document.getElementById('cash-amount').value) || 0;
    const totalAmount = parseFloat(document.getElementById('total-price').textContent.replace(' ريال', '')) || 0;
    const remaining = (cashAmount > totalAmount) ? (cashAmount - totalAmount).toFixed(2) : 0;

    const paymentDetails = `
        <p><strong>طريقة الدفع:</strong></p>
        ${madaAmount > 0 ? `<p>مدى: ${madaAmount.toFixed(2)} ريال</p>` : ''}
        ${cashAmount > 0 ? `<p>كاش: ${cashAmount.toFixed(2)} ريال</p>` : ''}
        ${remaining > 0 ? `<p style="color: red;">المتبقي للعميل: ${remaining} ريال</p>` : ''}
    `;

    const printContent = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    direction: rtl;
                    text-align: center;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: auto;
                }
                th, td {
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: center;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            <div style="text-align: center;">
                <img src="https://i.ibb.co/drZnrmK/bangalogo.png" alt="شعار" style="width: 100px; margin-bottom: 10px;">
                <h2>فاتورة الطلب</h2>
                <p style="font-size: 12px;">
                    <strong>تاريخ الطلب:</strong> ${orderDate} |
                    <strong>وقت الطلب:</strong> ${orderTime}
                </p>
            </div>
            ${printTable.outerHTML}
            <div style="text-align: center; margin-top: 20px;">
                ${paymentDetails}
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <p>شكراً لتعاملكم معنا</p>
            </div>
            <div style="height: 1000px;"></div> <!-- إضافة مساحة فارغة -->
        </body>
        </html>
    `;

    const originalContent = document.body.innerHTML;

    // الطباعة الأولى
    document.body.innerHTML = printContent;
    window.print();

    // الطباعة الثانية بعد تأخير بسيط
    setTimeout(() => {
        window.print();

        // استعادة المحتوى الأصلي
        document.body.innerHTML = originalContent;

        // مسح الجدول بعد الطباعة
        clearTable();

        // إعادة تعيين النص الخاص بـ "المتبقي للعميل"
        document.getElementById('cash-remaining').textContent = '';
    }, 500); // تأخير نصف ثانية بين الطباعة الأولى والثانية
}



    






function updateMadaPayment() {
    const madaAmount = parseFloat(document.getElementById('mada-amount').value) || 0;
    const totalAmount = parseFloat(document.getElementById('total-price').textContent.replace(' ريال', '')) || 0;

    if (madaAmount > totalAmount) {
        alert('المبلغ المدخل في مدى لا يمكن أن يكون أكبر من الإجمالي.');
        document.getElementById('mada-amount').value = '';
        document.getElementById('cash-amount').value = '';
    } else {
        document.getElementById('cash-amount').value = (totalAmount - madaAmount);
    }
}




function updateCashPayment() {
    const cashAmount = parseFloat(document.getElementById('cash-amount').value) || 0;
    const totalAmount = parseFloat(document.getElementById('total-price').textContent.replace(' ريال', '')) || 0;
    const remainingDiv = document.getElementById('cash-remaining');

    if (cashAmount > totalAmount) {
        const remaining = (cashAmount - totalAmount);
        remainingDiv.textContent = `المتبقي للعميل: ${remaining} ريال`;
        document.getElementById('mada-amount').value = '0';
    } else {
        remainingDiv.textContent = ''; // إخفاء النص إذا كان المبلغ صحيحًا
        document.getElementById('mada-amount').value = (totalAmount - cashAmount);
    }
}








function setFullAmountToMada() {
    const totalAmount = parseFloat(document.getElementById('total-price').textContent.replace(' ريال', '')) || 0;

    // تعيين المبلغ الكامل لخانة مدى
    document.getElementById('mada-amount').value = totalAmount;

    // تحديث الدفع مدى
    madaAmount = totalAmount;
    cashAmount = 0; // التأكد من عدم وجود كاش
    document.getElementById('cash-amount').value = 0;

}






function setFullAmountToCash() {
    const totalAmount = parseFloat(document.getElementById('total-price').textContent.replace(' ريال', '')) || 0;

    // تعيين المبلغ الكامل لخانة مدى
    document.getElementById('cash-amount').value = totalAmount;

    // تحديث الدفع مدى
    cashAmount = totalAmount;
    madaAmount = 0; // التأكد من عدم وجود كاش
    document.getElementById('mada-amount').value = 0;

}
