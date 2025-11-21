function exportPDF() {
    const element = document.getElementById('budget-container');
    const button = document.querySelector('button');
    const originalText = button.innerText;

    button.innerText = 'Generando PDF...';
    button.disabled = true;

    const opt = {
        margin: 0,
        filename: 'presupuesto.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Temporarily disable contenteditable to ensure correct rendering
    const editableElements = element.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(el => el.setAttribute('contenteditable', 'false'));

    // Temporarily remove the box-shadow and margin for clean export
    const originalBoxShadow = element.style.boxShadow;
    const originalMargin = element.style.margin;

    element.style.boxShadow = 'none';
    element.style.margin = '0';

    html2pdf().set(opt).from(element).save().then(() => {
        // Restore styles
        element.style.boxShadow = originalBoxShadow;
        element.style.margin = originalMargin;

        // Restore contenteditable
        editableElements.forEach(el => el.setAttribute('contenteditable', 'true'));

        // Restore button
        button.innerText = originalText;
        button.disabled = false;
    }).catch(err => {
        console.error(err);
        alert('Hubo un error al generar el PDF. Por favor intente nuevamente.');

        // Restore state in case of error
        element.style.boxShadow = originalBoxShadow;
        element.style.margin = originalMargin;
        editableElements.forEach(el => el.setAttribute('contenteditable', 'true'));
        button.innerText = originalText;
        button.disabled = false;
    });
}

// Simple calculation logic
const qtySpan = document.getElementById('qty');
const priceSpan = document.getElementById('unit-price');
const subtotalSpan = document.getElementById('subtotal');
const totalNetoSpan = document.getElementById('total-neto');
const ivaSpan = document.getElementById('iva');
const totalFinalSpan = document.getElementById('total-final');

function formatNumber(num) {
    return new Intl.NumberFormat('es-CL').format(num);
}

function parseNumber(str) {
    return parseInt(str.replace(/\./g, '')) || 0;
}

function updateCalculations() {
    const qty = parseNumber(qtySpan.innerText);
    const price = parseNumber(priceSpan.innerText);

    const total = qty * price;
    const iva = Math.round(total * 0.19);
    const final = total + iva;

    subtotalSpan.innerText = formatNumber(total);
    totalNetoSpan.innerText = formatNumber(total);
    ivaSpan.innerText = formatNumber(iva);
    totalFinalSpan.innerText = formatNumber(final);
}

// Add event listeners to editable fields for calculation
qtySpan.addEventListener('input', updateCalculations);
priceSpan.addEventListener('input', updateCalculations);
