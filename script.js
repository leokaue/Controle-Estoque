const itemTableBody = document.querySelector("#item-table tbody");
const addItemBtn = document.querySelector("#add-item");
const espessuraFilter = document.querySelector("#espessura-filter");
const itemNomeInput = document.querySelector("#item-nome");
const itemTipoSelect = document.querySelector("#item-tipo");
const categoriaButtons = document.querySelectorAll(".categoria-btn");

let currentCategoria = "mdf";

const categorias = {
    mdf: { espessuras: ["25","18","15","6"], itens: [] },
    fitas: { espessuras: ["65","35","22"], itens: [] },
    ferragem: { tipos: [
        "Bigfer", "FGV",
        "Häfele", "Parafusos", "Sistemas de Portas", "Colas",
        "Barras Puxadores", "Ponteiras Puxador", "Suportes Cabideiros", "Cantoneiras"
    ], itens: [] }
};

// Atualiza filtros e formulário de adição
function updateFilterOptions() {
    espessuraFilter.innerHTML = `<option value="todas">Todas</option>`;
    itemTipoSelect.innerHTML = "";

    if(currentCategoria === "ferragem") {
        categorias.ferragem.tipos.forEach(tipo => {
            const opt1 = document.createElement("option");
            opt1.value = tipo;
            opt1.textContent = tipo;
            espessuraFilter.appendChild(opt1);

            const opt2 = document.createElement("option");
            opt2.value = tipo;
            opt2.textContent = tipo;
            itemTipoSelect.appendChild(opt2);
        });
    } else {
        categorias[currentCategoria].espessuras.forEach(e => {
            const opt1 = document.createElement("option");
            opt1.value = e;
            opt1.textContent = e + " mm";
            espessuraFilter.appendChild(opt1);

            const opt2 = document.createElement("option");
            opt2.value = e;
            opt2.textContent = e + " mm";
            itemTipoSelect.appendChild(opt2);
        });
    }
}

// Renderizar tabela
function renderTable() {
    const filtro = espessuraFilter.value;
    const itens = categorias[currentCategoria].itens;

    itemTableBody.innerHTML = "";
    itens.forEach((item,index)=>{
        if(filtro==="todas" || (currentCategoria==="ferragem" && item.tipo===filtro) || item.espessura===filtro){
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.nome}</td>
                <td>${currentCategoria==="ferragem"?item.tipo:item.espessura}</td>
                <td>${item.quantidade}</td>
                <td>
                    <button class="action-btn add-btn" onclick="addQuantity(${index})">+</button>
                    <button class="action-btn remove-btn" onclick="removeQuantity(${index})">-</button>
                    <button class="action-btn delete-btn" onclick="deleteItem(${index})">Excluir</button>
                </td>
            `;
            itemTableBody.appendChild(row);
        }
    });
}

// Funções de ação
function addQuantity(index){categorias[currentCategoria].itens[index].quantidade++;renderTable();}
function removeQuantity(index){if(categorias[currentCategoria].itens[index].quantidade>0) categorias[currentCategoria].itens[index].quantidade--;renderTable();}
function deleteItem(index){categorias[currentCategoria].itens.splice(index,1);renderTable();}

// Adicionar item pelo formulário
addItemBtn.addEventListener("click", ()=>{
    const nome = itemNomeInput.value.trim();
    const tipo = itemTipoSelect.value;

    if(!nome){alert("Digite o nome do item."); return;}

    if(currentCategoria==="ferragem"){
        categorias.ferragem.itens.push({nome,tipo,quantidade:0});
    } else {
        categorias[currentCategoria].itens.push({nome,espessura:tipo,quantidade:0});
    }

    itemNomeInput.value="";
    renderTable();
});

// Troca de categoria
categoriaButtons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        categoriaButtons.forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        currentCategoria = btn.dataset.categoria;
        updateFilterOptions();
        renderTable();
    });
});

// Atualiza tabela ao mudar filtro
espessuraFilter.addEventListener("change", renderTable);

// Inicialização
updateFilterOptions();
renderTable();
