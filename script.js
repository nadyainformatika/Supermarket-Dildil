const productsData = [
  { name: "Butter Cookies", icon: "🍪", price: 12000 },
  { name: "Strawberry Milk", icon: "🥛", price: 9000 },
  { name: "Fresh Bread", icon: "🍞", price: 15000 },
  { name: "Honey Cake", icon: "🍰", price: 18000 },
  { name: "Sweet Candy", icon: "🍬", price: 3000 },
  { name: "Peach Juice", icon: "🍑", price: 8000 },
  { name: "Sunflower", icon: "🌻", price: 10000 },
  { name: "Little Teddy", icon: "🧸", price: 25000 },
  { name: "Ice Cream", icon: "🍦", price: 7000 }
];

let basketData = {};
let drawerMoney = 500000;
let salesCount = 0;
let totalRevenue = 0;

function formatRupiah(number) {
  return "Rp" + number.toLocaleString("id-ID");
}

function drawProducts() {
  document.getElementById("catalog").innerHTML =
    productsData.map((product, index) => `
      <div class="product">
        <div class="picture">${product.icon}</div>
        <h3>${product.name}</h3>
        <p>${formatRupiah(product.price)}</p>
        <button onclick="addProduct(${index})">+ Add</button>
      </div>
    `).join("");
}

function addProduct(index) {
  basketData[index] = (basketData[index] || 0) + 1;
  renderBasket();
}

function removeProduct(index) {
  basketData[index]--;
  if (basketData[index] <= 0) {
    delete basketData[index];
  }
  renderBasket();
}

function calculateTotal() {
  return Object.keys(basketData).reduce((sum, index) => {
    return sum +
      productsData[index].price * basketData[index];
  }, 0);
}

function renderBasket() {
  const keys = Object.keys(basketData);
  const basket = document.getElementById("basket");

  if (keys.length === 0) {
    basket.textContent = "Belum ada barang. Yuk pilih produk!";
  } else {
    basket.innerHTML = keys.map(index => `
      <div class="basket-row">
        <span>
          ${productsData[index].icon}
          ${productsData[index].name} × ${basketData[index]}<br>
          ${formatRupiah(
      productsData[index].price * basketData[index]
    )}
        </span>
        <button onclick="removeProduct(${index})">−</button>
      </div>
    `).join("");
  }

  document.getElementById("total").textContent =
    formatRupiah(calculateTotal());
}

function resetBasket() {
  basketData = {};
  document.getElementById("payment").value = "";
  document.getElementById("notice").style.display = "none";
  renderBasket();
}

function processPayment() {
  const total = calculateTotal();
  const payment = Number(
    document.getElementById("payment").value
  );
  const notice = document.getElementById("notice");

  notice.style.display = "block";

  if (total === 0) {
    notice.textContent = "Keranjang masih kosong!";
    return;
  }

  if (!Number.isSafeInteger(payment) || payment < total) {
    notice.textContent = "Uang pembayaran kurang atau tidak valid!";
    return;
  }

  const change = payment - total;

  drawerMoney += total;
  totalRevenue += total;
  salesCount++;

  document.getElementById("cash").textContent =
    formatRupiah(drawerMoney);
  document.getElementById("revenue").textContent =
    formatRupiah(totalRevenue);
  document.getElementById("sales").textContent = salesCount;

  notice.innerHTML =
    "✓ Pembayaran berhasil!<br>" +
    "Total: " + formatRupiah(total) + "<br>" +
    "Uang bayar: " + formatRupiah(payment) + "<br>" +
    "Kembalian: " + formatRupiah(change) + "<br>" +
    "Terima kasih sudah berbelanja ☀️";

  basketData = {};
  document.getElementById("payment").value = "";
  renderBasket();
}

drawProducts();
renderBasket();
