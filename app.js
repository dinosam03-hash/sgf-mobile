const RESERVA_MINIMA = 50;

let dados = {

    saldo: 0,

    historico: [],

    compras: [],

    metas: []

};

/* ========================
   SALVAR
======================== */

async function salvar() {

    if (
        !window.firebaseDB
    ) return;

    await window.firebaseSetDoc(

        window.firebaseDoc(
            window.firebaseDB,
            "sgf",
            "principal"
        ),

        dados

    );

}

/* ========================
   DINHEIRO
======================== */

function money(v) {

    return (

        "R$ " +

        Number(v)
        .toFixed(2)

    );

}

/* ========================
   DATA
======================== */

function agora() {

    return new Date()
        .toLocaleString(
            "pt-BR"
        );

}

/* ========================
   PÁGINAS
======================== */

function abrirPagina(id) {

    document
        .querySelectorAll(
            ".pagina"
        )

        .forEach(p => {

            p.classList.remove(
                "ativa"
            );

        });

    document
        .getElementById(id)

        .classList.add(
            "ativa"
        );

}

/* ========================
   DASHBOARD
======================== */

function atualizarDashboard() {

    let entradas = 0;

    let saidas = 0;

    (dados.compras || []).forEach(

        mov => {

            if (

                mov.tipo ===
                "entrada"

            ) {

                entradas +=
                mov.valor;

            }

            if (

                mov.tipo ===
                "saida"

            ) {

                saidas +=
                mov.valor;

            }

            if (

                mov.tipo ===
                "compra"

            ) {

                saidas +=
                mov.valor;

            }

            if (

                mov.tipo ===
                "retirada_total"

            ) {

                saidas +=
                mov.valor;

            }

        }

    );

    document
        .getElementById(
            "saldoAtual"
        )

        .innerText = money(
            dados.saldo
        );

    document
        .getElementById(
            "totalEntradas"
        )

        .innerText = money(
            entradas
        );

    document
        .getElementById(
            "totalSaidas"
        )

        .innerText = money(
            saidas
        );

    document
        .getElementById(
            "totalCompras"
        )

        .innerText =
        dados.compras.length;

    atualizarStatus();

}

/* ========================
   STATUS
======================== */

function atualizarStatus() {

    let status = document
        .getElementById(
            "statusFinanceiro"
        );

    if (

        dados.saldo <= 0

    ) {

        status.innerText =
        "Saldo Zerado";

        status.style.color =
        "#EF4444";

        return;

    }

    if (

        dados.saldo <
        RESERVA_MINIMA

    ) {

        status.innerText =
        "Reserva Baixa";

        status.style.color =
        "#F59E0B";

        return;

    }

    status.innerText =
    "Situação Estável";

    status.style.color =
    "#22C55E";

}

/* ========================
   ENTRADA
======================== */

function adicionarEntrada() {

    let valor = Number(

        document
        .getElementById(
            "valorMov"
        )
        .value

    );

    if (

        !valor ||

        valor <= 0

    ) {

        alert(
            "Valor inválido"
        );

        return;

    }

    dados.saldo += valor;

    dados.historico.unshift({

        tipo:
        "entrada",

        valor:
        valor,

        descricao:

        document
        .getElementById(
            "descMov"
        )
        .value,

        categoria:

        document
        .getElementById(
            "categoriaMov"
        )
        .value,

        autor:

        document
        .getElementById(
            "autorMov"
        )
        .value,

        data:
        agora()

    });

    salvar();

    atualizarTudo();

}

/* ========================
   SAÍDA
======================== */

function retirarValor() {

    let valor = Number(

        document
        .getElementById(
            "valorMov"
        )
        .value

    );

    if (

        !valor ||

        valor <= 0

    ) {

        return;

    }

    if (

        dados.saldo -
        valor < 0

    ) {

        alert(
            "Saldo insuficiente"
        );

        return;

    }

    dados.saldo -= valor;

    dados.historico.unshift({

        tipo:
        "saida",

        valor:
        valor,

        descricao:

        document
        .getElementById(
            "descMov"
        )
        .value,

        categoria:

        document
        .getElementById(
            "categoriaMov"
        )
        .value,

        autor:

        document
        .getElementById(
            "autorMov"
        )
        .value,

        data:
        agora()

    });

    salvar();

    atualizarTudo();

}

/* ========================
   RETIRAR TUDO
======================== */

function retirarTudo() {

    if (

        dados.saldo <= 0

    ) {

        return;

    }

    let saldoAtual =
    dados.saldo;

    dados.saldo = 0;

    dados.historico.unshift({

        tipo:
        "retirada_total",

        valor:
        saldoAtual,

        descricao:
        "Retirada Total",

        categoria:
        "Sistema",

        autor:
        "Sistema",

        data:
        agora()

    });

    salvar();

    atualizarTudo();

}

