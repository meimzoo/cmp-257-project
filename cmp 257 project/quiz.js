const form = document.getElementById("skinForm");
const resultCard = document.getElementById("result");
const resultTitle = document.getElementById("resultTitle");
const amList = document.getElementById("amList");
const pmList = document.getElementById("pmList");

var stepElements = document.querySelectorAll(".form-step");
var currentStepIndex = 0;
var totalSteps = stepElements.length;

var btnPrev = document.getElementById("btnPrev");
var btnNext = document.getElementById("btnNext");
var btnSubmit = document.getElementById("btnSubmit");

var stepNow = document.getElementById("stepNow");
var stepTotal = document.getElementById("stepTotal");
var stepBar = document.getElementById("stepBar");

stepTotal.textContent = totalSteps.toString();

function showStep(index) {
  if (index < 0) index = 0;
  if (index > totalSteps-1) index = totalSteps-1;

  for (var i = 0; i < stepElements.length; i++) {
    stepElements[i].classList.remove("active");
  }
  stepElements[index].classList.add("active");

  btnPrev.disabled = (index === 0);
  var last = (index === totalSteps-1);
  btnNext.classList.toggle("d-none", last);
  btnSubmit.classList.toggle("d-none", !last);

  stepNow.textContent = (index + 1).toString();
  var pct = Math.round(((index + 1) / totalSteps) * 100);
  stepBar.style.width = pct + "%";

  currentStepIndex = index;
}

function stepIsValid() {
  var step = stepElements[currentStepIndex];
  var requiredInputs = step.querySelectorAll("[required]");
  
  for (var i = 0; i < requiredInputs.length; i++) {
    var el = requiredInputs[i];
    if (el.type === "radio") {

      var group = step.querySelectorAll('input[name="'+ el.name +'"]');
      var any = false;

      for (var j = 0; j < group.length; j++) {
        if (group[j].checked) {
          any = true;
          break;
        }
      }
      if (!any) return false;
    } else if (el.type === "text" || el.tagName === "INPUT") {
      if (!el.value.trim()) return false;
    }
  }
  return true;
}

btnNext.addEventListener("click", function() {
  if (!stepIsValid()) {
    alert("Please answer this question before continuing.");
    return;
  }
  showStep(currentStepIndex + 1);
});

btnPrev.addEventListener("click", function() {
  showStep(currentStepIndex-1);
});

showStep(0);

form.addEventListener("submit", function (event){
  event.preventDefault();

  const formData = new FormData(form);

  let dryScore = 0;
  let oilyScore = 0;

  let hasAcne = false;
  let isSensitive = false;
  let hasPigmentation = false;

  //Q1:
  const answerQ1 = formData.get("q1");
  if (answerQ1 === "dry") dryScore += 2;
  if (answerQ1 === "oily") oilyScore += 2;

  //Q2:
  for (const [key, value] of formData.entries()) {
    if (key === "q2" && value === "tzone") oilyScore += 1;
    if (key === "q2" && value === "cheeks") oilyScore += 2;
  }

  //Q3, Q4, Q5:
  hasAcne = formData.get("q3") === "yes";
  isSensitive = formData.get("q4") === "yes";
  hasPigmentation = formData.get("q5") === "yes";

  let skinType = "Normal";

  if (oilyScore > dryScore && oilyScore >= 3) {
    skinType = "Oily";
  } else if (oilyScore > dryScore && oilyScore < 3) {
    skinType = "Combination";
  } else if (dryScore > oilyScore) {
    skinType = "Dry";
  }

  console.log({
    skinType,
    hasAcne,
    isSensitive,
    hasPigmentation
  });

  resultTitle.textContent = "Your skin type: " + skinType;
  amList.innerHTML = "";
  pmList.innerHTML = "";

  let morningRoutine = [];
  let nightRoutine = [];

  if (skinType === "Dry") {
    morningRoutine.push("Gentle Hydrating Cleanser");
    morningRoutine.push("Hydrating toner or essence");
    morningRoutine.push("Rich cream moisturizer");
    morningRoutine.push("SPF 30+");

    nightRoutine.push("Gentle cleanser");
    nightRoutine.push("Hydrating serum (hyaluronic acid)");
    nightRoutine.push("Thick moisturizer or sleeping mask");
  }
  else if (skinType === "Oily") {
    morningRoutine.push("Foaming or gel cleanser");
    morningRoutine.push("Oil-free lightweight moisturizer");
    morningRoutine.push("SPF 30+");

    nightRoutine.push("Foaming cleanser");
    nightRoutine.push("Oil-free moisturizer");
    nightRoutine.push("Clay mask 2 x per week (optional)");
  }
  else if (skinType === "Combination") {
    morningRoutine.push("Gel cleanser");
    morningRoutine.push("Balancing toner - focus on T-zone");
    morningRoutine.push("Lightweight moisturizer");
    morningRoutine.push("SPF 30+");

    nightRoutine.push("Gel cleanser");
    nightRoutine.push("Niacinamide serum (balances oil)");
    nightRoutine.push("Light moisturizer");
  }
  else { //normal skin
    morningRoutine.push("Gentle cleanser");
    morningRoutine.push("Normal moisturizer");
    morningRoutine.push("SPF 30+");

    nightRoutine.push("Gentle cleanser");
    nightRoutine.push("Normal moisturizer");
  }

  if (hasAcne) {
    morningRoutine.push("(AM) Use niacinamide or salicylic acid if skin tolerates");
    nightRoutine.push("(PM) Salicylic acid or retinoid 2-3x per week");
  }
  if (isSensitive) {
    morningRoutine.push("(AM) Avoid fragrance or harsh exfoliants");
    nightRoutine.push("(PM) Barrier-repair serum (ceramides / panthenol)");
  }
  if (hasPigmentation) {
    morningRoutine.push("(AM) Vitamin C serum (brightening)");
    nightRoutine.push("(PM) Azelaic acid or gentle brightening serum");
  }

  for (let i = 0; i < morningRoutine.length; i++) {
    const listItem = document.createElement("li");
    listItem.textContent = morningRoutine[i];
    amList.appendChild(listItem);
  }

  for (let i = 0; i < nightRoutine.length; i++) {
    const listItem = document.createElement("li");
    listItem.textContent = nightRoutine[i];
    pmList.appendChild(listItem);
  }


  resultCard.classList.remove("d-none");


});

