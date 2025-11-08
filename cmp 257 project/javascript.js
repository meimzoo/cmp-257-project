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

