
window.onload = () => {
    updateOrderNumber();

    const editOrder = JSON.parse(localStorage.getItem('editOrder'));
    if (editOrder) {
        // عرض الطلب المعدل في الجدول
        const tableBody = document.getElementById("product-table-body");
        clearTable(); // تنظيف الجدول الحالي

        let totalPrice = 0; // تتبع الإجمالي
        editOrder.orders.forEach(item => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${item.count}</td>
                <td>${item.product}</td>
                <td>${item.price} ريال</td>
                <td>
                    <button class="delete-btn" onclick="deleteRow(this)">حذف</button>
                    
                </td>
                
                
            `;
            tableBody.appendChild(newRow);

            totalPrice += item.price * item.count; // حساب الإجمالي
        });

        // تحديث الإجمالي في الصفحة
        document.getElementById("total-price").textContent = `${totalPrice} ريال`;

        // تحديث رقم الطلب
        document.getElementById("order-number").textContent = editOrder.orderNumber;

        // حذف الطلب المعدل من localStorage بعد عرضه
        localStorage.removeItem('editOrder');
    }


    
};




let orderNumber = localStorage.getItem("lastOrderNumber") 
        ? parseInt(localStorage.getItem("lastOrderNumber")) 
        : 1;

document.getElementById("order-number").innerText = orderNumber;

let totalPrice = 0; // الإجمالي

function addToTable(productName, unitPrice) {
    const tableBody = document.getElementById("product-table-body");
    const totalPriceElement = document.getElementById("total-price");

    // تحقق مما إذا كان المنتج موجودًا بالفعل
    const existingRow = Array.from(tableBody.rows).find(row => row.cells[1].textContent === productName);

    if (existingRow) {
        // إذا كان المنتج موجودًا، قم بزيادة العدد وتحديث السعر الإجمالي
        const countCell = existingRow.cells[0];
        const priceCell = existingRow.cells[2];

        let count = parseInt(countCell.textContent) + 1; // زيادة العدد
        countCell.textContent = count;

        let totalProductPrice = count * unitPrice; // حساب السعر الإجمالي للمنتج
        priceCell.textContent = `${totalProductPrice} ريال`;

        // تحديث الإجمالي الكلي
        const currentTotal = parseFloat(totalPriceElement.textContent.replace(" ريال", "").trim());
        totalPriceElement.textContent = `${(currentTotal + unitPrice)} ريال`;
    } else {
        // إذا كان المنتج غير موجود، قم بإضافته كصف جديد
        const newRow = document.createElement("tr");

        // إضافة العدد (ابدأ من 1)
        const countCell = document.createElement("td");
        countCell.textContent = 1;

        // إضافة المنتج
        const productCell = document.createElement("td");
        productCell.classList.add("product-name");
        productCell.textContent = productName;
        productCell.onclick = () => editNotes(newRow); // إضافة حدث لتعديل الملاحظات

        // إضافة السعر
        const priceCell = document.createElement("td");
        priceCell.textContent = `${unitPrice} ريال`;

        // إضافة زري "+" و "-"
        const controlCell = document.createElement("td");
        controlCell.classList.add("control-cell");

        const plusButton = document.createElement("button");
        plusButton.textContent = "+";
        plusButton.classList.add("control-btn", "plus-btn");
        plusButton.onclick = () => updateRow(newRow, unitPrice, "add");

        const minusButton = document.createElement("button");
        minusButton.textContent = "-";
        minusButton.classList.add("control-btn", "minus-btn");
        minusButton.onclick = () => updateRow(newRow, unitPrice, "subtract");

        controlCell.appendChild(plusButton);
        controlCell.appendChild(minusButton);

        // تخزين الملاحظات داخل الصف
        newRow.dataset.notes = ""; // الملاحظات الافتراضية

        // إضافة الأعمدة إلى الصف
        newRow.appendChild(countCell);
        newRow.appendChild(productCell);
        newRow.appendChild(priceCell);
        newRow.appendChild(controlCell);

        // إضافة الصف إلى الجدول
        tableBody.appendChild(newRow);

        // تحديث الإجمالي الكلي
        const currentTotal = parseFloat(totalPriceElement.textContent.replace(" ريال", "").trim());
        totalPriceElement.textContent = `${(currentTotal + unitPrice)} ريال`;
        
    }
}








function clearTable() {
    const tableBody = document.getElementById('product-table-body');
    const totalPriceElement = document.getElementById('total-price');

    // مسح جميع الصفوف من الجدول
    tableBody.innerHTML = '';

    // إعادة تعيين الإجمالي إلى 0
    totalPrice = 0;

    // تحديث عنصر الإجمالي في الصفحة
    totalPriceElement.textContent = `${totalPrice} ريال`;
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
    let cashAmount = parseFloat(document.getElementById('cash-amount').value) || 0;
    const totalAmount = parseFloat(document.getElementById('total-price').textContent.replace(' ريال', '')) || 0;

    const totalPaid = madaAmount + cashAmount;
    const orderNumber = parseInt(document.getElementById('order-number').textContent);

    localStorage.setItem(`totalPaid-${orderNumber}`, totalPaid);
    console.log(`تم تخزين المدفوع للطلب ${orderNumber}: ${totalPaid}`);
console.log(localStorage.getItem(`totalPaid-${orderNumber}`));


    console.log("Mada Amount:", madaAmount);
    console.log("Cash Amount:", cashAmount);

    // تحقق من المبلغ المدفوع مقارنة بالإجمالي
    if (totalPaid < totalAmount || totalAmount === 0) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ في المبلغ المدفوع',
            text: `المبلغ المدفوع (${totalPaid} ريال) أقل من الإجمالي (${totalAmount} ريال). يرجى تعديل طريقة الدفع.`,
            confirmButtonText: 'حسناً'
        });
        return;
    }

    // تعديل الكاش ليصبح مساوياً للإجمالي إذا كان أكبر منه
    if (cashAmount > totalAmount) {
        cashAmount = totalAmount;
    }

    let paymentMethod = "";

    if (madaAmount > 0 && cashAmount > 0) {
        paymentMethod = `مدى: ${madaAmount} ريال <br> كاش: ${cashAmount} ريال`;
    } else if (madaAmount > 0) {
        paymentMethod = `مدى: ${madaAmount} ريال`;
    } else if (cashAmount > 0) {
        paymentMethod = `كاش: ${cashAmount} ريال`;
    }
    
    console.log("Payment Method:", paymentMethod);
    

    // إضافة عبارة المتبقي إذا كان المبلغ المدفوع أكبر من الإجمالي
    let remainingMessage = "";
    if (totalPaid > totalAmount) {
        const remaining = totalPaid - totalAmount;
        remainingMessage = `<p style="color: red; font-weight: bold;">المبلغ المدفوع : ${totalPaid}  ريال
         المتبقي للعميل: ${remaining} ريال</p>`;
    }


    // حفظ طريقة الدفع في الطلب الحالي
    const previousOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const totalOrders = previousOrders.length;
    const totalItems = Array.from(printTable.querySelectorAll("tbody tr")).reduce((sum, row) => {
        const countCell = row.cells[0]; // عمود العدد
        const count = parseInt(countCell.textContent.trim());
        return sum + count;
    }, 0);
    const newOrder = {
        orderNumber: orderNumber || totalOrders + 1,
        orders: Array.from(document.querySelectorAll('#product-table-body tr')).map(row => ({
            product: row.cells[1].textContent,
            price: parseFloat(row.cells[2].textContent.replace(' ريال', '')),
            count: parseInt(row.cells[0].textContent)
        })),
        totalItems: totalItems, // إضافة العدد الإجمالي للمنتجات
        totalPrice: totalAmount,
        paymentMethod: paymentMethod,
        timestamp: new Date().toISOString()
    };

    previousOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(previousOrders));
    console.log("Saved Orders:", previousOrders);

    const logo = new Image();
    logo.src = "https://i.postimg.cc/g2GmHSFp/bangalogo.png";

    logo.onload = function () {
       
        const printContent = `
            <html>
            <head>
            <style>
            @font-face {
                font-family:  Arial, sans-serif;
            }

            body {
                font-family:  Arial, sans-serif;
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

            p, div, strong {
                font-family: Arial, sans-serif;
            }
        </style>
            </head>
            <body>
                <div style="text-align: center;">
                    <img src="${logo.src}" alt="شعار" style="width: 100px; margin-bottom: 10px;">
                    <p style="font-size: 12px;">
                        <strong>تاريخ الطلب:</strong> ${orderDate} |
                        <strong>وقت الطلب:</strong> ${orderTime}
                    </p>
                </div>
                ${printTable.outerHTML}
                <div style="text-align: center; margin-top: 20px;">
                <strong>إجمالي عدد الأصناف:</strong> ${totalItems}
            </div>
                <div style="text-align: center; margin-top: 20px;">
    <strong>طريقة الدفع:</strong><br>
    ${paymentMethod}

    
</div>


                ${remainingMessage}

                <div style="text-align: center; margin-top: 20px;">
    <p style="font-weight: bold;">
        بالعافية عليك .. ننتظرك تنورنا في فرع بنقا في الهفوف - حي الحوراء بالقرب من دوار التميمي وبنده
    </p>
</div>

            </body>
            </html>
        `;

        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;

        // الطباعة مرة واحدة فقط
        window.print();  
        
       
        
        setTimeout(async () => {
            await sendCutCommand(); // استدعاء أمر القطع
        
           
        }, 10000); // تأخير 10 ثانية     
        // استعادة المحتوى الأصلي وتنفيذ الخطوات الأخرى
        document.body.innerHTML = originalContent;


        const shortPrintContent = `
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; direction: rtl; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin: auto; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <div style="text-align: center;">
            <p style="font-size: 12px;">
                <strong>رقم الطلب:</strong> ${orderNumber} |
                <strong>تاريخ الطلب:</strong> ${orderDate} |
                <strong>وقت الطلب:</strong> ${orderTime}
            </p>
        </div>
        ${printTable.outerHTML}
        <div style="text-align: center; margin-top: 20px;">
                <strong>إجمالي عدد الأصناف:</strong> ${totalItems}
            </div>
    </body>
    </html>
`;


document.body.innerHTML = originalContent;


// طباعة المحتوى المختصر
// document.body.innerHTML = shortPrintContent;
// window.print();
// document.body.innerHTML = originalContent;
rebindEvents(); // إعادة تعيين الأحداث



        updateOrderNumber();
        clearTable();
      // window.location.reload();

    };

    logo.onerror = function () {
        alert("تعذر تحميل الشعار. يرجى التحقق من الرابط.");
    };
}







function updateOrderNumber() {
    const today = new Date().toLocaleDateString(); // تاريخ اليوم بصيغة قابلة للمقارنة
    const previousOrders = JSON.parse(localStorage.getItem('orders')) || [];

    // تصفية الطلبات حسب تاريخ اليوم
    const todaysOrders = previousOrders.filter(order => {
        const orderDate = new Date(order.timestamp).toLocaleDateString(); // تحويل تاريخ الطلب إلى نفس التنسيق
        return orderDate === today; // الاحتفاظ فقط بالطلبات التي تم إنشاؤها اليوم
    });

    const nextOrderNumber = todaysOrders.length + 1; // الرقم التالي للطلب
    document.getElementById('order-number').textContent = nextOrderNumber;
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



const madaInput = document.getElementById('mada-amount');
const cashInput = document.getElementById('cash-amount');

if (!madaInput || !cashInput) {
    console.error("حقول طريقة الدفع مفقودة!");
} else {
    console.log("Mada Input Value:", madaInput.value);
    console.log("Cash Input Value:", cashInput.value);
}



function saveOrdersToLocalStorage() {
    const tableBody = document.getElementById('product-table-body');
    const rows = Array.from(tableBody.rows);

    // استخراج الطلبات من الجدول
    const orders = rows.map(row => ({
        product: row.cells[1].textContent,
        price: parseFloat(row.cells[2].textContent.replace(' ريال', '')),
        count: parseInt(row.cells[0].textContent),
        notes: row.dataset.notes || "بدون ملاحظات" // حفظ الملاحظات
    }));

    const previousOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderNumber = parseInt(document.getElementById('order-number').textContent);
    const totalPrice = parseFloat(document.getElementById('total-price').textContent.replace(' ريال', ''));

    previousOrders.push({
        orderNumber: orderNumber,
        orders: orders,
        totalPrice: totalPrice,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('orders', JSON.stringify(previousOrders));
    console.log("Saved Orders:", previousOrders);
}










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

function addCustomPriceProduct1() {
    // الخطوة الأولى: إدخال اسم المنتج
    Swal.fire({
        title: 'إضافة منتج',
        input: 'text',
        inputLabel: 'اسم المنتج',
        inputPlaceholder: 'أدخل اسم المنتج',
        showCancelButton: true,
        cancelButtonText: 'إلغاء',
        confirmButtonText: 'التالي'
    }).then((result) => {
        if (result.isDismissed) {
            
            return;
        }

        let productName = result.value || "طلب خاص"; // اسم المنتج الافتراضي

        // الخطوة الثانية: إدخال السعر
        Swal.fire({
            title: `إضافة سعر لـ "${productName}"`,
            input: 'number',
            inputLabel: 'السعر بالريال',
            inputPlaceholder: 'أدخل السعر',
            showCancelButton: true,
            cancelButtonText: 'إلغاء',
            confirmButtonText: 'التالي',
            inputValidator: (value) => {
                if (!value || value <= 0) {
                    return 'يرجى إدخال سعر صالح!';
                }
            }
        }).then((result) => {
            if (result.isDismissed) {
                Swal.fire('تم إلغاء العملية', '', 'info');
                return;
            }

            const productPrice = parseFloat(result.value);

            // الخطوة الثالثة: التحقق من حساب المنتج كصنف
            Swal.fire({
                title: `هل تريد حساب "${productName}" كصنف؟`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'نعم',
                cancelButtonText: 'لا',
            }).then((confirmResult) => {
                const includeInCount = confirmResult.isConfirmed;

                // إضافة المنتج إلى الجدول
                addCustomProductToTable(productName, productPrice, includeInCount);

                // تأكيد الإضافة
                Swal.fire({
                    title: `تم إضافة المنتج "${productName}" بسعر ${productPrice} ريال`,
                    text: includeInCount ? 'تم حساب المنتج كصنف.' : 'تم إضافة المنتج دون احتسابه كصنف.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            });
        });
    });
}

// وظيفة إضافة المنتج إلى الجدول
function addCustomProductToTable(productName, productPrice, includeInCount) {
    const tableBody = document.getElementById('product-table-body');
    const newRow = document.createElement('tr');

    // إنشاء صف للمنتج
    newRow.innerHTML = `
        <td>${includeInCount ? 1 : 0}</td>
        <td>${productName}</td>
        <td>${productPrice} ريال</td>
        <td>
            <button class="delete-btn" onclick="deleteRow(this)">حذف</button>
        </td>
    `;
    tableBody.appendChild(newRow);

    // تحديث الإجمالي دائمًا
    updateTotalPrice(productPrice);
}

// وظيفة تحديث الإجمالي
function updateTotalPrice(additionalAmount) {
    const totalPriceElement = document.getElementById('total-price');
    let currentTotal = parseFloat(totalPriceElement.textContent.replace(' ريال', '').trim());
    currentTotal += additionalAmount;
    totalPriceElement.textContent = `${currentTotal} ريال`;
}


function addNewRowToTable(productName, productPrice) {
    const tableBody = document.getElementById('product-table-body');

    // إنشاء صف جديد للمنتج
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>1</td> <!-- العدد يكون دائمًا 1 -->
        <td>${productName}</td>
        <td>${productPrice} ريال</td>
        <td>
        <td>
        <button class="delete-btn" onclick="deleteRow(this)">حذف</button>
    </td>
    
delete                    حذف
            </button>
        </td>
    `;
    tableBody.appendChild(newRow);
}

function deleteProductRow(button) {
    // حذف الصف الحالي
    const row = button.parentElement.parentElement;
    row.remove();
}





function deleteProductRow(button) {
    // حذف الصف الحالي
    const row = button.parentElement.parentElement;
    row.remove();
}





function updateMadaPayment() {
    const madaAmount = parseFloat(document.getElementById('mada-amount').value) || 0;
    const totalAmount = parseFloat(document.getElementById('total-price').textContent.replace(' ريال', '')) || 0;

    if (madaAmount > totalAmount) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ!',
            text: 'المبلغ المدخل في مدى لا يمكن أن يكون أكبر من الإجمالي.',
            confirmButtonText: 'حسناً',
            timer: 3000,
            timerProgressBar: true
        });
        document.getElementById('mada-amount').value = '';
        document.getElementById('cash-amount').value = '';
    } else {
        document.getElementById('cash-amount').value = (totalAmount - madaAmount);
    }
}


