const temas = [
    { tema: 1, descricao: "Animais", resumo: "Texto do tema animais" , complemento: "Texto 2 do tema animais" },
    { tema: 2, descricao: "Objetos", resumo: "Texto do tema objetos", complemento: "Texto 2 do tema animais" }
];

const perguntas = [
    { tema: 1, pergunta: "T1 P1?", resposta: 0,  correcao: "Correção da T1P1" },
    { tema: 1, pergunta: "T1 P2?", resposta: 1,  correcao: "Correção da T1P2" },
    { tema: 2, pergunta: "T2 P1?", resposta: 1,  correcao: "Correção da T2P1" }
];

window.onload = function () {
    let conteudo = document.getElementById("conteudo");

    temas.forEach((tema, i) => {
        let divTema = document.createElement("div");
        let h2 = document.createElement("h2");
        h2.innerText = tema.descricao;
        divTema.appendChild(h2);
        
        let pResumo = document.createElement("p");
        pResumo.innerText = tema.resumo;
        divTema.appendChild(pResumo);

        let divPerguntas = document.createElement("div");
        perguntas.filter(p => p.tema == tema.tema).forEach(p => {
            let divPergunta = document.createElement("div");
            let p = document.createElement("p");
            p.innerText = p.pergunta;
            divPergunta.appendChild(p);

            for(let j=0; j<2; j++){
                let radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "pergunta" + i;
                radio.value = j;
                let label = document.createElement("label");
                label.appendChild(radio);
                label.appendChild(document.createTextNode(j === 0 ? "Certo" : "Errado"));
                divPergunta.appendChild(label);
            }
            divPerguntas.appendChild(divPergunta);
        });
        divTema.appendChild(divPerguntas);
        
        let pComplemento = document.createElement("p");
        pComplemento.id = "complemento" + i;
        pComplemento.style.display = "none";
        pComplemento.innerText = tema.complemento;
        divTema.appendChild(pComplemento);

        conteudo.appendChild(divTema);
    });
}

function corrigir() {
    let resultado = document.getElementById("resultado");
    let radios = [...document.querySelectorAll('input[type="radio"]')];
    radios.forEach(radio => radio.parentNode.style.backgroundColor = "");
    let acertos = 0;
    
    perguntas.forEach((pergunta, i) => {
        let respostas = document.getElementsByName("pergunta" + i);
        for(let resposta of respostas){
            if(resposta.checked){
                if(resposta.value == pergunta.resposta){
                    acertos++;
                    resposta.parentNode.style.backgroundColor = "green";
                } else {
                    resposta.parentNode.style.backgroundColor = "red";
                }
            }
            if(resposta.value == pergunta.resposta){
                resposta.parentNode.innerText += ". " + pergunta.correcao;
            }
        }
    });
    
    temas.forEach((tema, i) => {
        document.getElementById("complemento" + i).style.display = "block";
    });
    
    resultado.innerText = "Você acertou " + acertos + " perguntas.";
}