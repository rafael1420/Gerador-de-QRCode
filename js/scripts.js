const API_URL = 'https://api.qrserver.com/v1/create-qr-code/';

const form = document.querySelector('#qr-form');
const input = document.querySelector('#qr-input');
const sizeSelect = document.querySelector('#qr-size');
const eccSelect = document.querySelector('#qr-ecc');
const colorInput = document.querySelector('#qr-color');
const bgColorInput = document.querySelector('#qr-bgcolor');
const colorValue = document.querySelector('#qr-color-value');
const bgColorValue = document.querySelector('#qr-bgcolor-value');
const charCount = document.querySelector('#char-count');
const inputError = document.querySelector('#input-error');
const generateBtn = document.querySelector('#generate-btn');
const generateLabel = generateBtn.querySelector('.btn-label');
const previewEmpty = document.querySelector('#preview-empty');
const qrImage = document.querySelector('#qr-image');
const downloadPngBtn = document.querySelector('#download-png');
const downloadSvgBtn = document.querySelector('#download-svg');
const toast = document.querySelector('#toast');

let toastTimer;

// Monta a URL da API com as opções escolhidas
function buildQrUrl(format = 'png') {
    const size = sizeSelect.value;
    const params = new URLSearchParams({
        data: input.value.trim(),
        size: `${size}x${size}`,
        ecc: eccSelect.value,
        color: colorInput.value.slice(1),
        bgcolor: bgColorInput.value.slice(1),
        margin: '10',
        format,
    });
    return `${API_URL}?${params}`;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function setLoading(isLoading) {
    generateBtn.disabled = isLoading;
    generateBtn.classList.toggle('loading', isLoading);
    generateLabel.textContent = isLoading ? 'Gerando...' : 'Gerar QR Code';
}

function setDownloadsEnabled(enabled) {
    downloadPngBtn.disabled = !enabled;
    downloadSvgBtn.disabled = !enabled;
}

function setError(message) {
    inputError.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function resetPreview() {
    qrImage.hidden = true;
    qrImage.removeAttribute('src');
    previewEmpty.hidden = false;
    setDownloadsEnabled(false);
}

// Gerar QR
function generateQrCode() {
    if (!input.value.trim()) {
        setError('Digite um texto ou URL para gerar o QR Code.');
        input.focus();
        return;
    }

    setError('');
    setLoading(true);
    qrImage.src = buildQrUrl('png');
}

qrImage.addEventListener('load', () => {
    setLoading(false);
    previewEmpty.hidden = true;
    qrImage.hidden = false;
    setDownloadsEnabled(true);
});

qrImage.addEventListener('error', () => {
    if (!qrImage.getAttribute('src')) return;
    setLoading(false);
    resetPreview();
    showToast('Não foi possível gerar o QR Code. Verifique sua conexão.');
});

// Baixar o QR Code
async function downloadQrCode(format) {
    try {
        const response = await fetch(buildQrUrl(format));
        if (!response.ok) throw new Error(response.statusText);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qrcode.${format}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        showToast(`Download em ${format.toUpperCase()} iniciado`);
    } catch {
        showToast('Falha ao baixar o arquivo. Tente novamente.');
    }
}

// Eventos
form.addEventListener('submit', (e) => {
    e.preventDefault();
    generateQrCode();
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || !e.shiftKey)) {
        e.preventDefault();
        generateQrCode();
    }
});

input.addEventListener('input', () => {
    charCount.textContent = input.value.length;
    if (input.value.trim()) setError('');
    if (!input.value) resetPreview();
    else if (!qrImage.hidden) setDownloadsEnabled(false);
});

// Ao mudar uma opção, atualiza o QR já gerado
[sizeSelect, eccSelect, colorInput, bgColorInput].forEach((el) => {
    el.addEventListener('change', () => {
        if (!qrImage.hidden) generateQrCode();
    });
});

colorInput.addEventListener('input', () => {
    colorValue.textContent = colorInput.value.toUpperCase();
});

bgColorInput.addEventListener('input', () => {
    bgColorValue.textContent = bgColorInput.value.toUpperCase();
});

downloadPngBtn.addEventListener('click', () => downloadQrCode('png'));
downloadSvgBtn.addEventListener('click', () => downloadQrCode('svg'));

document.querySelector('#year').textContent = new Date().getFullYear();
