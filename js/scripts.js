const container = document.querySelector('.container');
const qrCodeBtn = document.querySelector('#qr-form button');
const qrCodeInput = document.querySelector('#qr-form input');
const qrCodeImg = document.querySelector('#qr-code img');
//eventos

//Gerar QR
function generateQrCode() {
    const qrCodeInputValue = qrCodeInput.value;
    if (!qrCodeInputValue) return;

    qrCodeBtn.innerHTML = "Gerando código...";

    qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCodeInputValue}`;
    qrCodeImg.addEventListener("load", () => {
        container.classList.add('active');
        qrCodeBtn.innerHTML = "Código gerado!";
    })
}



qrCodeBtn.addEventListener("click", () => {
generateQrCode()
})

qrCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') { // Verifica se a tecla pressionada é Enter
        generateQrCode();
    }
}); /*ADICIONADO: Função de "Enter", acionando o butão de gerar o QRcode*/

//Limpar QR Input
qrCodeInput.addEventListener('keyup', () => {
    if(!qrCodeInput.value) {
        container.classList.remove('active');
        qrCodeBtn.innerText = "Gerar QR Code";
    }
})