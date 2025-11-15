// ===== Helper: read cart from localStorage =====
function loadCart() {
  try {
    const raw = localStorage.getItem('hsmfCart');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error('Error reading cart from localStorage:', e);
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('hsmfCart', JSON.stringify(cart));
}

// ===== Price formatting =====
function formatPrice(value) {
  return '$' + value.toFixed(2);
}

document.addEventListener('DOMContentLoaded', function () {
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyCartMessage = document.getElementById('emptyCartMessage');

  const subtotalSpan = document.getElementById('subtotalAmount');
  const shippingSpan = document.getElementById('shippingAmount');
  const totalSpan = document.getElementById('totalAmount');

  const discountInput = document.getElementById('discountCode');
  const applyDiscountBtn = document.getElementById('applyDiscountBtn');

  const completeOrderBtn = document.getElementById('completeOrderBtn');
  const backToShippingBtn = document.getElementById('backToShippingBtn');

  const creditRadio = document.getElementById('credit');
  const paypalRadio = document.getElementById('paypal');
  const creditBox = document.getElementById('creditBox');

  const sameBilling = document.getElementById('same');
  const differentBilling = document.getElementById('different');
  const billingExtra = document.getElementById('billingExtra');

  const editLink = document.querySelector('.edit-link');
  const infoItems = document.querySelectorAll('.info-item p');

  const backToTopBtn = document.getElementById('backToTop');

  let cart = loadCart();
  let discountValue = 0;
  let shippingFlat = 20; // same as your text: Flat Rate $20

  // ===== Render cart =====
  function renderCart() {
    cartItemsContainer.innerHTML = '';

    if (!cart || cart.length === 0) {
      emptyCartMessage.style.display = 'block';
      subtotalSpan.textContent = '$0.00';
      shippingSpan.textContent = '$0.00';
      totalSpan.textContent = '$0.00';
      return;
    }

    emptyCartMessage.style.display = 'none';

    let subtotal = 0;

    cart.forEach(item => {
      const quantity = item.quantity || 1;
      const price = Number(item.price) || 0;
      const lineTotal = price * quantity;
      subtotal += lineTotal;

      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';

      cartItem.innerHTML = `
        <div class="item-image">
          ${item.img ? `<img src="${item.img}" alt="${item.name || 'Item'}">` : ''}
          <div class="item-badge">${quantity}</div>
        </div>
        <div class="item-details">
          <h4>${item.name || 'Product'}</h4>
          <p>${quantity} × ${formatPrice(price)}</p>
        </div>
        <div class="item-price">${formatPrice(lineTotal)}</div>
      `;

      cartItemsContainer.appendChild(cartItem);
    });

    // shipping only if there is something in cart
    const shipping = subtotal > 0 ? shippingFlat : 0;
    const total = Math.max(0, subtotal + shipping - discountValue);

    subtotalSpan.textContent = formatPrice(subtotal);
    shippingSpan.textContent = formatPrice(shipping);
    totalSpan.textContent = formatPrice(total);
  }

  renderCart();

  // ===== Discount logic =====
  let discountApplied = false;

  applyDiscountBtn.addEventListener('click', function () {
    if (discountApplied) {
      alert('A discount has already been applied.');
      return;
    }

    const code = discountInput.value.trim().toUpperCase();
    if (!code) {
      alert('Please enter a discount code.');
      return;
    }

    let discount = 0;
    if (code === 'SAVE10') {
      discount = 10;
    } else if (code === 'SAVE20') {
      discount = 20;
    } else {
      alert('Invalid discount code.');
      return;
    }

    // Recalculate subtotal to know limits
    let subtotal = 0;
    cart.forEach(item => {
      const q = item.quantity || 1;
      const p = Number(item.price) || 0;
      subtotal += q * p;
    });

    if (subtotal === 0) {
      alert('Cannot apply discount to an empty cart.');
      return;
    }

    discountValue = Math.min(discount, subtotal);
    discountApplied = true;
    applyDiscountBtn.textContent = 'Applied';

    renderCart();
    alert(`Discount of $${discount.toFixed(2)} applied!`);
  });

  // ===== Payment method switching =====
  if (creditRadio && paypalRadio && creditBox) {
    paypalRadio.addEventListener('change', function () {
      if (this.checked) {
        creditBox.style.display = 'none';
      }
    });

    creditRadio.addEventListener('change', function () {
      if (this.checked) {
        creditBox.style.display = 'block';
      }
    });
  }

  // ===== Billing address extra form =====
  function showBillingForm() {
    if (billingExtra.querySelector('#billing-form')) return;

    const formHTML = `
      <div id="billing-form" style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e4c9b3;">
        <div style="margin-bottom: 15px;">
          <label style="display: block; font-size: 13px; color: #5c3d2e; margin-bottom: 8px; font-weight: 500;">Full Name</label>
          <input type="text" style="width: 100%; padding: 14px 16px; border: 2px solid #e4c9b3; border-radius: 10px; font-size: 14px;">
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; font-size: 13px; color: #5c3d2e; margin-bottom: 8px; font-weight: 500;">Address</label>
          <input type="text" style="width: 100%; padding: 14px 16px; border: 2px solid #e4c9b3; border-radius: 10px; font-size: 14px;">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
          <div>
            <label style="display: block; font-size: 13px; color: #5c3d2e; margin-bottom: 8px; font-weight: 500;">City</label>
            <input type="text" style="width: 100%; padding: 14px 16px; border: 2px solid #e4c9b3; border-radius: 10px; font-size: 14px;">
          </div>
          <div>
            <label style="display: block; font-size: 13px; color: #5c3d2e; margin-bottom: 8px; font-weight: 500;">Postal Code</label>
            <input type="text" style="width: 100%; padding: 14px 16px; border: 2px solid #e4c9b3; border-radius: 10px; font-size: 14px;">
          </div>
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; font-size: 13px; color: #5c3d2e; margin-bottom: 8px; font-weight: 500;">Country</label>
          <input type="text" style="width: 100%; padding: 14px 16px; border: 2px solid #e4c9b3; border-radius: 10px; font-size: 14px;">
        </div>
      </div>
    `;
    billingExtra.insertAdjacentHTML('beforeend', formHTML);
  }

  function hideBillingForm() {
    const form = billingExtra.querySelector('#billing-form');
    if (form) form.remove();
  }

  if (sameBilling && differentBilling) {
    differentBilling.addEventListener('change', function () {
      if (this.checked) showBillingForm();
    });

    sameBilling.addEventListener('change', function () {
      if (this.checked) hideBillingForm();
    });
  }

  // ===== Edit contact info =====
  if (editLink && infoItems.length > 0) {
    editLink.addEventListener('click', function (e) {
      e.preventDefault();

      if (editLink.textContent === 'Edit') {
        infoItems.forEach(item => {
          const currentText = item.textContent;
          item.innerHTML = `<input type="text" value="${currentText}" style="width: 100%; padding: 8px; border: 2px solid #e4c9b3; border-radius: 8px; font-size: 14px;">`;
        });
        editLink.textContent = 'Save';
      } else {
        infoItems.forEach(item => {
          const input = item.querySelector('input');
          if (input) {
            item.textContent = input.value;
          }
        });
        editLink.textContent = 'Edit';
        alert('Information updated!');
      }
    });
  }

  // ===== Back to Shipping =====
  if (backToShippingBtn) {
    backToShippingBtn.addEventListener('click', function () {
      // You can change this to another page if needed (e.g., "shipping.html")
      window.location.href = 'shop.html';
    });
  }

  // ===== Complete Order =====
  if (completeOrderBtn) {
    completeOrderBtn.addEventListener('click', function () {
      if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
      }

      if (creditRadio && creditRadio.checked) {
        const cardNum = document.getElementById('cardNumber').value.trim();
        const cardName = document.getElementById('cardName').value.trim();
        const expiry = document.getElementById('expiry').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        if (!cardNum || !cardName || !expiry || !cvv) {
          alert('Please fill all credit card fields.');
          return;
        }
        if (cardNum.replace(/\s/g, '').length < 13) {
          alert('Card number seems too short.');
          return;
        }
      }

      alert('Order completed successfully! (Demo)');
      // Clear cart for demo purposes
      cart = [];
      saveCart(cart);
      discountValue = 0;
      discountApplied = false;
      discountInput.value = '';
      applyDiscountBtn.textContent = 'Apply Coupon';
      renderCart();
    });
  }

  // ===== Back to Top button =====
  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = 'flex';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
