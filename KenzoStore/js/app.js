let data = [];
let hasilBarang = [];

// ================= AUTO BARANG =================
function autoIsiBarang() {
  const keyword = document.getElementById("barang").value;

  if (!keyword) {
    document.getElementById("suggestions").innerHTML = "";
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbwXR9q2IgLzysjgRCYSr1-FpSbOVRF-_hW0xwb6NPE3hSZ-RHI_-WFTcalB6ApwK8zZXw/exec?type=barang&keyword=" + encodeURIComponent(keyword))
    .then(res => res.json())
    .then(res => {
      hasilBarang = res;

      let html = "";

      res.forEach((item, i) => {
        html += `<div onclick="pilihBarang(${i})">${item.barang}</div>`;
      });

      document.getElementById("suggestions").innerHTML = html;
    });
}

// ================= PILIH =================
function pilihBarang(i) {
  const item = hasilBarang[i];

  const barangEl = document.getElementById("barang");
  const hargaEl = document.getElementById("harga");
  const supplierEl = document.getElementById("supplier");
  const satuanEl = document.getElementById("satuan");

  if (barangEl) barangEl.value = item.barang;
  if (hargaEl) hargaEl.value = item.harga;
  if (supplierEl) supplierEl.value = item.supplier || "";
  if (satuanEl) satuanEl.value = item.satuan || "pc";

  const s = document.getElementById("suggestions");
  if (s) s.innerHTML = "";
}

// ================= ENTER SELECT =================
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("barang");

  if (input) {
    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (hasilBarang.length > 0) {
          pilihBarang(0);
        }
      }
    });
  }
});

// ================= TAMBAH ITEM =================
function tambahItem(mode = "jual") {
  const barang = document.getElementById("barang").value;
  const qty = Number(document.getElementById("qty").value);
  const harga = Number(document.getElementById("harga").value);
  const satuan = document.getElementById("satuan").value;

  if (!barang || !qty || !harga) {
    alert("Lengkapi data!");
    return;
  }

  const subtotal = qty * harga;

  data.push({
    mode,
    barang,
    qty,
    harga,
    satuan,
    subtotal,
    status: "lunas"
  });

  render();
  resetForm();
}

// ================= RENDER =================
function render() {
  const cart = document.getElementById("cart");
  if (!cart) return;

  cart.innerHTML = "";

  let total = 0;

  data.forEach(item => {
    total += item.subtotal;

    cart.innerHTML += `
      <div>
        ${item.qty} ${item.satuan} ${item.barang}
        <br>
        x ${formatRupiah(item.harga)} → subtotal ${formatRupiah(item.subtotal)}
      </div>
    `;
  });

  cart.innerHTML += `<div><b>Total ${formatRupiah(total)}</b></div>`;
}

// ================= RESET =================
function resetForm() {
  const barang = document.getElementById("barang");
  const qty = document.getElementById("qty");
  const harga = document.getElementById("harga");

  if (barang) barang.value = "";
  if (qty) qty.value = 1;
  if (harga) harga.value = "";
}

// ================= FORMAT =================
function formatRupiah(angka) {
  return angka.toLocaleString("id-ID");
}