/* ========================
   COMPRA
======================== */

function registrarCompra() {

    let produto =
    document
    .getElementById(
        "produto"
    )
    .value;

    let qtd = Number(

        document
        .getElementById(
            "quantidade"
        )
        .value

    );

    let preco = Number(

        document
        .getElementById(
            "preco"
        )
        .value

    );

    let total =
    qtd * preco;

    if (

        !produto ||

        qtd <= 0 ||

        preco <= 0

    ) {

        alert(
            "Dados inválidos"
        );

        return;

    }

    if (

        dados.saldo < total

    ) {

        alert(
            "Saldo insuficiente"
        );

        return;

    }

    dados.saldo -= total;

    dados.compras.unshift({

        produto,

        qtd,

        preco,

        total,

        data:
        agora()

    });

    dados.historico.unshift({

        tipo:
        "compra",

        valor:
        total,

        descricao:
        produto,

        data:
        agora()

    });

    salvar();

    atualizarTudo();

}

/* ========================
   META
======================== */

function criarMeta() {

    let nome =
    document
    .getElementById(
        "metaNome"
    )
    .value;

    let valor = Number(

        document
        .getElementById(
            "metaValor"
        )
        .value

    );

    if (

        !nome ||

        valor <= 0

    ) {

        return;

    }

    dados.metas.unshift({

        nome,

        valor

    });

    salvar();

    atualizarTudo();

}

/* ========================
   LISTAS
======================== */

function atualizarHistorico() {

    let html = "";

    dados.historico.forEach(

        mov => {

            html += `

            <div class="item">

                <div class="itemTitulo">

                    ${mov.tipo}

                </div>

                <div class="itemInfo">

                    ${money(
                        mov.valor
                    )}

                    |

                    ${mov.data}

                </div>

                <div>

                    ${mov.descricao || ""}

                </div>

            </div>

            `;

        }

    );

    document
    .getElementById(
        "historicoLista"
    ).innerHTML = html;

}

/* ========================
   COMPRAS
======================== */

function atualizarCompras() {

    let html = "";

    dados.compras.forEach(

        c => {

            html += `

            <div class="item">

                <div class="itemTitulo">

                    ${c.produto}

                </div>

                <div class="itemInfo">

                    ${c.qtd}x

                    |

                    ${money(
                        c.total
                    )}

                </div>

            </div>

            `;

        }

    );

    document
    .getElementById(
        "listaCompras"
    ).innerHTML = html;

}

/* ========================
   METAS
======================== */

function atualizarMetas() {

    let html = "";

    (dados.metas || []).forEach(

        m => {

            let perc = Math.min(

                100,

                Math.round(
                    (
                        dados.saldo
                        /
                        m.valor
                    ) * 100
                )

            );

            html += `

            <div class="item">

                <div class="itemTitulo">

                    ${m.nome}

                </div>

                <div class="itemInfo">

                    Alvo:

                    ${money(
                        m.valor
                    )}

                </div>

                <div>

                    ${perc}%

                </div>

            </div>

            `;

        }

    );

    document
    .getElementById(
        "listaMetas"
    ).innerHTML = html;

}

/* ========================
   BACKUP JSON
======================== */

function backup() {

    const arquivo = new Blob(

        [

            JSON.stringify(
                dados,
                null,
                2
            )

        ],

        {

            type:
            "application/json"

        }

    );

    const a =
    document.createElement(
        "a"
    );

    a.href =
    URL.createObjectURL(
        arquivo
    );

    a.download =
    "sgf_backup.json";

    a.click();

}

async function iniciarFirebase() {

    const referencia =

    window.firebaseDoc(

        window.firebaseDB,

        "sgf",

        "principal"

    );

    const docSnap =

    await window.firebaseGetDoc(
        referencia
    );

    if (
    docSnap.exists()
) {

    dados = {

        saldo: 0,
        historico: [],
        compras: [],
        metas: [],

        ...docSnap.data()

    };

}

    window.firebaseOnSnapshot(

        referencia,

        snapshot => {

            if (

                snapshot.exists()

            ) {

                dados =
                snapshot.data();

                atualizarTudo();

            }

        }

    );

    atualizarTudo();

}

/* ========================
   ATUALIZAÇÃO GERAL
======================== */

function atualizarTudo() {

    atualizarDashboard();

    atualizarHistorico();

    atualizarCompras();

    atualizarMetas();

    salvar();

}

window.addEventListener(

    "load",

    () => {

        iniciarFirebase();

    }

);