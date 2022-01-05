"use strict";
var listaDeps = new Array();

function buscarListaDeps (urlInicio) {
    var corpoResposta;
    var req = new XMLHttpRequest();
    var dados;

    req.open ("GET", urlInicio);
    req.onreadystatechange = function (evt) {
        if (req.readyState === req.DONE &&
            req.status >= 200 && req.status < 300) {

            corpoResposta = JSON.parse(req.responseText);

            listaDeps = listaDeps.concat(corpoResposta.dados);
        }
    }
    req.setRequestHeader ("Accept", "application/json");
    req.send();
}

const cardsDeputados = document.getElementById("cards-deputados")
buscarListaDeps("https://dadosabertos.camara.leg.br/api/v2/deputados?itens=8");
setTimeout(() => {criarCards()}, 2000)

function buscarDeputadoPorNome(nomeDeputado) {
    buscarListaDeps(`https://dadosabertos.camara.leg.br/api/v2/deputados?nome=${nomeDeputado}&itens=8&ordem=ASC&ordenarPor=nome`)
}

function buscarDeputado() {
    listaDeps = []
    let nomeDeputado = (document.getElementById("nome-deputado").value).trim()
    nomeDeputado = nomeDeputado.replace(/ /g, '%20')
    buscarDeputadoPorNome(nomeDeputado)
    setTimeout(() => {
        criarCards()}, 2000)
}

function criarCards() {
    cardsDeputados.innerHTML = ""
    if (listaDeps.length === 0)  {
        window.alert("Nenhum deputado com esse nome foi encontrado!")
        return
    }
    if (listaDeps.length < 2) {
        cardsDeputados.className = ''
        cardsDeputados.className = `cards row row-cols-${listaDeps.length}`
    } else if(listaDeps.length < 4) {
        cardsDeputados.className = ''
        cardsDeputados.className = `cards row row-cols-2 row-cols-md-${listaDeps.length}`
    } else {
        cardsDeputados.className = ''
        cardsDeputados.className = "cards row row-cols-2 row-cols-md-4"
    }

    for (let deputado of listaDeps) {
        
        let deputadoPartido = deputado.siglaPartido == null ? 'Sem Partido' : deputado.siglaPartido
        cardsDeputados.innerHTML += `<div class="col">
                                        <div class="card h-100">
                                            <img src="${deputado.urlFoto}" class="card-img-top" alt="Foto do deputado ${deputado.nome}">
                                            <div class="card-body">
                                                <h5 class="card-title">${deputado.nome}<span>(${deputadoPartido}-${deputado.siglaUf})</span></h5>
                                                <p class="card-text">Legislaturas em que exerceu mandato: <b>${deputado.idLegislatura}<b>ª</p>
                                            </div>
                                            <div class="card-footer ">
                                                <ul class="list-group list-group-horizontal">
                                                    <li>
                                                        <a href="https://www.facebook.com/" title="Facebook" target="_blank">
                                                            <i class="fab fa-facebook-square fa-lg"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://twitter.com/" title="twitter" target="_blank">
                                                            <i class="fab fa-twitter-square fa-lg"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.instagram.com/" title="Instagram" target="_blank">
                                                            <i class="fab fa-instagram-square fa-lg"></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>`
    }
}

var listaEventos = new Array();

function buscarListaEventos (urlInicio) {
    var corpoResposta;
    var req = new XMLHttpRequest();
    var dados;

    req.open ("GET", urlInicio);
    req.onreadystatechange = function (evt) {
        if (req.readyState === req.DONE &&
            req.status >= 200 && req.status < 300) {
            
            corpoResposta = JSON.parse(req.responseText);

            listaEventos = listaEventos.concat(corpoResposta.dados);
        }
    }
    req.setRequestHeader ("Accept", "application/json");
    req.send();
}

buscarListaEventos("https://dadosabertos.camara.leg.br/api/v2/eventos?ordem=ASC&ordenarPor=dataHoraInicio")
setTimeout(() => {eventosCards(), inserirEventos()}, 2000)
const eventosHTML = document.getElementById("eventos-grid")

let eventosTabela

function eventosCards() {
    eventosTabela = listaEventos.slice(0, 2)
}

function inserirEventos() {
    let containerMetade = eventosTabela > 0 ? "container-metade" : ""
    for (let evento of eventosTabela) {
        let dataHora = evento.dataHoraInicio.split("T")
        let data = dataHora[0]
        let hora = dataHora[1]
        let descricaoDetalhada = evento.descricao.split("\r")
        let descricaoEvento = descricaoDetalhada[0]
        
        eventosHTML.innerHTML += `<div class="row ${containerMetade}">
                                    <div class="data-evento col-4">
                                        <div class="col">
                                            <p><i class="fas fa-calendar-alt"></i></p>
                                            <p><i class="fas fa-clock"></i></p>
                                        </div>
                                        <div class="col-8">
                                            <p> ${data}</p>
                                            <p>${hora}</p>
                                        </div>
                                    </div>
                                    <div class="col-8 border-left">
                                        <p>CÂMARA DOS DEPUTADOS</p>
                                        <p>${descricaoEvento} - ${evento.descricaoTipo}</p>
                                        <p>${evento.localCamara.nome}</p>
                                    </div>
                                 </div>`                   
    }
} 

function smoothScroll(element){
    let scrollToId = element.getAttribute("data-scroll");
    document.querySelector(scrollToId).scrollIntoView({
        behavior: 'smooth'
    });
}