let temas = [
    { tema: 1, descricao: 'Animais', resumo: 'Tema sobre animais', complemento: 'Isso é tudo sobre animais.' },
    { tema: 2, descricao: 'Objetos', resumo: 'Tema sobre objetos', complemento: 'Isso é tudo sobre objetos.' },
    { tema: 3, descricao: 'Pessoas', resumo: 'Tema sobre pessoas', complemento: 'Isso é tudo sobre pessoas.' },
    { tema: 4, descricao: 'Lugares', resumo: 'Tema sobre lugares', complemento: 'Isso é tudo sobre lugares.' }
];

let questoes = [
    { tema: 1, pergunta: 'T1 P1?', resposta: 0, correcao: 'Explicação para T1 P1'},
    { tema: 1, pergunta: 'T1 P2?', resposta: 1, correcao: 'Explicação para T1 P2'},
    { tema: 2, pergunta: 'T2 P1?', resposta: 0, correcao: 'Explicação para T2 P1'},
    { tema: 3, pergunta: 'T3 P1?', resposta: 0, correcao: 'Explicação para T3 P1'},
    { tema: 3, pergunta: 'T3 P2?', resposta: 0, correcao: 'Explicação para T3 P2'},
    { tema: 3, pergunta: 'T3 P3?', resposta: 1, correcao: 'Explicação para T3 P3'},
    { tema: 3, pergunta: 'T3 P4?', resposta: 1, correcao: 'Explicação para T3 P4'},
    { tema: 4, pergunta: 'T4 P1?', resposta: 0, correcao: 'Explicação para T4 P1'},
    { tema: 4, pergunta: 'T4 P2?', resposta: 0, correcao: 'Explicação para T4 P2'},
    { tema: 4, pergunta: 'T4 P3?', resposta: 1, correcao: 'Explicação para T4 P3'}
];

let ultimoScroll = 0;

window.onload = function() {
    carregarPerguntas();

    let cabecalho = document.getElementById('cabecalho');
    let btnTopo = document.getElementById('btnTopo'); 
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > cabecalho.offsetHeight) {
            if (!cabecalho.classList.contains('header-hide')) {
                cabecalho.classList.add('header-hide');
                btnTopo.style.display = 'block'; 
            }
        } else {
            if (cabecalho.classList.contains('header-hide')) {
                cabecalho.classList.remove('header-hide');
            }
        }
        
        if (scrollTop === 0) {
            btnTopo.style.display = 'none';
        }

        lastScrollTop = scrollTop;
    });
};

function carregarPerguntas() {
    let divConteudo = document.getElementById('conteudo');
    let indexPerguntaLoad = 0;

    temas.forEach((tema, i) => {
        let divTema = document.createElement('div');

        divTema.innerHTML = `<h2>${tema.descricao}</h2><p>${tema.resumo}</p>`;
        divConteudo.appendChild(divTema);

        let questoesDoTema = questoes.filter(questao => questao.tema === tema.tema);

        questoesDoTema.forEach((questao, j) => {
            let divQuestao = document.createElement('div');
            divQuestao.innerHTML = 
                `<h3>Pergunta ${indexPerguntaLoad + 1}</h3>
                <p>${questao.pergunta}</p>
                <label class="questao_${indexPerguntaLoad}">
                    <input type="radio" name="resposta_${indexPerguntaLoad}" value=0> Certo
                </label>
                <label class="questao_${indexPerguntaLoad}">
                    <input type="radio" name="resposta_${indexPerguntaLoad}" value=1> Errado
                </label>
                <div id="correcao_${indexPerguntaLoad}" class="correcao"></div>`;
            divTema.appendChild(divQuestao);
            indexPerguntaLoad++;
        });

        divTema.innerHTML += `<p class="paragrafo-complementar"></p>`;
    });
}

function corrigir() {
    let totalQuestoes = questoes.length;
    let totalCorretas = 0;
    let semResposta = false;
    let resultado = document.getElementById("resultado");
    let containerResultado = document.getElementById("container-resultado");

    containerResultado.style.display = "flex";
    resultado.style.animation = 'none';
    resultado.offsetHeight;
    resultado.style.animation = "blink 1s ease-in-out 2";

    questoes.forEach((questao, i) => {
        let radioName = 'resposta_' + i;
        let respostaEscolhida = document.querySelector('input[name="' + radioName + '"]:checked');

        if (!respostaEscolhida) {
            semResposta = true;
        }
    });

    if (semResposta === true) {
        resultado.innerHTML = "Existem perguntas não respondidas.";
        containerResultado.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    let indexQuestaoCheck = 0;

    temas.forEach((tema, j) => {
        const pComplemento = document.getElementById('conteudo').children[j].lastElementChild;
        pComplemento.style.display = 'block';
        pComplemento.textContent = tema.complemento;

        questoes.filter(questao => questao.tema === tema.tema).forEach((questao, i) => {
            let radioName = 'resposta_' + indexQuestaoCheck;
            let respostaEscolhida = document.querySelector('input[name="' + radioName + '"]:checked');
            let labels = document.querySelectorAll('.questao_' + indexQuestaoCheck);

            labels.forEach(label => {
                label.classList.remove('correto');
                label.classList.remove('errado');
            });

            let correcao = document.getElementById('correcao_' + indexQuestaoCheck);

            if (parseInt(respostaEscolhida.value, 10) === questao.resposta) {
                respostaEscolhida.parentNode.classList.add("correto");
                correcao.style.display = 'none';
                totalCorretas++;
            } else {
                respostaEscolhida.parentNode.classList.add("errado");
                correcao.textContent = questao.correcao;
                correcao.style.display = 'block';
            }

            indexQuestaoCheck++;
        });
    });

    resultado.innerHTML =
    "Você acertou " +
    totalCorretas +
    " de " +
    totalQuestoes +
    " perguntas. " +
    "Porcentagem de acertos: " +
    ((totalCorretas / totalQuestoes) * 100).toFixed(2) +
    "%.";

    containerResultado.scrollIntoView({ behavior: 'smooth' });
}

// Função para rolar a página para o topo
function rolarParaTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}