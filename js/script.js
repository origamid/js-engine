import initTooltip from './tooltip.js';

Prism.highlightAll();

// worst code ever
let dom = document.createElement('div');
const etapaCounter = document.querySelector('.etapa');

function fetchEtapa(etapa = 0) {
  etapaCounter.innerText = etapa;
  fetch(`exemplos/${etapa}.html`).then(r => r.text())
  .then(r => {
    dom.innerHTML = r;
    const elements = Array.from(dom.children);
    
    elements.forEach(element => {
      const actualElement = document.getElementById(element.id);
      if(element.id === 'code') {
        actualElement.nextElementSibling.dataset.line = element.dataset.line;
        Prism.highlightAll();
        if(element.dataset.line === '0')
          setTimeout(()=> document.querySelector('.line-highlight').remove());
        if(element.dataset.queue)
          document.querySelector('#event').classList.add('animate');
        else
          document.querySelector('#event').classList.remove('animate');
      }
      actualElement.innerHTML = element.innerHTML;
      initTooltip(actualElement);
    })
  }).then(() => {
    const remover = document.querySelectorAll('[data-remover]');
    setTimeout(() => {
      remover.forEach(item => item.remove());
    }, 1000)
  })
}

fetchEtapa(0)

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

  let i = 0;
  let total = 13;
  function handleProximo() {
    if(i < total)
      fetchEtapa(++i);
    else if (i === total) {
      i = 0;
      fetchEtapa(i);
    }
  }

  function handleAnterior() {
    if(i >= 1)
      fetchEtapa(--i);
    else if (i === 0) {
      i = total;
      fetchEtapa(i);
    }
  }
}
initNav();