function updateCashPayment() {
    const cashAmount = parseFloat(document.getElementById('cash-amount').value) || 0;
    const totalAmount = parseFloat(document.getElementById('total-price').textContent.replace(' ريال', '')) || 0;
    const madaField = document.getElementById('mada-amount');
    const remainingMessage = document.getElementById('remaining-message');

    if (cashAmount >= totalAmount) {
        // إذا كان المبلغ المدخل في الكاش أكبر أو يساوي الإجمالي، صفر مدى وأظهر المتبقي
        madaField.value = '';
        const remaining = (cashAmount - totalAmount);
        remainingMessage.textContent = `المتبقي للعميل: ${remaining} ريال`;
        remainingMessage.style.color = "green";
    } else {
        // إذا كان الكاش أقل من الإجمالي، أكمل مدى
        madaField.value = (totalAmount - cashAmount);
        remainingMessage.textContent = '';
    }
}





// ربط الحقول بالدوال لتحديث الدفع
document.getElementById('mada-amount').addEventListener('input', updateMadaPayment);
document.getElementById('cash-amount').addEventListener('input', updateCashPayment);





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









function clearTable() {
    const tableBody = document.getElementById("product-table-body");
    const totalPriceElement = document.getElementById("total-price");

    tableBody.innerHTML = ""; // مسح الصفوف
    totalPriceElement.textContent = "0 ريال"; // تصفير الإجمالي
}


