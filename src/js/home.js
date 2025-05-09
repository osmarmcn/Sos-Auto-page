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
        // IMPORTANTE: Definimos textoBase aqui, mas ele será complementado depois.
        // Não o modificaremos diretamente nas funções de callback para evitar efeitos colaterais
        // se as callbacks forem chamadas múltiplas vezes ou em ordens inesperadas.
        // Em vez disso, as callbacks construirão a mensagem final baseada nele.
        const textoBaseOriginal = `Olá, me chamo ${nome}.\nQuero solicitar o serviço de: ${servicoTexto}.\nA minha situação é: ${mensagem}`;

        // Definindo as funções de callback ANTES de usá-las
        // Isso melhora a legibilidade e evita problemas com hoisting de funções dentro de blocos.

        function successCallback(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Formato padrão e robusto para o link do Google Maps:
            const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

            console.log("VALOR ATUAL DE googleMapsLink:", googleMapsLink);

            let textoFinalComLocalizacao = `${textoBaseOriginal}\nLocalização (aproximada): Latitude: ${latitude}, Longitude: ${longitude}\nVer no Mapa: ${googleMapsLink}`;
            
            const textoCodificado = encodeURIComponent(textoFinalComLocalizacao);
            const numeroWhatsApp = '558592440059'; // Seu número
            const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`;
            window.open(linkWhatsApp, '_blank');
        }

        function errorCallback(error) {
            console.error("Erro de Geolocalização:", error ? error.code : 'N/A', error ? error.message : 'N/A');
            let userMessage = "Não foi possível obter sua localização automaticamente.\n";
            const enderecoDigitadoValue = document.getElementById('localizacao').value.trim(); // Pega o valor atual do campo

            if (error && error.code) { // Verifica se 'error' e 'error.code' existem
                switch (error.code) {
                    case 1: // PERMISSION_DENIED
                        userMessage += "Você negou a permissão de localização. Para usar este recurso, por favor, verifique as configurações de localização do seu navegador e do seu iPhone (Ajustes > Privacidade e Segurança > Serviços de Localização > [Seu Navegador]).";
                        break;
                    case 2: // POSITION_UNAVAILABLE
                        userMessage += "As informações de localização não estão disponíveis no momento (pode ser um problema de rede ou sinal de GPS). Tente novamente ou digite seu endereço.";
                        break;
                    case 3: // TIMEOUT
                        userMessage += "A tentativa de obter sua localização demorou muito. Tente novamente ou digite seu endereço.";
                        break;
                    default: // Outros erros da API
                        userMessage += `Ocorreu um erro (${error.message || 'desconhecido'}) ao tentar obter sua localização. Tente novamente ou digite seu endereço.`;
                        break;
                }
            } else if (error && error.message === "Navegador não suporta geolocalização") {
                // Caso específico quando chamamos errorCallback porque navigator.geolocation não existe
                userMessage = "Seu navegador não suporta geolocalização. Por favor, digite seu endereço.";
            } else {
                // Fallback genérico se o objeto de erro for inesperado
                userMessage += "Ocorreu um erro ao tentar obter sua localização. Por favor, digite seu endereço.";
            }

            alert(userMessage); // Garante que o usuário veja a mensagem

            let textoFinalParaEnviar = textoBaseOriginal; // Começa com a base
            if (enderecoDigitadoValue) {
                textoFinalParaEnviar += `\nLocalização fornecida (manual): ${enderecoDigitadoValue}`;
            } else {
                textoFinalParaEnviar += `\nLocalização automática falhou e nenhum endereço manual foi fornecido.`;
            }

            const textoCodificado = encodeURIComponent(textoFinalParaEnviar);
            const numeroWhatsApp = '558592440059'; // Seu número
            const linkWhatsAppFinal = `https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`; // Renomeado para evitar conflito com a let global
            window.open(linkWhatsAppFinal, '_blank');
        }

        // Agora, a lógica principal para tentar a geolocalização
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                successCallback,
                errorCallback,
                {
                    enableHighAccuracy: false, // Recomendado para maior compatibilidade (especialmente iOS)
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            // Geolocalização não é suportada pelo navegador.
            // Chamamos errorCallback com um objeto de erro personalizado para unificar o tratamento de fallback.
            errorCallback({ code: null, message: "Navegador não suporta geolocalização" });
        }
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

