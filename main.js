import "./style.css";

async function updateContent() {
  try {
    const response = await fetch("https://sevn-pleno-esportes.deno.dev");

    const rodadas = await response.json();

    let rodadaAtual = 0;

    function renderRodadas(rodada) {
      const round = rodadas[rodada];
      if (!round || !Array.isArray(round.games)) {
        throw new Error("erro de estrutura");
      }

      document.querySelector("#app").innerHTML = `
        <section>
          <div>
            <div>
              <button id="prev" >Left</button>
              <div>
                <h2>Rodadas</h2><span>Rodada ${round.round}</span>
              </div>
              <button id="next">Next</button>
            </div>
            <div>
              ${round.games
                .map(
                  (game) => `
                <div>
                  <div>
                    <span>${getEscudo(game.team_home_name)}</span><span>${
                    game.team_home_name
                  }</span> ${game.team_home_score} X ${
                    game.team_away_score
                  }<span>${game.team_away_name}</span> <span>${getEscudo(
                    game.team_away_name
                  )}</span>
                  </div>
                 
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </section>
      `;
    }

    renderRodadas(rodadaAtual);
  } catch (error) {
    console.error("erro:", error);
    document.querySelector("#app").innerHTML = `<p>Não funcionou</p>`;
  }
}

updateContent();
