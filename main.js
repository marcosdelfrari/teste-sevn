import "./style.css";
import escudos from "./escudos.js";

const leftBtn = `<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 13L1 7L7 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const rightBtn = `<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.999999 1L7 7L1 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const versus = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 1L1 13" stroke="#D1D1D1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1 1L13 13" stroke="#D1D1D1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

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
         <h1>Confira as rodadas do nosso campeonato fictício!</h1>
           
          <div class="box">
            <div class="header-box">
              <button id="prev" ${rodada === 0 ? "disabled" : ""}>${leftBtn}
</button>
              <div class="title-rodadas">
                <h2>Rodadas de Jogos</h2><span>Rodada ${round.round}</span>
              </div>
              <button id="next" ${
                rodada === rodadas.length - 1 ? "disabled" : ""
              }>${rightBtn}
</button>
            </div>
            <div class="container">
              ${round.games
                .map(
                  (game) => `
                <div class="jogos">
                  <div class="escudo">
                    <span>${getEscudo(game.team_home_name)}</span>
                       <span>${game.team_home_name}</span></div>
                  <div class="versus"> 
                   ${game.team_home_score} ${versus} ${
                    game.team_away_score
                  }</div>
                  <div class="escudo">
                    <span>${game.team_away_name}</span>
                    <span>${getEscudo(game.team_away_name)}</span></div>
                 
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
      console.log(
        "Validação do escudo por conta de cache do chrome" + teamName + svg
      );
      return svg ? `${svg}` : ``;
    }

    renderRodadas(rodadaAtual);
  } catch (error) {
    console.error("erro:", error);
    document.querySelector("#app").innerHTML = `<p>Não funcionou</p>`;
  }
}

updateContent();
