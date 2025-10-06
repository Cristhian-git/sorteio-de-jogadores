// script.js
// Sorteador de times com até 4 jogadores por time
alert('SEJA BEM VINDO');
// Elementos da DOM
const form = document.getElementById('formJogadores');
const campoNome = document.getElementById('campoNomeJogador');
const botaoAdicionar = document.getElementById('botaoAdicionar');
const botaoSortear = document.getElementById('botaoSortear');
const botaoLimpar = document.getElementById('botaoLimpar');
const listaJogadoresEl = document.getElementById('listaJogadores');
const timesContainer = document.getElementById('timesContainer');

// Estado: lista de jogadores
let jogadores = [];

// --- Utilitários ---
function salvarLocalStorage() {
  try { localStorage.setItem('sorteio_jogadores', JSON.stringify(jogadores)); } catch (e) { /* ignore */ }
}

function carregarLocalStorage() {
  try {
    const raw = localStorage.getItem('sorteio_jogadores');
    if (raw) jogadores = JSON.parse(raw);
  } catch (e) {
    jogadores = [];
  }
}

function limparTimes() {
  timesContainer.innerHTML = '';
}

function renderLista() {
  listaJogadoresEl.innerHTML = '';
  if (jogadores.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Nenhum jogador adicionado.';
    li.style.opacity = '0.7';
    listaJogadoresEl.appendChild(li);
    return;
  }

  jogadores.forEach((nome, idx) => {
    const li = document.createElement('li');
    li.setAttribute('data-idx', idx);

    const span = document.createElement('span');
    span.textContent = nome;

    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.className = 'secundario';
    btnRemover.addEventListener('click', () => {
      jogadores.splice(idx, 1);
      salvarLocalStorage();
      renderLista();
      limparTimes();
    });

    li.appendChild(span);
    li.appendChild(btnRemover);
    listaJogadoresEl.appendChild(li);
  });
}

// Fisher-Yates shuffle
function embaralhar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Divide em times com até `tamanho` jogadores por time
function dividirEmTimes(lista, tamanho = 4) {
  const embaralhados = embaralhar(lista);
  const times = [];
  for (let i = 0; i < embaralhados.length; i += tamanho) {
    times.push(embaralhados.slice(i, i + tamanho));
  }
  return times;
}

function renderTimes(times) {
  limparTimes();
  if (times.length === 0) {
    timesContainer.textContent = '';
    return;
  }

  times.forEach((time, idx) => {
    const div = document.createElement('div');
    div.className = 'time';

    const titulo = document.createElement('div');
    titulo.innerHTML = `<strong>Time ${idx + 1}</strong> <span class="pequeno">(${time.length} jogador${time.length > 1 ? 'es' : ''})</span>`;

    const lista = document.createElement('div');
    lista.style.marginTop = '8px';
    lista.textContent = time.join(', ');

    div.appendChild(titulo);
    div.appendChild(lista);
    timesContainer.appendChild(div);
  });
}

// --- Eventos ---

// Ao carregar a página, tentar recuperar a lista salva
carregarLocalStorage();
renderLista();

// Submeter formulário (adicionar jogador)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = campoNome.value.trim();
  if (!nome) return;

  // evitar duplicatas exatas (opcional)
  if (jogadores.some(j => j.toLowerCase() === nome.toLowerCase())) {
    campoNome.value = '';
    campoNome.focus();
    return;
  }

  jogadores.push(nome);
  campoNome.value = '';
  campoNome.focus();
  salvarLocalStorage();
  renderLista();
  limparTimes();
});

// Botão sortear times
botaoSortear.addEventListener('click', () => {
  if (jogadores.length === 0) {
    timesContainer.textContent = '⚠️ Adicione jogadores antes de sortear.';
    return;
  }
if (jogadores.length < 8) {
 const continuar = confirm("Poucos jogadores. Deseja continuar?");
        
        if (continuar) {
            // Usuário clicou em "ok"
            console.log("Usuário quer continuar mesmo com poucos jogadores.");
            // Coloque aqui a condicional para continuar o sorteio
            const times = dividirEmTimes(jogadores, 4);
  renderTimes(times);
  alert('TIMES SORTEADOS! VEJA ABAIXO O RESULTADO.')
        } else {
            // Usuário clicou em "Não"
            console.log("Usuário não quer continuar.");
            // Coloque aqui a condicional para interromper ou outra ação
            return; // Encerra a função para não continuar
        }
  //const times = dividirEmTimes(jogadores, 4);
  //renderTimes(times);
  //alert('TIMES SORTEADOS! VEJA ABAIXO O RESULTADO.')
}});

// Botão limpar lista
botaoLimpar.addEventListener('click', () => {
  if (!confirm('Deseja realmente limpar a lista de jogadores?')) return;
  jogadores = [];
  salvarLocalStorage();
  renderLista();
  limparTimes();
});

// Atalho: Enter no campo para adicionar
campoNome.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    form.requestSubmit();
  }
});

// Exportar função útil para testes (opcional)
window.__sorteio = { dividirEmTimes, embaralhar };
