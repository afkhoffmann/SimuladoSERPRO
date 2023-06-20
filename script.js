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

function exibirPerguntas() {
    let conteudo = document.getElementById("conteudo");
    conteudo.innerHTML = "";

    temas.forEach((tema, i) => {
        let divTema = document.createElement("div");
        let h2 = document.createElement("h2");
        h2.textContent = tema.descricao;
        divTema.appendChild(h2);

        let pResumo = document.createElement("p");
        pResumo.textContent = tema.resumo;
        divTema.appendChild(pResumo);

        perguntas
            .filter(pergunta => pergunta.tema === tema.tema)
            .forEach((pergunta, j) => {
                let divPergunta = document.createElement("div");
                let h3 = document.createElement("h3");
                h3.textContent = "Pergunta " + (j + 1);
                divPergunta.appendChild(h3);

                let pPergunta = document.createElement("p");
                pPergunta.textContent = pergunta.pergunta;
                divPergunta.appendChild(pPergunta);

                let labelCerto = document.createElement("label");
                let radioCerto = document.createElement("input");
                radioCerto.type = "radio";
                radioCerto.name = "pergunta_" + i + "_" + j;
                radioCerto.value = "1";
                labelCerto.appendChild(radioCerto);
                labelCerto.innerHTML += "Certo";
                divPergunta.appendChild(labelCerto);

                let labelErrado = document.createElement("label");
                let radioErrado = document.createElement("input");
                radioErrado.type = "radio";
                radioErrado.name = "pergunta_" + i + "_" + j;
                radioErrado.value = "0";
                labelErrado.appendChild(radioErrado);
                labelErrado.innerHTML += "Errado";
                divPergunta.appendChild(labelErrado);

                divTema.appendChild(divPergunta);
            });

        conteudo.appendChild(divTema);
    });
}

function corrigir() {
    let total = 0;
    let acertos = 0;
    document.getElementById("resultado").textContent = "";

    temas.forEach((tema, i) => {
        let divTema = document.getElementById("conteudo").children[i];
        let pComplemento = document.createElement("p");
        pComplemento.textContent = tema.complemento;
        divTema.appendChild(pComplemento);

        perguntas
            .filter(pergunta => pergunta.tema === tema.tema)
            .forEach((pergunta, j) => {
                total++;
                let divPergunta = divTema.children[j + 2]; // +2 to skip the h2 and p elements
                let labelCerto = divPergunta.children[2];
                let labelErrado = divPergunta.children[3];
                let radioCerto = labelCerto.children[0];
                let radioErrado = labelErrado.children[0];

                radioCerto.checked ? labelCerto.classList.remove("errado") : labelCerto.classList.remove("correto");
                radioErrado.checked ? labelErrado.classList.remove("errado") : labelErrado.classList.remove("correto");

                if (pergunta.resposta === 1) {
                    labelCerto.textContent = "Certo. " + pergunta.correcao;
                    if (radioCerto.checked) {
                        acertos++;
                        labelCerto.classList.add("correto");
                    } else {
                        labelCerto.classList.add("errado");
                    }
                } else {
                    labelErrado.textContent = "Errado. " + pergunta.correcao;
                    if (radioErrado.checked) {
                        acertos++;
                        labelErrado.classList.add("correto");
                    } else {
                        labelErrado.classList.add("errado");
                    }
                }
            });
    });

    document.getElementById("resultado").textContent =
        "Você acertou " +
        acertos +
        " de " +
        total +
        " (" +
        ((acertos / total) * 100).toFixed(2) +
        "%)";
}