let ultimaLocalizacao = null; // Armazena a última localização válida

// Tenta obter a localização ao carregar a página (sem abrir nada ainda)
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            ultimaLocalizacao = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            console.log("Localização obtida:", ultimaLocalizacao);
        },
        (error) => {
            console.warn("Erro ao obter localização:", error.message);
        },
        {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0
        }
    );
} else {
    console.warn("Geolocalização não suportada neste navegador.");
}

const contatoForm = document.getElementById('form-content');
if (contatoForm) {
    contatoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const termos = document.getElementById('uso').checked;
        const privacidade = document.getElementById('privacidade').checked;

        if (!termos || !privacidade) {
            alert('Você deve aceitar os Termos de Uso e Privacidade.');
            return;
        }

        const nome = document.getElementById('name').value.trim();
        const enderecoDigitado = document.getElementById('localizacao').value.trim();
        const servicoSelect = document.getElementById('servico');
        const servico = servicoSelect.value;
        const mensagem = document.getElementById('mensagem').value.trim();

        if (!servico) {
            alert("Por favor, selecione um serviço.");
            return;
        }

        const servicoTexto = servicoSelect.options[servicoSelect.selectedIndex].text;
        let textoBase = `Olá, me chamo ${nome}.\nQuero solicitar o serviço de: ${servicoTexto}.\nA minha situação é: ${mensagem}`;

        // Adiciona localização se disponível
        if (ultimaLocalizacao) {
            const { latitude, longitude } = ultimaLocalizacao;
            const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
            textoBase += `\nLocalização (aproximada): Latitude: ${latitude}, Longitude: ${longitude}\nVer no Mapa: ${googleMapsLink}`;
        } else if (enderecoDigitado) {
            textoBase += `\nLocalização fornecida (manual): ${enderecoDigitado}`;
        } else {
            textoBase += `\nLocalização não fornecida.`;
        }

        const textoCodificado = encodeURIComponent(textoBase);
        const numeroWhatsApp = '558592440059';
        const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`;

        // Abre link diretamente na ação do clique (para Safari/iOS funcionar corretamente)
        window.open(linkWhatsApp, '_blank');
    });
}


// ---------------------------------------------------------------------------------------------------

const modal = document.getElementById('modal-termo');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

const termosConteudo = {
    uso: `
        <p>Esses são os termos de uso. Aqui você pode colocar os detalhes sobre o funcionamento do serviço, regras de conduta, responsabilidades do usuário e do prestador, etc.</p>
    `,
    privacidade: `
        <p>Política de privacidade: Aqui você descreve como os dados do usuário são coletados, armazenados, utilizados e protegidos.</p>
    `
};

document.querySelectorAll('.termo-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const tipo = this.dataset.termo;
        modalTitle.textContent = tipo === 'uso' ? 'Termos de Uso' : 'Política de Privacidade';
        modalBody.innerHTML = termosConteudo[tipo];
        modal.style.display = 'flex';
    });
});

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// ---------------------------------------------------------------------------------------------------

