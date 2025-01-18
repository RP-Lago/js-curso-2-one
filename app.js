let ListaDeNumerosSorteados = [];
let limiteNum = 100;
let numeroSecreto = gerarNumeroSecreto();
let tentativas = 1;
let userName = ''; 
let currentVoice = null;

const genderMessages = {
    'masculino': 'Você é o melhor!',
    'feminino': 'Você é a melhor!',
    'neutro': 'Você é incrível!'
};

function guessGender(name) {
    const lowerName = name.toLowerCase();
    const lastChar = lowerName.slice(-1);
    const lastTwoChars = lowerName.slice(-2);

    // Mais inclusivo, mas ainda simplificado
    if (['a', 'e'].includes(lastChar) && !['le', 'ue', 'me'].includes(lastTwoChars)) {
        return 'feminino';
    } else if (['o', 'i', 'u'].includes(lastChar)) {
        return 'masculino';
    }
    return 'neutro'; // Tratando nomes neutros ou não identificados
}

function exibirTextoNaTela(tag, texto) {
    let campo = document.querySelector(tag);
    campo.innerHTML = texto;
    if ('speechSynthesis' in window && userName) {
        let utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR'; 
        utterance.rate = 1.8; 
        if (currentVoice) utterance.voice = currentVoice;
        window.speechSynthesis.speak(utterance); 
    } else {
        console.log("Web Speech API não suportada neste navegador.");
    }
}

function exibirMensagemInicial() {
    exibirTextoNaTela('h1', 'Jogo do Número Secreto');
    if (userName) {
        exibirTextoNaTela('h2', `Olá, ${userName}!`);
        exibirTextoNaTela('p', 'Escolha um número entre 1 e 100.');
        document.getElementById('jogoNumeroSecreto').style.display = 'block'; // Show game section
    } else {
        exibirTextoNaTela('h2', 'Por favor, insira seu nome para começar.');
        document.getElementById('jogoNumeroSecreto').style.display = 'none'; // Hide game section if no name
    }
}

function setUserName() {
    userName = document.getElementById('nomeUsuario').value;
    if (userName) {
        exibirMensagemInicial();
        document.getElementById('nomeSection').style.display = 'none'; // Hide name section after input
    }
}

function voltar() {
    document.getElementById('jogoNumeroSecreto').style.display = 'none';
    document.getElementById('nomeSection').style.display = 'block';
    userName = ''; // Reset user name
    exibirMensagemInicial(); // Re-show initial messages
}

function changeVoice() {
    if ('speechSynthesis' in window) {
        let synth = window.speechSynthesis;
        let voices = synth.getVoices();
        let select = document.getElementById('voiceSelect');
        
        select.innerHTML = ''; // Clear existing options
        
        for(let i = 0; i < voices.length; i++) {
            let option = document.createElement('option');
            option.textContent = `${voices[i].name} (${voices[i].lang})`;
            option.value = i;
            if(voices[i].lang.includes('pt-BR')) {
                select.appendChild(option);
            }
        }

        select.addEventListener('change', function() {
            let selectedVoice = voices[select.value];
            if(selectedVoice) {
                currentVoice = selectedVoice;
            }
        });
    }
}

function verificarChute() {
    let chute = parseInt(document.querySelector('#numeroChute').value);
    
    if (chute === numeroSecreto) {
        let gender = guessGender(userName);
        exibirTextoNaTela('h1', `Parabéns! ${userName}!`);
        exibirTextoNaTela('h2', `Você acertou em ${tentativas} tentativas!`);
        exibirTextoNaTela('p', genderMessages[gender]);
        document.getElementById('reiniciar').removeAttribute('disabled');
    } else {
        if (chute > numeroSecreto) {
            exibirTextoNaTela('p', 'O número secreto é menor!');
        } else {
            exibirTextoNaTela('p', 'O número secreto é maior!');
        }
        tentativas++;
        limparCampo();
    }
}

function gerarNumeroSecreto() {
    let numeroEscolhido = parseInt(Math.random() * limiteNum) + 1;
    let qtdElementosNaLista = ListaDeNumerosSorteados.length;
    if (qtdElementosNaLista === limiteNum) {
        ListaDeNumerosSorteados = [];
    }

    if (ListaDeNumerosSorteados.includes(numeroEscolhido)) {
        return gerarNumeroSecreto();
    } else {
        ListaDeNumerosSorteados.push(numeroEscolhido);
        return numeroEscolhido;
    }
}

function limparCampo() {
    document.getElementById('numeroChute').value = '';
}

function reiniciarJogo() {
    numeroSecreto = gerarNumeroSecreto();
    limparCampo();
    tentativas = 1;
    userName = ''; // Reset user name
    exibirMensagemInicial(); // Re-show initial messages
    document.getElementById('reiniciar').setAttribute('disabled', true);
    document.getElementById('nomeSection').style.display = 'block'; // Show name section again for new game
    document.getElementById('jogoNumeroSecreto').style.display = 'none'; // Hide game until name entered again
}

// Call this function when the page loads to populate the voice selection
changeVoice();