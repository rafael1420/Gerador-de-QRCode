const container = document.querySelector('.container');
const qrCodeBtn = document.querySelector('#qr-form button');
const qrCodeInput = document.querySelector('#qr-form input');
const qrCodeImg = document.querySelector('#qr-code img');
const downloadBtn = document.querySelector('#download-btn'); // Seleciona o novo botão

// Gerar QR
function generateQrCode() {
    const qrCodeInputValue = qrCodeInput.value;
    if (!qrCodeInputValue) return;

    qrCodeBtn.innerHTML = "Gerando código...";

    qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCodeInputValue}`;
    
    qrCodeImg.addEventListener("load", () => {
        container.classList.add('active');
        qrCodeBtn.innerHTML = "Código gerado!";
    });
}

// Função para Baixar o QR Code
async function downloadQrCode() {
    const response = await fetch(qrCodeImg.src); // Busca a imagem gerada
    const blob = await response.blob(); // Transforma em blob
    const downloadUrl = URL.createObjectURL(blob); // Cria uma URL temporária
    const link = document.createElement("a"); // Cria um link "fantasma"
    
    link.href = downloadUrl;
    link.download = "qrcode.png"; // Nome do arquivo
    document.body.appendChild(link);
    link.click(); // Simula o clique
    document.body.removeChild(link); // Remove o link
}

// Eventos
qrCodeBtn.addEventListener("click", () => {
    generateQrCode();
});

qrCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateQrCode();
    }
});

downloadBtn.addEventListener("click", () => {
    downloadQrCode();
});

// Limpar QR Input
qrCodeInput.addEventListener('keyup', () => {
    if(!qrCodeInput.value) {
        container.classList.remove('active');
        qrCodeBtn.innerText = "Gerar QR Code";
    }
});
