import initTooltip from './tooltip.js';
Prism.highlightAll();

const c = {
  contentArray: [],
  etapaInicial: 1,
  etapaAtual: 1,
  totalEtapas: 0,
}

if(window.self !== window.top) {
  document.querySelector('nav').classList.add('hide');
}

// Fetch inicial
function init() {
  if(location.href.search('#') === -1)
    linkExemplos[0].click();
  else
    fetchAllContent(route(location), totalByLocation(location));
}

// Fetch dos itens do exemplo
const linkExemplos = document.querySelectorAll('.link-exemplos a');
linkExemplos.forEach(item => {
  item.addEventListener('click', handleLinkExemplo);
});
function handleLinkExemplo(event) {
  const currentLink = event.currentTarget;
  c.contentArray = [];
  c.etapaInicial = 1;
  c.etapaAtual = 1;
  c.totalEtapas = +currentLink.dataset.total;
  fetchAllContent(route(currentLink), c.totalEtapas);
}
function addClassToUrlLink(url) {
  linkExemplos.forEach(i => i.classList.remove('active'));
  const element = document.querySelector(`[href="#/${url}/"]`);
  element.classList.add('active');
}

// Limpa o url e retorna apenas a rota
function route(url) {
  url = url.href.split('/');
  const total = url.length;
  return (url[total - 2] !== '#') ? url[total - 2] : url[total - 1];
}

// Puxa o total de slides, comparando o data atribute no link e o URL
function totalByLocation(url) {
  const href = route(url);
  const link = document.querySelector(`[href="#/${href}/"]`);
  const total = +link.dataset.total;
  return total;
}

// Faz o fetch de todas as páginas e coloca na array c.contentArray
function fetchAllContent(url, total) {
  fetch(`exemplos/${url}/${c.etapaInicial}.html`).then(r => r.text())
  .then(r => {
    c.etapaInicial++;
    c.contentArray.push(r);
    document.body.classList.add(url);
    if(c.etapaInicial <= total)
      fetchAllContent(url, total);
    else {
      c.totalEtapas = total;
      addClassToUrlLink(url);
      fetchEtapa(1);
    }
  });
}

// De acordo com a etapa seleciona o item na array c.contentArray e popula o DOM
const dom = document.createElement('div');
const etapaCounter = document.querySelector('.etapa');

function fetchEtapa(etapa) {
  etapaCounter.innerText = etapa;
  dom.innerHTML = c.contentArray[etapa - 1];
  const elements = Array.from(dom.children);
  elements.forEach(element => {
    const actualElement = document.getElementById(element.id);
    if(element.id === 'code-line') {
      actualElement.nextElementSibling.dataset.line = element.dataset.line;
      Prism.highlightAll();
      if(element.dataset.line === '0') {
        setTimeout(() => {
          const code = document.querySelector('.code');
          code.querySelector('.line-highlight').remove();
        });
      }
      if(element.dataset.queue)
        document.querySelector('#event').classList.add('animate');
      else
        document.querySelector('#event').classList.remove('animate');
    }

    // Adiciona o line highlight no html
    if(element.id === 'html') {
      actualElement.dataset.line = element.dataset.line;
      if(element.dataset.line === '0')
        setTimeout(() => actualElement.querySelector('.line-highlight').remove());
    }

    actualElement.innerHTML = element.innerHTML;
    initTooltip(actualElement);
    if(element.id === 'code' || element.id === 'html')
      Prism.highlightAll();
  })
  // Remove os itens com data-remover
  const remover = document.querySelectorAll('[data-remove]');
  setTimeout(() => {remover.forEach(item => item.remove())}, 1000);
  activeTabWithClass();
}

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
    if(c.etapaAtual < c.totalEtapas) {
      fetchEtapa(++c.etapaAtual);
    }
    else if (c.etapaAtual >= c.totalEtapas) {
      c.etapaAtual = 1;
      fetchEtapa(c.etapaAtual);
    }
  }

  function handleAnterior() {
    if(c.etapaAtual > 1)
      fetchEtapa(--c.etapaAtual);
    else if (c.etapaAtual <= 1) {
      c.etapaAtual = c.totalEtapas;
      fetchEtapa(c.etapaAtual);
    }
  }
}
initNav();

init();

// Tab nav do Log e HTML
function initTab() {
  const tabMenu = document.querySelectorAll('.js-tabmenu li a');

  if(tabMenu.length) {
    function activeTab(index, tabContent) {
      tabContent.forEach(item => item.classList.remove('active'));
      tabMenu.forEach(item => item.classList.remove('active'));
      tabContent[index].classList.add('active');
      tabMenu[index].classList.add('active');
    }

    function handleClick(event, index) {
      const tabContent = document.querySelectorAll('.js-tabcontent');
      event.preventDefault();
      activeTab(index, tabContent);
    };

    tabMenu.forEach((itemMenu, index) => {
      itemMenu.addEventListener('click', (event) => handleClick(event, index));
    });

  }
}

function activeTabWithClass() {
  const tabContent = document.querySelector('.js-tabcontent .active');
  if(tabContent) {
    const activeItens = document.querySelectorAll('.js-tabcontent.active, .js-tabmenu .active');
    activeItens.forEach(item => item.classList.remove('active'));
    const id = tabContent.parentElement.id;
    document.querySelector(`.${id}`).classList.add('active');
    document.querySelector(`[href="#${id}"]`).classList.add('active');
  }
}

initTab();