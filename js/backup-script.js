import initTooltip from './tooltip.js';

Prism.highlightAll();

// worst code ever
let dom = document.createElement('div');
let totalEtapas;
let etapaAtual = 1;

const etapaCounter = document.querySelector('.etapa');
const linkExemplos = document.querySelectorAll('.link-exemplos a');

function handleLinkExemplo(event) {
  etapaCounter.innerText = 1;
  etapaAtual = 1;
  fetchEtapa(1, returnRoute(event.currentTarget));
}

linkExemplos.forEach(item => {
  item.addEventListener('click', handleLinkExemplo);
});

function returnRoute(url) {
  url = url.href.split('/');
  const total = url.length;
  return (url[total - 2] !== '#') ? url[total - 2] : url[total - 1];
}

const allContent = [];
let etapa = 1;
function fetchAllContent(url, total) {
  fetch(`exemplos/${url}/${etapa}.html`).then(r => r.text())
  .then(r => {
    etapa++;
    allContent.unshift(r);
    if(etapa <= total)
      fetchAllContent(url, total);
  });
  setTimeout(()=>console.log(allContent))
}
fetchAllContent('settimeout', 14);

function fetchEtapa(etapa = 1, exemplo) {
  exemplo = exemplo || returnRoute(location);

  etapaCounter.innerText = etapa;
  fetch(`exemplos/${exemplo}/${etapa}.html`).then(r => r.text())
  .then(r => {
    dom.innerHTML = r;
    const elements = Array.from(dom.children);
    elements.forEach(element => {
      const actualElement = document.getElementById(element.id);
      if(element.id === 'code-line') {
        actualElement.nextElementSibling.dataset.line = element.dataset.line;
        Prism.highlightAll();
        if(element.dataset.line === '0')
          setTimeout(() => document.querySelector('.line-highlight').remove());
        if(etapa === 1)
          totalEtapas = +element.dataset.etapas;
        if(element.dataset.queue)
          document.querySelector('#event').classList.add('animate');
        else
          document.querySelector('#event').classList.remove('animate');
      }
      actualElement.innerHTML = element.innerHTML;
      initTooltip(actualElement);
      
      if(element.id === 'code')
        Prism.highlightAll();
    })
  }).then(() => {
    const remover = document.querySelectorAll('[data-remover]');
    setTimeout(() => {
      remover.forEach(item => item.remove());
    }, 1000)
  })
}

fetchEtapa(1)

function initNav() {
  const proximo = document.querySelector('.proximo');
  const anterior = document.querySelector('.anterior');
  proximo.addEventListener('click', handleProximo);
  anterior.addEventListener('click', handleAnterior);
  document.addEventListener('keydown', handleKey);

  function handleKey(event) {
    if(event.code === 'ArrowLeft') {
      handleAnterior()
    } else if(event.code === 'ArrowRight') {
      handleProximo()
    }
  }

  function handleProximo() {
    if(etapaAtual < totalEtapas) {
      fetchEtapa(++etapaAtual);
    }
    else if (etapaAtual >= totalEtapas) {
      etapaAtual = 1;
      fetchEtapa(etapaAtual);
    }
  }

  function handleAnterior() {
    if(etapaAtual > 1)
      fetchEtapa(--etapaAtual);
    else if (etapaAtual <= 1) {
      etapaAtual = totalEtapas;
      fetchEtapa(etapaAtual);
    }
  }
}
initNav();