// Chave única para armazenar os dados no Local Storage
const STORAGE_KEY = 'servilo_usuarios';

// Função para obter os usuários do Local Storage
function getUsuarios() {
    const data = localStorage.getItem(STORAGE_KEY);
    // Retorna um array vazio se não houver dados ou se o parsing falhar
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Erro ao ler Local Storage:", e);
        return [];
    }
}

// Função para salvar os usuários no Local Storage
function saveUsuarios(usuarios) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

// Função para formatar a data e hora
function formatarData(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
}

// Função para renderizar a lista de usuários no DOM
function renderizarLista(usuariosParaExibir = getUsuarios()) {
    const lista = document.getElementById('lista-usuarios');
    lista.innerHTML = ''; // Limpa a lista existente

    if (usuariosParaExibir.length === 0) {
        lista.innerHTML = '<li class="lista-vazia">Nenhum usuário cadastrado.</li>';
        return;
    }

    usuariosParaExibir.forEach((usuario, index) => {
        const li = document.createElement('li');
        // Adiciona um atributo de dados para identificar o item no array original (útil para exclusão)
        li.setAttribute('data-index', usuario.id); 
        
        li.innerHTML = `
            <span class="data-cadastro">${formatarData(usuario.timestamp)}</span> - 
            <span class="nome-usuario"><strong>Nome:</strong> ${usuario.nome}</span> - 
            <span class="email-usuario"><strong>E-mail:</strong> ${usuario.email}</span>
            <button class="btn-excluir" data-id="${usuario.id}">Excluir</button>
        `;
        lista.appendChild(li);
    });
}

// Função para cadastrar um novo usuário
function cadastrarUsuario(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();

    if (!nome || !email) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const novoUsuario = {
        id: Date.now(), // ID único baseado no timestamp para exclusão
        timestamp: Date.now(),
        nome: nome,
        email: email
    };

    const usuarios = getUsuarios();
    usuarios.push(novoUsuario);
    saveUsuarios(usuarios);
    
    // Limpa os campos após o cadastro
    limparCampos();

    // Renderiza a lista atualizada
    renderizarLista();
}

// Função para limpar os campos do formulário
function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
}

// Função para excluir um item individualmente
function excluirItem(id) {
    let usuarios = getUsuarios();
    // Filtra o array, mantendo apenas os usuários cujo ID não corresponde ao ID a ser excluído
    const novoArray = usuarios.filter(usuario => usuario.id !== Number(id));
    
    saveUsuarios(novoArray);
    renderizarLista();
}

// Função para excluir todos os itens
function excluirTodos() {
    if (confirm('Tem certeza que deseja excluir TODOS os usuários cadastrados? Esta ação é irreversível.')) {
        saveUsuarios([]); // Salva um array vazio
        renderizarLista();
    }
}

// Função para pesquisar usuários
function pesquisarUsuarios() {
    const termo = document.getElementById('campo-pesquisa').value.trim().toLowerCase();
    const usuarios = getUsuarios();

    if (!termo) {
        renderizarLista(usuarios); // Se o campo estiver vazio, exibe todos
        return;
    }

    // Filtra os usuários onde o nome OU o email contém o termo de pesquisa
    const resultados = usuarios.filter(usuario => 
        usuario.nome.toLowerCase().includes(termo) || 
        usuario.email.toLowerCase().includes(termo)
    );

    renderizarLista(resultados);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // 1. Carrega a lista ao carregar a página
    renderizarLista();

    // 2. Evento de Cadastro
    const form = document.getElementById('cadastro-form');
    if (form) {
        form.addEventListener('submit', cadastrarUsuario);
    }

    // 3. Evento de Limpar Campos
    const btnLimpar = document.getElementById('btn-limpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', limparCampos);
    }

    // 4. Evento de Excluir Todos
    const btnLimparTudo = document.getElementById('btn-limpar-tudo');
    if (btnLimparTudo) {
        btnLimparTudo.addEventListener('click', excluirTodos);
    }

    // 5. Evento de Pesquisar
    const btnPesquisar = document.getElementById('btn-pesquisar');
    if (btnPesquisar) {
        btnPesquisar.addEventListener('click', pesquisarUsuarios);
    }
    
    // 6. Evento de Exclusão Individual (usando delegação de eventos)
    const listaUsuarios = document.getElementById('lista-usuarios');
    if (listaUsuarios) {
        listaUsuarios.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-excluir')) {
                const id = e.target.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este item?')) {
                    excluirItem(id);
                }
            }
        });
    }
});
