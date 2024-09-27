document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const input = document.querySelector('input[name="input"]');
    const output = document.getElementById('output');
    const helpTexto = document.getElementById('helpTexto');
    const inventarioLista = document.getElementById('inventario-lista');
    const inventario = document.getElementById('inventory');
    const ajuda = document.getElementById('help')


    addMessageToOutput("O mundo enfrenta uma invasão de mortos-vivos, que começou há duas semanas e tem piorado. Após um ataque quase fatal, " +
        "eu me abriguei em uma casa abandonada para descansar. No entanto, " +
        "uma horda de zumbis se aproxima e preciso proteger o local antes do pôr do sol para tentar sobreviver mais um dia. " +
        "<br>Start - Começar jogo <br> Load - Carregar Save <br>");

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const userInput = input.value.trim().toLowerCase();
        if (userInput === '') return;

        addMessageToOutput(`Jogador: ${userInput}`);
        if (userInput === 'inventory') {
            inventario.style.display = 'block';
        } else if (userInput === 'close inventory') {
            inventario.style.display = 'none';
        } else if (userInput === 'help') {
            ajuda.style.display = 'block';
        } else if (userInput === 'close help') {
            ajuda.style.display = 'none'
        } else {
            fetch('/game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({input: userInput})
            })
                .then(response => response.json())
                .then(data => {
                    addMessageToOutput(`Jogo: ${data.message}`);
                    mostrarHelp(data.helpTexto);
                    atualizarInventario(data.inventario);
                    mostrarCenaLocal(data.local); // Cena nome
                    input.value = ''; // Limpar campo
                })
                .catch(error => {
                    console.error('Erro:', error);
                    addMessageToOutput('Comando Invalido, tente outro');
                });
        }
    });

    async function addMessageToOutput(message) {
        const messageElement = document.createElement('div');
        output.appendChild(messageElement);
        output.scrollTop = output.scrollHeight;

        const parts = message.split('<br>').map(part => part.trim());

        for (const part of parts) {
            if (part) {
                for (const char of part) {
                    messageElement.innerHTML += char;
                    await new Promise(resolve => setTimeout(resolve, 3)); // 3 ms cada caractere
                }
                messageElement.innerHTML += '<br>'; //Adiciona quebra de linha
            }
        }
        output.scrollTop = output.scrollHeight; // Scroll para o final após escrever a msg
    }

    function mostrarCenaLocal(meuLocal) {
        const localizacao = document.getElementById('local');
        localizacao.textContent = `Cena Local: ${meuLocal}`;
    }

    function mostrarHelp(helpText) {
        helpTexto.innerHTML = '';
        const comandoSeparado = helpText.split(','); // Separar os comando, quando tiver vírgula
        comandoSeparado.forEach(comando => {
            const comandoElement = document.createElement('div');
            comandoElement.textContent = comando.trim().toUpperCase();
            helpTexto.appendChild(comandoElement);
        });
    }

    function atualizarInventario(itens) {
        inventarioLista.innerHTML = '';
        itens.forEach(item => {
            const listaItens = document.createElement('li');
            listaItens.textContent = `${item.nome} (Quantidade: ${item.quantidade})`;
            inventarioLista.appendChild(listaItens);
        });
    }
});
