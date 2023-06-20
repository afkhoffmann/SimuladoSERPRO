let temas = [];
let perguntas = [];

// Função para ler arquivo CSV
async function readCSV(url) {
    const response = await fetch(url);
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    return rows.map(row => row.split(';'));
}

// Função para renderizar o simulado
async function renderSimulado() {
    temas = await readCSV('temas.csv');
    perguntas = await readCSV('perguntas.csv');

    const conteudoDiv = document.getElementById('conteudo');

    // Percorrendo todos os temas e adicionando as perguntas correspondentes
    temas.forEach((tema, temaIndex) => {
        // Criando div do tema
        const temaDiv = document.createElement('div');
        const temaTitulo = document.createElement('h2');
        temaTitulo.textContent = tema[1];
        const temaResumo = document.createElement('p');
        temaResumo.textContent = tema[2];
        temaDiv.appendChild(temaTitulo);
        temaDiv.appendChild(temaResumo);

        // Adicionando perguntas correspondentes ao tema
        perguntas
            .filter(pergunta => pergunta[0] === tema[0])
            .forEach((pergunta, perguntaIndex) => {
                // Criando div da pergunta
                const perguntaDiv = document.createElement('div');
                const perguntaTitulo = document.createElement('h3');
                perguntaTitulo.textContent = `Pergunta ${perguntaIndex + 1}`;
                const perguntaTexto = document.createElement('p');
                perguntaTexto.textContent = pergunta[1];

                perguntaDiv.appendChild(perguntaTitulo);
                perguntaDiv.appendChild(perguntaTexto);

                // Criando opções de resposta
                ['Certo', 'Errado'].forEach(opcao => {
                    const opcaoLabel = document.createElement('label');
                    const opcaoInput = document.createElement('input');
                    opcaoInput.type = 'radio';
                    opcaoInput.name = `pergunta-${temaIndex}-${perguntaIndex}`;
                    opcaoInput.value = opcao === 'Certo' ? '1' : '0';
                    opcaoLabel.appendChild(opcaoInput);
                    opcaoLabel.appendChild(document.createTextNode(` ${opcao}`));
                    perguntaDiv.appendChild(opcaoLabel);
                });

                temaDiv.appendChild(perguntaDiv);
            });

        conteudoDiv.appendChild(temaDiv);
    });
}

// Função para corrigir o simulado
function corrigir() {
    let acertos = 0;
    let total = 0;

    const conteudoDiv = document.getElementById('conteudo');
    const resultadoDiv = document.getElementById('resultado');

    // Removendo classes de correção anterior
    [...document.getElementsByTagName('label')].forEach(label => {
        label.classList.remove('correto');
        label.classList.remove('errado');
    });

    // Removendo textos de complemento anterior
    [...document.getElementsByClassName('complemento')].forEach(complemento => {
        complemento.remove();
    });

    // Percorrendo temas e suas perguntas
    temas.forEach((tema, temaIndex) => {
        const perguntasTema = perguntas.filter(pergunta => pergunta[0] === tema[0]);

        perguntasTema.forEach((pergunta, perguntaIndex) => {
            const resposta = document.querySelector(`input[name="pergunta-${temaIndex}-${perguntaIndex}"]:checked`);

            if (resposta) {
                const correto = resposta.value === pergunta[2];

                if (correto) {
                    acertos++;
                    resposta.parentNode.classList.add('correto');
                } else {
                    resposta.parentNode.classList.add('errado');
                }

                // Substituindo texto da opção de resposta pela correção
                resposta.parentNode.childNodes[1].textContent = ` ${pergunta[3]}`;
                total++;
            }
        });

        // Adicionando texto de complemento
        const temaDiv = conteudoDiv.children[temaIndex];
        const complementoParagrafo = document.createElement('p');
        complementoParagrafo.textContent = tema[3];
        complementoParagrafo.className = 'complemento';
        temaDiv.appendChild(complementoParagrafo);
    });

    resultadoDiv.textContent = `Você acertou ${acertos} de ${total} (${(acertos / total * 100).toFixed(2)}%)`;
    resultadoDiv.style.textAlign = "center";
}

// Chamando a função para renderizar o simulado
renderSimulado();