//--------homepage jaavscript---------
document.addEventListener('DOMContentLoaded', function() {
  var scrollBtn = document.getElementById('scrollBtn');
  var aboutSection = document.getElementById('about');
  var backToTop = document.getElementById('backToTop');


  // Scroll to About section
  scrollBtn.addEventListener('click', function() {
    aboutSection.scrollIntoView();
  });


  // Show/hide Back to Top button
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  });


  // Scroll to top when clicked
  backToTop.addEventListener('click', function() {
    window.scrollTo(0, 0);
  });
});

//fatmas js:


const backToTopBtn = document.getElementById('backToTop');

window.onscroll = function() {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
};

backToTopBtn.onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Payment method switching
const creditRadio = document.getElementById('credit');
const paypalRadio = document.getElementById('paypal');
const creditForm = document.querySelector('.payment-method');

paypalRadio.addEventListener('change', function() {
    if (this.checked) {
        creditForm.style.display = 'none';
    }
});

creditRadio.addEventListener('change', function() {
    if (this.checked) {
        creditForm.style.display = 'block';
    }
});

// Billing address option
const sameAddress = document.getElementById('same');
const differentAddress = document.getElementById('different');
const billingSection = document.querySelector('.section:last-of-type');

differentAddress.addEventListener('change', function() {
    if (this.checked) {
        showBillingForm();
    }
});

sameAddress.addEventListener('change', function() {
    if (this.checked) {
        hideBillingForm();
    }
});

function showBillingForm() {
    const existingForm = document.getElementById('billing-form');
    if (existingForm) return;
    
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
    
    const radioOptions = document.querySelectorAll('.radio-option');
    radioOptions[1].insertAdjacentHTML('afterend', formHTML);
}

function hideBillingForm() {
    const form = document.getElementById('billing-form');
    if (form) {
        form.remove();
    }
}

// Discount code
const discountInput = document.querySelector('.discount-section input');
const applyButton = document.querySelector('.discount-section button');
const totalAmount = document.querySelector('.total-row.final span:last-child');
let hasDiscount = false;

applyButton.onclick = function() {
    const code = discountInput.value.trim().toUpperCase();
    
    if (hasDiscount) {
        alert('Discount already applied');
        return;
    }
    
    if (code === 'SAVE10') {
        updateTotal(690);
        hasDiscount = true;
        applyButton.textContent = 'Applied';
        alert('$10 discount applied!');
    } else if (code === 'SAVE20') {
        updateTotal(680);
        hasDiscount = true;
        applyButton.textContent = 'Applied';
        alert('$20 discount applied!');
    } else {
        alert('Invalid code');
    }
};

function updateTotal(newAmount) {
    totalAmount.textContent = '$' + newAmount + '.00';
}

// Card number formatting - limit to 16 digits
const cardNumberInput = document.querySelectorAll('.form-group input')[0];

cardNumberInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/[^0-9]/g, '').slice(0, 16);
    let formatted = value.match(/.{1,4}/g);
    e.target.value = formatted ? formatted.join(' ') : value;
});

// CVV input - numbers only, max 4 digits
const cvvInput = document.querySelectorAll('.form-row input')[1];

cvvInput.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
});

// Expiration date formatting - MM/YY format
const expiryInput = document.querySelectorAll('.form-row input')[0];

expiryInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value.slice(0, 5);
});

// Complete order button
const completeButton = document.querySelector('.btn-primary');

completeButton.onclick = function(e) {
    e.preventDefault();
    
    if (creditRadio.checked) {
        const cardNum = document.querySelectorAll('.form-group input')[0].value;
        const cardName = document.querySelectorAll('.form-group input')[1].value;
        const expiry = document.querySelectorAll('.form-row input')[0].value;
        const cvv = document.querySelectorAll('.form-row input')[1].value;
        
        if (!cardNum || !cardName || !expiry || !cvv) {
            alert('Please fill all payment fields');
            return;
        }
        
        if (cardNum.replace(/\s/g, '').length < 13) {
            alert('Invalid card number');
            return;
        }
    }
    
    completeButton.textContent = 'Processing...';
    
    setTimeout(function() {
        alert('Order completed successfully!');
        completeButton.textContent = 'Complete Order';
    }, 1000);
};

// Back button
const backButton = document.querySelector('.btn-secondary');

backButton.onclick = function() {
    alert('Returning to shipping page');
};

// Edit link - make contact info editable
const editLink = document.querySelector('.edit-link');
const infoItems = document.querySelectorAll('.info-item p');

editLink.onclick = function(e) {
    e.preventDefault();
    
    if (editLink.textContent === 'Edit') {
        // Make fields editable
        infoItems.forEach(item => {
            const currentText = item.textContent;
            item.innerHTML = `<input type="text" value="${currentText}" style="width: 100%; padding: 8px; border: 2px solid #e4c9b3; border-radius: 8px; font-size: 14px;">`;
        });
        editLink.textContent = 'Save';
    } else {
        // Save changes
        infoItems.forEach(item => {
            const input = item.querySelector('input');
            if (input) {
                item.textContent = input.value;
            }
        });
        editLink.textContent = 'Edit';
        alert('Information updated!');
    }
};