function deleteRow(button) {
    const row = button.closest("tr"); // تحديد الصف
    const countCell = row.cells[0]; // تحديد خلية العدد
    const priceCell = row.cells[2]; // تحديد خلية السعر الإجمالي للمنتج
    const totalPriceElement = document.getElementById("total-price"); // تحديد خلية الإجمالي الكلي

    // قراءة العدد الحالي وسعر المنتج الإجمالي
    let count = parseInt(countCell.textContent.trim());
    let totalProductPrice = parseFloat(priceCell.textContent.replace(' ريال', '').trim());
    const unitPrice = totalProductPrice / count; // حساب سعر الوحدة

    if (count > 1) {
        // تقليل العدد إذا كان أكبر من 1
        count--;
        countCell.textContent = count;

        // تحديث السعر الإجمالي للمنتج
        totalProductPrice = (unitPrice * count);
        priceCell.textContent = `${totalProductPrice} ريال`;

        // تحديث الإجمالي الكلي
        const currentTotal = parseFloat(totalPriceElement.textContent.replace(' ريال', '').trim());
        totalPriceElement.textContent = `${(currentTotal - unitPrice)} ريال`;
    } else {
        // إذا كان العدد 1، احذف المنتج
        const currentTotal = parseFloat(totalPriceElement.textContent.replace(' ريال', '').trim());
        totalPriceElement.textContent = `${(currentTotal - totalProductPrice)} ريال`; // خصم السعر الإجمالي للمنتج
        row.remove(); // حذف الصف
    }

    // إذا كان الجدول فارغًا، إعادة تعيين الإجمالي إلى 0
    const rowsRemaining = document.querySelectorAll("#product-table-body tr");
    if (rowsRemaining.length === 0) {
        totalPriceElement.textContent = "0 ريال";
    }
}






