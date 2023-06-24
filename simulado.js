let temas = [
    { tema: 1, descricao: 'Animais', resumo: 'Tema sobre animais', complemento: 'Isso é tudo sobre animais.' },
    { tema: 2, descricao: 'Objetos', resumo: 'Tema sobre objetos', complemento: 'Isso é tudo sobre objetos.' },
    { tema: 3, descricao: 'Pessoas', resumo: 'Tema sobre pessoas', complemento: 'Isso é tudo sobre pessoas.' },
    { tema: 4, descricao: 'Lugares', resumo: 'Tema sobre lugares', complemento: 'Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.Isso é tudo sobre lugares.' }
  ];
  
  let perguntas = [
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
      let btnTopo = document.getElementById('btnTopo'); // botão de rolar para o topo
      let lastScrollTop = 0;
  
      window.addEventListener('scroll', function() {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollTop > lastScrollTop && scrollTop > cabecalho.offsetHeight) {
              // Ao rolar para baixo e estar abaixo da altura do cabeçalho, esconda-o e mostre o botão
              if (!cabecalho.classList.contains('header-hide')) {
                  cabecalho.classList.add('header-hide');
                  btnTopo.style.display = 'block';  // mostrar o botão de rolar para o topo
              }
          } else {
              // Ao rolar para cima, mostre o cabeçalho
              if (cabecalho.classList.contains('header-hide')) {
                  cabecalho.classList.remove('header-hide');
              }
          }
          
          // Se estiver no topo da página, esconda o botão de rolar para o topo
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
  
          let perguntasDoTema = perguntas.filter(pergunta => pergunta.tema === tema.tema);
  
          perguntasDoTema.forEach((pergunta, j) => {
              let divPergunta = document.createElement('div');
              divPergunta.innerHTML = 
                  `<h3>Pergunta ${indexPerguntaLoad + 1}</h3>
                  <p>${pergunta.pergunta}</p>
                  <label class="pergunta_${indexPerguntaLoad}">
                      <input type="radio" name="resposta_${indexPerguntaLoad}" value=0> Certo
                  </label>
                  <label class="pergunta_${indexPerguntaLoad}">
                      <input type="radio" name="resposta_${indexPerguntaLoad}" value=1> Errado
                  </label>
                  <div id="correcao_${indexPerguntaLoad}" class="correcao"></div>`;
              divTema.appendChild(divPergunta);
              indexPerguntaLoad++;
          });
  
          divTema.innerHTML += `<p class="paragrafo-complementar"></p>`;
      });
  }
  
  function corrigir() {
      let totalPerguntas = perguntas.length;
      let totalCorretas = 0;
      let semResposta = false;
      let resultado = document.getElementById("resultado");
      let containerResultado = document.getElementById("container-resultado"); // Obtenha a div do container de resultado
  
      containerResultado.style.display = "flex"; // Torna a div visível quando a função corrigir() é acionada
      // Primeiro removemos a animação atual se houver uma.
      resultado.style.animation = 'none';
      // Forçamos o navegador a "reflow" o elemento, para que possamos aplicar a animação novamente.
      // Isto é um pouco de uma solução alternativa, mas funciona.
      resultado.offsetHeight; // Provoca o reflow
      resultado.style.animation = "blink 1s ease-in-out 2"; // Aplicamos a animação novamente
  
      perguntas.forEach((pergunta, i) => {
          let radioName = 'resposta_' + i;
          let respostaEscolhida = document.querySelector('input[name="' + radioName + '"]:checked');
  
          if (!respostaEscolhida) {
              semResposta = true;
          }
      });
  
      if (semResposta === true) {
          resultado.innerHTML = "Existem perguntas não respondidas.";
          // Rolar a página até o elemento do resultado
          containerResultado.scrollIntoView({ behavior: 'smooth' });
          return;
      }
  
      let indexPerguntaCheck = 0;
  
      temas.forEach((tema, j) => {
          const pComplemento = document.getElementById('conteudo').children[j].lastElementChild;
          pComplemento.style.display = 'block';
          pComplemento.textContent = tema.complemento;
  
          perguntas.filter(pergunta => pergunta.tema === tema.tema).forEach((pergunta, i) => {
              let radioName = 'resposta_' + indexPerguntaCheck;
              let respostaEscolhida = document.querySelector('input[name="' + radioName + '"]:checked');
              let labels = document.querySelectorAll('.pergunta_' + indexPerguntaCheck);
  
              labels.forEach(label => {
                  label.classList.remove('correto');
                  label.classList.remove('errado');
              });
  
              let correcao = document.getElementById('correcao_' + indexPerguntaCheck);
  
              if (respostaEscolhida.value === pergunta.resposta) {
                  respostaEscolhida.parentNode.classList.add("correto");
                  correcao.style.display = 'none';
                  totalCorretas++;
              } else {
                  respostaEscolhida.parentNode.classList.add("errado");
                  correcao.textContent = pergunta.correcao;  // Coloca a correção no div
                  correcao.style.display = 'block';  // Torna a correção visível
              }
  
              indexPerguntaCheck++;
          });
      });
  
      resultado.innerHTML =
      "Você acertou " +
      totalCorretas +
      " de " +
      totalPerguntas +
      " (" +
      ((totalCorretas / totalPerguntas) * 100).toFixed(2) +
      "%)";
  
      // Rolar a página até o elemento do resultado
      containerResultado.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Função para rolar a página para o topo
  function rolarParaTopo() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }