let temas = [
    { tema: 1, descricao: 'Animais', resumo: 'Tema sobre animais', complemento: 'Isso é tudo sobre animais.', cor: '#FF875E', 'categoria': 'Animalia' },
    { tema: 2, descricao: 'Objetos', resumo: 'Tema sobre objetos', complemento: 'Isso é tudo sobre objetos.', cor: '#FFD65E', 'categoria': 'Coisas' },
    { tema: 3, descricao: 'Pessoas', resumo: 'Tema sobre pessoas', complemento: 'Isso é tudo sobre pessoas.', cor: '#5EFFD6', 'categoria': 'Humanos' },
    { tema: 4, descricao: 'Lugares', resumo: 'Tema sobre lugares', complemento: 'Isso é tudo sobre lugares.', cor: '#FF5EB2', 'categoria': 'Geografia' }
];

let questoes = [
    { tema: 1, questao: 'T1 P1?', resposta: 0 },
    { tema: 1, questao: 'T1 P2?', resposta: 1 },
    { tema: 2, questao: 'T2 P1?', resposta: 0 },
    { tema: 3, questao: 'T3 P1?', resposta: 0 },
    { tema: 3, questao: 'T3 P2?', resposta: 0 },
    { tema: 3, questao: 'T3 P3?', resposta: 1 },
    { tema: 3, questao: 'T3 P4?', resposta: 1 },
    { tema: 4, questao: 'T4 P1?', resposta: 0 },
    { tema: 4, questao: 'T4 P2?', resposta: 0 },
    { tema: 4, questao: 'T4 P3?', resposta: 1 }
];

window.rolarParaTopo = function rolarParaTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

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
        divTema.style.display = 'flex';
        divTema.style.flexDirection = 'column';
        divTema.style.justifyContent = 'flex-start';

        let divBarra = document.createElement('div'); 
        divBarra.style.backgroundColor = tema.cor;
        divBarra.style.color = '#FFFFFF';
        divBarra.style.padding = '5px';
        divBarra.style.borderRadius = '8px 8px 0 0'; // Adiciona o mesmo border-radius das divs de tema, mas apenas para as bordas superiores
        divBarra.textContent = tema.categoria;

        divTema.appendChild(divBarra);

        divTema.innerHTML += `<h2>${tema.descricao}</h2><p>${tema.resumo}</p>`;
        divConteudo.appendChild(divTema);

        let questoesDoTema = questoes.filter(questao => questao.tema === tema.tema);

        questoesDoTema.forEach((questao, j) => {
            let divQuestao = document.createElement('div');
            divQuestao.innerHTML = 
                `<h3>Pergunta ${indexPerguntaLoad + 1}</h3>
                <p>${questao.questao}</p>
                <label class="questao_${indexPerguntaLoad}">
                    <input type="radio" name="resposta_${indexPerguntaLoad}" value=0> Certo
                </label>
                <label class="questao_${indexPerguntaLoad}">
                    <input type="radio" name="resposta_${indexPerguntaLoad}" value=1> Errado
                </label>`;
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

            if (parseInt(respostaEscolhida.value, 10) === questao.resposta) {
                respostaEscolhida.parentNode.classList.add("correto");
                totalCorretas++;
            } else {
                respostaEscolhida.parentNode.classList.add("errado");
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
