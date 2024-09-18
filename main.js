import "./style.css";
import escudos from "./escudos.js";

async function updateContent() {
  try {
    const response = await fetch("https://sevn-pleno-esportes.deno.dev");

    if (!response.ok) {
      throw new Error("erro na api");
    }

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
            <h1>Confira as rodadas do nosso campeonato fictício!</h1>
            <div>
              <button id="prev" ${rodada === 0 ? "disabled" : ""}>Left</button>
              <div class="title-rodadas">
                <h2>Rodadas de Jogos</h2><span>Rodada ${round.round}</span>
              </div>
              <button id="next" ${
                rodada === rodadas.length - 1 ? "disabled" : ""
              }>Next</button>
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

      document.querySelector("#prev").addEventListener("click", () => {
        if (rodadaAtual > 0) {
          rodadaAtual--;
          renderRodadas(rodadaAtual);
        }
      });

      document.querySelector("#next").addEventListener("click", () => {
        if (rodadaAtual < rodadas.length - 1) {
          rodadaAtual++;
          renderRodadas(rodadaAtual);
        }
      });
    }

    function getEscudo(teamName) {
      const svg = escudos[teamName];
      return svg ? `${svg}` : ` `;
    }

    renderRodadas(rodadaAtual);
  } catch (error) {
    console.error("erro:", error);
    document.querySelector("#app").innerHTML = `<p>Não funcionou</p>`;
  }
}

updateContent();
