let temas = [];
let perguntas = [];

fetch('temas.csv')
    .then(response => response.text())
    .then(data => {
        let linhas = data.split('\n');
        linhas.forEach(linha => {
            let campos = linha.split(';');
            temas.push({
                tema: campos[0],
                descricao: campos[1],
                resumo: campos[2],
                complemento: campos[3]
            });
        });

        fetch('perguntas.csv')
            .then(response => response.text())
            .then(data => {
                let linhas = data.split('\n');
                linhas.forEach(linha => {
                    let campos = linha.split(';');
                    perguntas.push({
                        tema: campos[0],
                        pergunta: campos[1],
                        resposta: campos[2],
                        correcao: campos[3]
                    });
                });

                montarProva();
            });
    });

function montarProva() {
    let conteudo = document.getElementById('conteudo');
    let i = 1;
    temas.forEach(tema => {
        let divTema = document.createElement('div');
        let h2 = document.createElement('h2');
        h2.innerText = tema.descricao;
        divTema.appendChild(h2);

        let pResumo = document.createElement('p');
        pResumo.innerText = tema.resumo;
        divTema.appendChild(pResumo);

        perguntas.filter(pergunta => pergunta.tema == tema.tema)
            .forEach(pergunta => {
                let divPergunta = document.createElement('div');
                let h3 = document.createElement('h3');
                h3.innerText = 'Pergunta ' + i;
                divPergunta.appendChild(h3);
                let p = document.createElement('p');
                p.innerText = pergunta.pergunta;
                divPergunta.appendChild(p);

                let label1 = document.createElement('label');
                label1.innerText = 'Certo';
                let radio1 = document.createElement('input');
                radio1.type = 'radio';
                radio1.name = 'pergunta' + i;
                radio1.value = '1';
                label1.prepend(radio1);
                divPergunta.appendChild(label1);

                let label2 = document.createElement('label');
                label2.innerText = 'Errado';
                let radio2 = document.createElement('input');
                radio2.type = 'radio';
                radio2.name = 'pergunta' + i;
                radio2.value = '0';
                label2.prepend(radio2);
                divPergunta.appendChild(label2);

                divPergunta.dataset.resposta = pergunta.resposta;
                divPergunta.dataset.correcao = pergunta.correcao;
                divPergunta.dataset.radioCerto = radio1.id = 'pergunta' + i + 'opcao1';
                divPergunta.dataset.radioErrado = radio2.id = 'pergunta' + i + 'opcao2';
                divTema.appendChild(divPergunta);

                i++;
            });

        conteudo.appendChild(divTema);
    });
}

function corrigir() {
    let divsPergunta = document.querySelectorAll('#conteudo > div > div');
    let acertos = 0;
    let total = divsPergunta.length;

    divsPergunta.forEach(div => {
        let resposta = div.dataset.resposta;
        let selecionado = document.querySelector(`input[name='${div.querySelector('input').name}']:checked`);
        let idRadioCorreto = resposta == '1' ? div.dataset.radioCerto : div.dataset.radioErrado;

        if (selecionado) {
            if (selecionado.value === resposta) {
                acertos++;
                document.getElementById(idRadioCorreto).parentNode.style.backgroundColor = 'lightgreen';
            } else {
                selecionado.parentNode.style.backgroundColor = 'pink';
            }
            document.getElementById(idRadioCorreto).innerText = resposta == '1' ? 'Certo. ' + div.dataset.correcao : 'Errado. ' + div.dataset.correcao;
        }
    });

    document.getElementById('resultado').innerText = `Você acertou ${acertos} de ${total} (${(acertos / total * 100).toFixed(2)}%)`;

    temas.forEach(tema => {
        let divTema = Array.from(document.querySelectorAll('#conteudo > div')).find(div => div.querySelector('h2').innerText == tema.descricao);
        if (!divTema.querySelector('.complemento')) {
            let pComplemento = document.createElement('p');
            pComplemento.className = 'complemento';
            pComplemento.innerText = tema.complemento;
            divTema.appendChild(pComplemento);
        }
    });
}