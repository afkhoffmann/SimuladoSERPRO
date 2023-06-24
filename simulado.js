let temas = [
    { tema: 1, descricao: 'Animais', resumo: 'Tema sobre animais', complemento: 'Isso é tudo sobre animais.' },
    { tema: 2, descricao: 'Objetos', resumo: 'Tema sobre objetos', complemento: 'Isso é tudo sobre objetos.' },
    { tema: 3, descricao: 'Pessoas', resumo: 'Tema sobre pessoas', complemento: 'Isso é tudo sobre pessoas.' },
    { tema: 4, descricao: 'Lugares', resumo: 'Tema sobre lugares', complemento: 'Isso é tudo sobre lugares.' }
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

        divTema.innerHTML = `<h2>${tema.descricao}</h2><p>${tema.resumo}</p>`;
        divConteudo.appendChild(divTema);

        let questoesDoTema = questoes.filter(questao => questao.tema === tema.tema);

        questoesDoTema.forEach((questao, j) => {
            let divQuestao = document.createElement('div');
            divQuestao.innerHTML = `<h3>Q${indexPerguntaLoad + 1}: ${questao.questao}</h3>
                <input type="radio" name="resposta_${indexPerguntaLoad}" value="0"> 
                <label for="resposta_${indexPerguntaLoad}">Verdadeiro</label><br>
                <input type="radio" name="resposta_${indexPerguntaLoad}" value="1"> 
                <label for="resposta_${indexPerguntaLoad}">Falso</label><br>`;

            divTema.appendChild(divQuestao);
            indexPerguntaLoad++;
        });

        let pComplemento = document.createElement('p');
        pComplemento.style.display = 'none';
        divTema.appendChild(pComplemento);
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
        } else if (parseInt(respostaEscolhida.value) === questao.resposta) {
            totalCorretas++;
            document.querySelector(`input[name="${radioName}"][value="${questao.resposta}"]`).nextElementSibling.style.fontWeight = 'bold';
        } else {
            document.querySelector(`input[name="${radioName}"][value="${questao.resposta}"]`).nextElementSibling.style.fontWeight = 'normal';
        }
    });

    if (semResposta === true) {
        resultado.innerHTML = "Existem perguntas não respondidas.";
        containerResultado.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    resultado.innerHTML = `Você acertou ${totalCorretas} de ${totalQuestoes} perguntas.`;
    containerResultado.scrollIntoView({ behavior: 'smooth' });
}