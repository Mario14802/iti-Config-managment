function bindNumericPhoneInput(input) {
  if (!input || input.dataset.numericPhoneBound) return;
  input.dataset.numericPhoneBound = '1';
  input.setAttribute('inputmode', 'numeric');
  if (!input.getAttribute('pattern')) input.setAttribute('pattern', '[0-9]*');

  input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '');
    if (input.value !== digits) input.value = digits;
  });

  input.addEventListener('keypress', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
  });
}

function initNumericPhoneInputs() {
  document.querySelectorAll('[data-phone-numeric], .phone-numeric').forEach(bindNumericPhoneInput);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNumericPhoneInputs);
} else {
  initNumericPhoneInputs();
}