function saveEditedOrder() {
    const tableBody = document.getElementById('product-table-body');
    const rows = Array.from(tableBody.rows);

    const updatedOrders = rows.map(row => {
        return {
            product: row.cells[1].textContent,
            price: parseFloat(row.cells[2].textContent.replace(' ريال', '')),
            count: parseInt(row.cells[0].textContent)
        };
    });

    const totalPrice = parseFloat(document.getElementById('total-price').textContent.replace(' ريال', ''));
    const orderNumber = parseInt(document.getElementById('order-number').textContent);

    const savedOrders = JSON.parse(localStorage.getItem('orders'))    || [];
    console.log("Saved Orders:", savedOrders);

    const updatedOrderIndex = savedOrders.findIndex(order => order.orderNumber === orderNumber);

    if (updatedOrderIndex !== -1) {
        // نقل الطلب إلى المحذوفة قبل حذفه
        const deletedOrders = JSON.parse(localStorage.getItem('deletedOrders')) || [];
        const deletedOrder = {
            ...savedOrders[updatedOrderIndex],
            deletionTimestamp: new Date().toISOString()
        };
        deletedOrders.push(deletedOrder);
        localStorage.setItem('deletedOrders', JSON.stringify(deletedOrders));

        // حذف الطلب القديم
        savedOrders.splice(updatedOrderIndex, 1);
    }

    // إضافة الطلب المعدل إلى المحفوظة
    savedOrders.push({
        orderNumber: orderNumber,
        orders: updatedOrders,
        totalPrice: totalPrice,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('orders', JSON.stringify(savedOrders));
    alert("تم تعديل الطلب وحفظه بنجاح.");
}


function updateRow(row, unitPrice, action) {
    const countCell = row.cells[0];
    const priceCell = row.cells[2];
    const totalPriceElement = document.getElementById("total-price");

    let count = parseInt(countCell.textContent.trim());
    const totalProductPrice = parseFloat(priceCell.textContent.replace(" ريال", "").trim());
    const currentTotal = parseFloat(totalPriceElement.textContent.replace(" ريال", "").trim());

    if (action === "add") {
        // زيادة العدد
        count++;
        countCell.textContent = count;
        const newTotal = (unitPrice * count);
        priceCell.textContent = `${newTotal} ريال`;
        totalPriceElement.textContent = `${(currentTotal + unitPrice)} ريال`;
    } else if (action === "subtract") {
        if (count > 1) {
            // تقليل العدد
            count--;
            countCell.textContent = count;
            const newTotal = (unitPrice * count);
            priceCell.textContent = `${newTotal} ريال`;
            totalPriceElement.textContent = `${(currentTotal - unitPrice)} ريال`;
        } else {
            // حذف المنتج عند العدد 1
            totalPriceElement.textContent = `${(currentTotal - totalProductPrice)} ريال`;
            row.remove();
        }
    }
}
async function sendCutCommand() {
    try {
        const devices = await navigator.usb.getDevices();
        if (devices.length > 0) {
            const printerDevice = devices[0];
            await printerDevice.open();
            await printerDevice.selectConfiguration(1);
            await printerDevice.claimInterface(0);
            const cutCommand = new Uint8Array([0x1B, 0x69]); // أمر القطع ESC i
            await printerDevice.transferOut(1, cutCommand);
            console.log("تم إرسال أمر القطع بنجاح.");
            await printerDevice.releaseInterface(0);
            await printerDevice.close();
        } else {
            console.error("لم يتم العثور على طابعة.");
        }
    } catch (error) {
        console.error("فشل في إرسال أمر القطع:", error);
    }
}

document.getElementById('print-order-btn').addEventListener('click', () => {
    Swal.fire({
        title: 'طباعة طلب',
        input: 'number',
        inputLabel: 'أدخل رقم الطلب',
        inputPlaceholder: 'رقم الطلب',
        showCancelButton: true,
        cancelButtonText: 'إلغاء',
        confirmButtonText: 'طباعة',
        inputValidator: (value) => {
            if (value && value <= 0) {
                return 'يرجى إدخال رقم طلب صالح!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const orderNumber = parseInt(result.value);
            if (orderNumber) {
                printOrderByNumber(orderNumber);
            } else {
                printLastOrder(); // طباعة آخر طلب
            }
        }
    });
});

function printLastOrder() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    if (orders.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'لا توجد طلبات',
            text: 'لا يوجد أي طلبات محفوظة للطباعة.',
            confirmButtonText: 'حسناً'
        });
        return;
    }

    const lastOrder = orders[orders.length - 1]; // آخر طلب في القائمة
    printOrderByNumber(lastOrder.orderNumber);
}




