// carrega os arquivos csv
window.onload = function() {
    d3.csv('perguntas.csv').then(function(data) {
        window.perguntas = data;
    });

    d3.csv('temas.csv').then(function(data) {
        window.temas = data;
        for (let tema of window.temas) {
            let divTema = document.createElement('div');
            divTema.innerHTML = '<h2>' + tema.descricao + '</h2>' + '<p>' + tema.resumo + '</p>';
            document.getElementById('conteudo').appendChild(divTema);

            for (let pergunta of window.perguntas) {
                if (pergunta.tema == tema.tema) {
                    let divPergunta = document.createElement('div');
                    let idPergunta = 'pergunta' + pergunta.pergunta_id;
                    divPergunta.innerHTML = '<h3>Pergunta ' + pergunta.pergunta_id + '</h3><p>' + pergunta.pergunta + '</p><label><input type="radio" name="' + idPergunta + '" value="Certo"> Certo</label><label><input type="radio" name="' + idPergunta + '" value="Errado"> Errado</label>';
                    divTema.appendChild(divPergunta);
                }
            }
        }
    });
}

// função que realiza a correção
function corrigir() {
    let total = window.perguntas.length;
    let acertos = 0;
    let elementoResultado = document.getElementById('resultado');
    elementoResultado.innerHTML = '';

    for (let tema of window.temas) {
        let complementoInserido = document.getElementById('complemento' + tema.tema);
        if (!complementoInserido) {
            let divComplemento = document.createElement('div');
            divComplemento.id = 'complemento' + tema.tema;
            divComplemento.innerHTML = '<p>' + tema.complemento + '</p>';
            document.getElementById('conteudo').appendChild(divComplemento);
        }
    }

    for (let pergunta of window.perguntas) {
        let opcaoCerta = document.querySelector('input[name="pergunta' + pergunta.pergunta_id + '"][value="' + (pergunta.resposta == 0 ? 'Errado' : 'Certo') + '"]');
        let opcaoErrada = document.querySelector('input[name="pergunta' + pergunta.pergunta_id + '"][value="' + (pergunta.resposta == 0 ? 'Certo' : 'Errado') + '"]');
        if (opcaoCerta.checked) {
            acertos++;
            opcaoCerta.parentNode.classList.remove('errado');
            opcaoCerta.parentNode.classList.add('correto');
        } else {
            opcaoCerta.parentNode.classList.remove('correto');
            opcaoCerta.parentNode.classList.add('errado');
        }
        opcaoCerta.parentNode.textContent = pergunta.correcao;
        opcaoErrada.parentNode.textContent = pergunta.resposta == 0 ? 'Certo' : 'Errado';
        opcaoErrada.parentNode.classList.remove('correto', 'errado');
    }
    elementoResultado.innerHTML = 'Você acertou ' + acertos + ' de ' + total + ' (' + ((acertos / total) * 100).toFixed(2) + '%)';
}