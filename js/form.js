// ===== 3. MULTI-STEP FORM =====
// Each "Continue" button checks the fields on its step.
// If a field is wrong: write an error message next to it, mark it with
// aria-invalid, and move focus to it. The field's aria-describedby (in the HTML)
// points at the error message, so screen readers read the error out too.
// When the step changes, focus moves to the new step's heading.

const nameInput = document.getElementById('full-name');
const emailInput = document.getElementById('email');
const addressInput = document.getElementById('address');
const standardRadio = document.getElementById('speed-standard');
const expressRadio = document.getElementById('speed-express');

// Show an error message (or clear it by passing '')
function setError(input, message) {
  document.getElementById(input.id + '-error').textContent = message;
  if (message === '') {
    input.removeAttribute('aria-invalid');
  } else {
    input.setAttribute('aria-invalid', 'true');
  }
}

function goToStep(number) {
  for (let i = 1; i <= 3; i++) {
    document.getElementById('step-' + i).hidden = (i !== number);
    document.getElementById('progress-' + i).removeAttribute('aria-current');
  }
  document.getElementById('progress-' + number).setAttribute('aria-current', 'step');
  document.getElementById('step-' + number + '-heading').focus();
}

// ----- Step 1 -----
document.getElementById('step-1-next').addEventListener('click', function () {
  let firstProblem = null;

  if (nameInput.value.trim() === '') {
    setError(nameInput, 'Enter your full name');
    firstProblem = nameInput;
  } else {
    setError(nameInput, '');
  }

  if (!emailInput.value.includes('@')) {
    setError(emailInput, 'Enter an email address, like name@example.com');
    if (firstProblem === null) {
      firstProblem = emailInput;
    }
  } else {
    setError(emailInput, '');
  }

  if (firstProblem === null) {
    goToStep(2);
  } else {
    firstProblem.focus();
  }
});

// ----- Step 2 -----
document.getElementById('step-2-next').addEventListener('click', function () {
  let firstProblem = null;

  if (addressInput.value.trim() === '') {
    setError(addressInput, 'Enter your address');
    firstProblem = addressInput;
  } else {
    setError(addressInput, '');
  }

  // The radio buttons share one error message, with the id "speed-error"
  const speedError = document.getElementById('speed-error');
  if (!standardRadio.checked && !expressRadio.checked) {
    speedError.textContent = 'Choose a delivery speed';
    if (firstProblem === null) {
      firstProblem = standardRadio;
    }
  } else {
    speedError.textContent = '';
  }

  if (firstProblem === null) {
    // Copy the answers onto the "Check and send" step
    document.getElementById('review-name').textContent = nameInput.value;
    document.getElementById('review-email').textContent = emailInput.value;
    document.getElementById('review-address').textContent = addressInput.value;
    if (standardRadio.checked) {
      document.getElementById('review-speed').textContent = 'Standard';
    } else {
      document.getElementById('review-speed').textContent = 'Express';
    }
    goToStep(3);
  } else {
    firstProblem.focus();
  }
});

document.getElementById('step-2-back').addEventListener('click', function () {
  goToStep(1);
});

// ----- Step 3 -----
document.getElementById('step-3-back').addEventListener('click', function () {
  goToStep(2);
});

document.getElementById('send-order').addEventListener('click', function () {
  document.getElementById('order-form').hidden = true;
  document.getElementById('order-done').hidden = false;
  document.getElementById('order-done-heading').focus();
});