function printLastOrder() {
    // الحصول على جميع الطلبات من localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    // إذا لم تكن هناك طلبات
    if (orders.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'لا توجد طلبات',
            text: 'لم يتم العثور على أي طلبات.',
            confirmButtonText: 'حسناً'
        });
        return;
    }

    // الحصول على آخر طلب
    const lastOrder = orders[orders.length - 1];

    const logo = new Image();
    logo.src = "https://i.postimg.cc/g2GmHSFp/bangalogo.png";

    logo.onload = function () {
        const printContent = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; direction: rtl; text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin: auto; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: center; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>        
                <p style="font-size: 20px;"><strong>فاتورة مطبخ</strong></p>
                <p><strong>رقم الطلب:</strong> ${lastOrder.orderNumber}</p>
                <p style="font-size: 12px;">
                    <strong>تاريخ الطلب:</strong> ${new Date(lastOrder.timestamp).toLocaleDateString()} |
                    <strong>وقت الطلب:</strong> ${new Date(lastOrder.timestamp).toLocaleTimeString()}
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>العدد</th>
                            <th>المنتج</th> 
                        </tr>
                    </thead>
                    <tbody>
                        ${lastOrder.orders.map(item => `
                            <tr>
                                <td>${item.count}</td>
                                <td>${item.product}</td>
                            </tr>
                            
                        `).join('')}
                        
                    </tbody>
                </table>
                <div style="text-align: center; margin-top: 20px;">
                <strong>إجمالي عدد الأصناف:</strong> ${lastOrder.totalItems}
            </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();

        printWindow.onafterprint = function () {
            printWindow.close();
        };

        printWindow.print();

        setTimeout(async () => {
            await sendCutCommand(); // استدعاء أمر القطع
        
           
        }, 11000); // تأخير 10 ثانية     
        // استعادة المحتوى الأصلي وتنفيذ الخطوات الأخرى
        
    
    };

    logo.onerror = function () {
        Swal.fire({
            icon: 'error',
            title: 'خطأ في تحميل الشعار',
            text: 'تعذر تحميل الشعار. يرجى التحقق من الرابط.',
            confirmButtonText: 'حسناً'
        });
    };
}














