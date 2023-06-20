async function carregarDados() {
    perguntas = await carregarCSV("perguntas.csv");
    temas = await carregarCSV("temas.csv");

    for (let tema of temas) {
        let divTema = document.createElement("div");
        let h2 = document.createElement("h2");
        h2.textContent = tema.descricao;
        divTema.appendChild(h2);

        let pResumo = document.createElement("p");
        pResumo.textContent = tema.resumo || "";
        divTema.appendChild(pResumo);

        let perguntasTema = perguntas.filter(p => p.tema == tema.tema);

        for (let i = 0; i < perguntasTema.length; i++) {
            let divPergunta = document.createElement("div");

            let h3 = document.createElement("h3");
            h3.textContent = "Pergunta " + (i + 1);
            divPergunta.appendChild(h3);

            let pPergunta = document.createElement("p");
            pPergunta.textContent = perguntasTema[i].pergunta;
            divPergunta.appendChild(pPergunta);

            for (let opcao = 0; opcao < 2; opcao++) {
                let label = document.createElement("label");
                let radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "pergunta" + perguntasTema[i].tema + i;
                radio.value = opcao;
                label.appendChild(radio);

                let span = document.createElement("span");
                span.textContent = opcao == 0 ? "Certo" : "Errado";
                span.dataset.originalText = span.textContent;  // Armazenamos o texto original aqui.
                label.appendChild(span);
                divPergunta.appendChild(label);
            }

            divTema.appendChild(divPergunta);
        }

        let pComplemento = document.createElement("p");
        pComplemento.textContent = "";
        divTema.appendChild(pComplemento);

        document.getElementById("conteudo").appendChild(divTema);
    }
}

function corrigir() {
    let acertos = 0;
    let total = perguntas.length;

    for (let tema of temas) {
        let perguntasTema = perguntas.filter(p => p.tema == tema.tema);
        for (let i = 0; i < perguntasTema.length; i++) {
            let radios = document.getElementsByName("pergunta" + perguntasTema[i].tema + i);
            let cor = "errado";
            for (let radio of radios) {
                radio.parentNode.className = "";
                if (radio.checked) {
                    if (radio.value == perguntasTema[i].resposta) {
                        cor = "correto";
                        acertos++;
                    }
                    radio.nextSibling.textContent = radio.nextSibling.dataset.originalText + ". " + (radio.value == 0 ? perguntasTema[i].correcao : "");  // Usamos o texto original aqui.
                    radio.parentNode.className = cor;
                }
            }
        }

        let pComplemento = document.getElementById("conteudo").children[tema.tema-1].lastChild;
        if (pComplemento.textContent == "") {
            pComplemento.textContent = tema.complemento || "";
        }
    }

    document.getElementById("resultado").textContent = `Você acertou ${acertos} de ${total} (${(acertos / total * 100).toFixed(2)}%)`;
}

carregarDados();