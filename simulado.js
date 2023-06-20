let temas = null;
let perguntas = null;

fetch("temas.csv")
    .then(response => response.text())
    .then(data => {
        temas = CSVToArray(data, ";").map(tema => {
            return {
                tema: Number(tema[0]),
                descricao: tema[1],
                resumo: tema[2],
                complemento: tema[3],
            };
        });

        fetch("perguntas.csv")
            .then(response => response.text())
            .then(data => {
                perguntas = CSVToArray(data, ";").map(pergunta => {
                    return {
                        tema: Number(pergunta[0]),
                        pergunta: pergunta[1],
                        resposta: Number(pergunta[2]),
                        correcao: pergunta[3],
                    };
                });
                
                exibirPerguntas();
            });
    });

function CSVToArray(strData, strDelimiter) {
    strDelimiter = strDelimiter || ",";
    let objPattern = new RegExp(
        "(\\" +
            strDelimiter +
            "|\\r?\\n|\\r|^)" +
            '(?:"([^"]*(?:""[^"]*)*)"|' +
            '([^"\\' +
            strDelimiter +
            "\\r\\n]*))",
        "gi"
    );
    let arrData = [[]];
    let arrMatches = null;
    while ((arrMatches = objPattern.exec(strData))) {
        let strMatchedDelimiter = arrMatches[1];
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {
            arrData.push([]);
        }
        if (arrMatches[2]) {
            var strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
        } else {
            var strMatchedValue = arrMatches[3];
        }
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    return arrData;
}

function exibirPerguntas(temas, perguntas) {
    const conteudo = document.getElementById('conteudo');
    conteudo.innerHTML = '';

    temas.forEach(tema => {
        const divTema = document.createElement('div');
        const h2 = document.createElement('h2');
        h2.textContent = tema.descricao;

        const pResumo = document.createElement('p');
        pResumo.textContent = tema.resumo;

        divTema.appendChild(h2);
        divTema.appendChild(pResumo);
        
        const pComplemento = document.createElement('p');
        divTema.appendChild(pComplemento);

        perguntas.filter(p => p.tema == tema.tema).forEach((pergunta, index) => {
            const divPergunta = document.createElement('div');
            const h3 = document.createElement('h3');
            h3.textContent = 'Pergunta ' + (index + 1);
            divPergunta.appendChild(h3);

            const pPergunta = document.createElement('p');
            pPergunta.textContent = pergunta.pergunta;
            divPergunta.appendChild(pPergunta);

            ['Certo', 'Errado'].forEach((opcao, i) => {
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'pergunta' + pergunta.pergunta;
                input.value = i;
                divPergunta.appendChild(input);

                const label = document.createElement('label');
                label.textContent = opcao;
                divPergunta.appendChild(label);
            });

            divTema.appendChild(divPergunta);
        });

        conteudo.appendChild(divTema);
    });
}

function corrigir() {
    const temas = carregarCSV('temas.csv', ['tema', 'descricao', 'resumo', 'complemento']);
    const perguntas = carregarCSV('perguntas.csv', ['tema', 'pergunta', 'resposta', 'correcao']);
    let corretas = 0;

    temas.forEach((tema, tIndex) => {
        perguntas.filter(p => p.tema == tema.tema).forEach((pergunta, pIndex) => {
            const divPergunta = document.getElementById('conteudo').children[tIndex].children[pIndex + 2];
            const inputs = divPergunta.getElementsByTagName('input');
            const labels = divPergunta.getElementsByTagName('label');
            for(let i = 0; i < inputs.length; i++) {
                inputs[i].parentElement.classList.remove('correto', 'errado');
                if(inputs[i].checked) {
                    if(inputs[i].value == pergunta.resposta) {
                        labels[i].textContent = labels[i].textContent.split(". ")[0] + ". " + perguntas.correcao;
                        labels[i].parentElement.classList.add('correto');
                        corretas++;
                    } else {
                        labels[i].textContent = labels[i].textContent.split(". ")[0] + ". " + perguntas.correcao;
                        labels[i].parentElement.classList.add('errado');
                    }
                }
            }
        });

        const pComplemento = document.getElementById('conteudo').children[tIndex].children[2 + perguntas.filter(p => p.tema == tema.tema).length];
        pComplemento.textContent = tema.complemento;
    });

    document.getElementById('resultado').textContent = `Você acertou ${corretas} de ${perguntas.length} (${(corretas/perguntas.length*100).toFixed(2)}%)`;
}

window.onload = () => {
    const temas = carregarCSV('temas.csv', ['tema', 'descricao', 'resumo', 'complemento']);
    const perguntas = carregarCSV('perguntas.csv', ['tema', 'pergunta', 'resposta', 'correcao']);
    exibirPerguntas(temas, perguntas);
};