// دالة لتحويل الأرقام العربية إلى أرقام إنجليزية ومنع الحروف
function validateAndConvertInput(input) {
    // إزالة أي حروف غير أرقام
    input.value = input.value.replace(/[^٠-٩0-9]/g, '');

    // تحويل الأرقام العربية إلى أرقام إنجليزية
    input.value = input.value.replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit));
}

// تطبيق التحقق والتحويل على حقل مدى
document.getElementById('mada-amount').addEventListener('input', function () {
    validateAndConvertInput(this);
    updateMadaPayment(); // استدعاء الدالة لتحديث الحساب
});

// تطبيق التحقق والتحويل على حقل كاش
document.getElementById('cash-amount').addEventListener('input', function () {
    validateAndConvertInput(this);
    updateCashPayment(); // استدعاء الدالة لتحديث الحساب
});





function editNotes(row) {
    const productName = row.cells[1].textContent.trim(); // اسم المنتج
    const productCount = parseInt(row.cells[0].textContent.trim()); // العدد الحالي

    Swal.fire({
        title: `إضافة ملاحظات لـ "${productName}"`,
        html: `
            <div style="text-align: left; font-size: 16px; line-height: 1.8;">
                <label><strong>عدد الوحدات:</strong></label>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <button id="decreaseCount" style="width: 40px; height: 40px; font-size: 20px; background-color: #f2f2f2; border: 1px solid #ccc; border-radius: 5px;">-</button>
                    <span id="noteCountDisplay" style="font-weight: bold; font-size: 18px; padding: 0 10px;">${productCount}</span>
                    <button id="increaseCount" style="width: 40px; height: 40px; font-size: 20px; background-color: #f2f2f2; border: 1px solid #ccc; border-radius: 5px;">+</button>
                </div>
                <label><strong>اختر ملاحظات جاهزة:</strong></label>
                <div id="readyNotes" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                    <button class="note-btn" data-note="بدون سكر" style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ccc; border-radius: 5px; cursor: pointer;">بدون سكر</button>
                    <button class="note-btn" data-note="بدون ثلج" style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ccc; border-radius: 5px; cursor: pointer;">بدون ثلج</button>
                    <button class="note-btn" data-note="بدون آيسكريم" style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ccc; border-radius: 5px; cursor: pointer;">بدون آيسكريم</button>
                    <button class="note-btn" data-note="بدون إضافات" style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ccc; border-radius: 5px; cursor: pointer;">بدون إضافات</button>
                </div>
                <label><strong>أو أضف ملاحظة مخصصة:</strong></label>
                <input id="customNote" type="text" placeholder="اكتب ملاحظة مخصصة" style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 5px; margin-top: 10px;">
            </div>
        `,
        showCancelButton: true,
        cancelButtonText: 'إلغاء',
        confirmButtonText: 'حفظ',
        didOpen: () => {
            let currentCount = productCount;

            // تحديث العدد
            const countDisplay = document.getElementById('noteCountDisplay');
            const increaseButton = document.getElementById('increaseCount');
            const decreaseButton = document.getElementById('decreaseCount');

            increaseButton.addEventListener('click', () => {
                if (currentCount < productCount) {
                    currentCount++;
                    countDisplay.textContent = currentCount;
                }
            });

            decreaseButton.addEventListener('click', () => {
                if (currentCount > 1) {
                    currentCount--;
                    countDisplay.textContent = currentCount;
                }
            });

            // التعامل مع أزرار الملاحظات
            const noteButtons = document.querySelectorAll('.note-btn');
            noteButtons.forEach((btn) => {
                btn.addEventListener('click', () => {
                    btn.classList.toggle('selected'); // تفعيل/إلغاء تفعيل الزر
                    btn.style.backgroundColor = btn.classList.contains('selected') ? '#007bff' : '#f2f2f2';
                    btn.style.color = btn.classList.contains('selected') ? 'white' : 'black';
                });
            });
        },
        preConfirm: () => {
            const selectedCount = parseInt(document.getElementById('noteCountDisplay').textContent) || 0;
            const selectedNotes = Array.from(document.querySelectorAll('.note-btn.selected')).map(btn => btn.dataset.note);
            const customNote = document.getElementById('customNote').value.trim();
            if (customNote) selectedNotes.push(customNote);

            return {
                count: selectedCount,
                notes: selectedNotes
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { count, notes } = result.value;
            const notesText = notes.join(', ') || "بدون ملاحظات";

            // تحديث خلية المنتج بإضافة العدد والملاحظات
            row.cells[1].innerHTML = `
                ${productName}
                <br>
                <small style="color: gray; font-size: 12px;">عدد: ${count} (${notesText})</small>
            `;

            Swal.fire({
                title: 'تم تحديث الملاحظات!',
                text: `تم تطبيق الملاحظات على "${productName}": عدد: ${count}, ${notesText}`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}



function printDirectlyWithDate() {
        // نافذة إدخال التاريخ ورقم الطلب
        Swal.fire({
            title: 'اختيار تاريخ الطلب ورقم الطلب',
            html: `
                <label>أدخل التاريخ:</label>
                <input type="date" id="order-date" style="width: 100%; padding: 10px; margin-bottom: 10px; font-size: 16px;">
                <label>أدخل رقم الطلب:</label>
                <input type="number" id="order-number-input" style="width: 100%; padding: 10px; font-size: 16px;" placeholder="أدخل رقم الطلب">
            `,
            showCancelButton: true,
            confirmButtonText: 'التالي',
            cancelButtonText: 'إلغاء',
            preConfirm: () => {
                const dateInput = document.getElementById('order-date').value;
                const orderNumberInput = document.getElementById('order-number-input').value;
    
                if (!dateInput) {
                    Swal.showValidationMessage('يرجى إدخال تاريخ صالح!');
                    return false;
                }
    
                if (!orderNumberInput || parseInt(orderNumberInput) <= 0) {
                    Swal.showValidationMessage('يرجى إدخال رقم طلب صالح!');
                    return false;
                }
    
                return {
                    date: dateInput,
                    orderNumber: parseInt(orderNumberInput)
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { date, orderNumber } = result.value;
                const selectedDate = new Date(date);
    
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
    
                const orderDate = selectedDate.toLocaleDateString();
                const orderTime = new Date().toLocaleTimeString();
    
                const madaAmount = parseFloat(document.getElementById('mada-amount').value) || 0;
                let cashAmount = parseFloat(document.getElementById('cash-amount').value) || 0;
                const totalAmount = parseFloat(document.getElementById('total-price').textContent.replace(' ريال', '')) || 0;
    
                const totalPaid = madaAmount + cashAmount;
                localStorage.setItem(`totalPaid-${orderNumber}`, totalPaid);
                

    
                if (totalPaid < totalAmount || totalAmount === 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'خطأ في المبلغ المدفوع',
                        text: `المبلغ المدفوع (${totalPaid} ريال) أقل من الإجمالي (${totalAmount} ريال). يرجى تعديل طريقة الدفع.`,
                        confirmButtonText: 'حسناً'
                    });
                    return;
                }
    
                if (cashAmount > totalAmount) {
                    cashAmount = totalAmount;
                }
    
                let paymentMethod = "";
    
                if (madaAmount > 0 && cashAmount > 0) {
                    paymentMethod = `مدى: ${madaAmount} ريال <br> كاش: ${cashAmount} ريال`;
                } else if (madaAmount > 0) {
                    paymentMethod = `مدى: ${madaAmount} ريال`;
                } else if (cashAmount > 0) {
                    paymentMethod = `كاش: ${cashAmount} ريال`;
                }
    
                let remainingMessage = "";
                if (totalPaid > totalAmount) {
                    const remaining = totalPaid - totalAmount;
                    remainingMessage = `<p style="color: red; font-weight: bold;">المتبقي للعميل: ${remaining} ريال</p>`;
                }
    
                const previousOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
                const newOrder = {
                    orderNumber: orderNumber,
                    orders: Array.from(document.querySelectorAll('#product-table-body tr')).map(row => ({
                        product: row.cells[1].textContent,
                        price: parseFloat(row.cells[2].textContent.replace(' ريال', '')),
                        count: parseInt(row.cells[0].textContent)
                    })),
                    totalPrice: totalAmount,
                    paymentMethod: paymentMethod,
                    timestamp: selectedDate.toISOString()
                };
    
                previousOrders.push(newOrder);
                localStorage.setItem('orders', JSON.stringify(previousOrders));
    
                const totalItems = Array.from(printTable.querySelectorAll("tbody tr")).reduce((sum, row) => {
                    const countCell = row.cells[0]; // عمود العدد
                    const count = parseInt(countCell.textContent.trim());
                    return sum + count;
                }, 0);
    
                const printContent = `
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; direction: rtl; text-align: center; }
                            table { width: 100%; border-collapse: collapse; margin: auto; }
                            th, td { border: 1px solid #000; padding: 8px; text-align: center; }
                            th { background-color: #f2f2f2; }
                        </style>
                    </head>
                    <body>
                        <div style="text-align: center;">
                            <img src="https://i.postimg.cc/g2GmHSFp/bangalogo.png" alt="شعار" style="width: 100px; margin-bottom: 10px;">
                            <p style="font-size: 12px;">
                                <strong>تاريخ الطلب:</strong> ${orderDate} |
                                <strong>وقت الطلب:</strong> ${orderTime}
                            </p>
                        </div>
                        ${printTable.outerHTML}
                        <div style="text-align: center; margin-top: 20px;">
                            <strong>إجمالي عدد الأصناف:</strong> ${totalItems}
                        </div>
                        <div style="text-align: center; margin-top: 20px;">
                            <strong>طريقة الدفع:</strong><br>
                            ${paymentMethod}
                        </div>
                        ${remainingMessage}
                    </body>
                    </html>
                `;
    
                const originalContent = document.body.innerHTML;
    
                document.body.innerHTML = printContent;
                window.print();
                document.body.innerHTML = originalContent;
                window.location.reload();

                    clearTable();
            }
        });
    }
    






document.getElementById('cut-and-print-btn').addEventListener('click', async () => {
    try {
        // استدعاء دالة قطع الورق
        await sendCutCommand();
        console.log("تم قطع الورق بنجاح.");

        // استدعاء دالة الطباعة
        printLastOrder(); // طباعة آخر طلب    
        
        
    } catch (error) {
        console.error("حدث خطأ أثناء تنفيذ العملية:", error);
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حدث خطأ أثناء تنفيذ العملية. يرجى المحاولة مرة أخرى.',
            confirmButtonText: 'حسناً'
        });
    }
});




function rebindEvents() {
    const cutAndPrintButton = document.getElementById('cut-and-print-btn');
    if (cutAndPrintButton) {
        cutAndPrintButton.addEventListener('click', async () => {
            await sendCutCommand();
            printDirectly();
        });
    }
}





function addNewOrderToLivePage(order) {
    const livePage = window.open("orders-live.html", "LiveOrders");
    if (livePage) {
        livePage.addNewOrder(order); // استدعاء الدالة لإضافة الطلب الجديد
    }
}




const firebaseConfig = {
  apiKey: "AIzaSyB1gEIPMXcgTBu4jJ6_Et-xGZrmTFpo4YY",
  authDomain: "bangadata-9c1c6.firebaseapp.com",
  projectId: "bangadata-9c1c6",
  storageBucket: "bangadata-9c1c6.firebasestorage.app",
  messagingSenderId: "1087259460163",
  appId: "1:1087259460163:web:a9afee486a6213b6378af6",
  measurementId: "G-YJMX7YZRLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
