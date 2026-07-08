import"./modulepreload-polyfill-Dezn_h7o.js";/* empty css              */import{n as e}from"./firebase-db-BFD1dTOz.js";async function t(){if(!localStorage.getItem(`caelys_admin_token`)){window.location.href=`/login.html`;return}try{let t=[{name:`registrations_mun`,title:`Delegate Registrations - Model United Nations`},{name:`registrations_debate`,title:`Delegate Registrations - Debate & Rhetoric`},{name:`registrations_climate`,title:`Delegate Registrations - Climate Conclave`},{name:`team_mun`,title:`Team Applications - Model United Nations`},{name:`team_debate`,title:`Team Applications - Debate & Rhetoric`},{name:`team_climate`,title:`Team Applications - Climate Conclave`}],n=[],r=``;for(let i of t){let t=await e(i.name);if(n.push(...t),t.length>0){let e=t.map(e=>`
                  <tr>
                    <td style="color: var(--accent-color); font-size: 0.8rem;">#${e.id.slice(-6)}</td>
                    <td><strong>${e.name}</strong></td>
                    <td>${e.email}</td>
                    <td>${e.phone||`N/A`}</td>
                    <td>${e.institution}</td>
                    <td style="font-size: 0.8rem; color: var(--pale-blue);">${e.timestamp?e.timestamp.toDate().toLocaleString():`Just now`}</td>
                  </tr>
                `).join(``);r+=`
                <h2 class="display-large brutal-text" style="color: var(--ivory); font-size: 2rem; margin-top: 4rem; margin-bottom: 1rem; border-bottom: 2px solid var(--border-color); padding-bottom: 1rem;">${i.title.toUpperCase()} (Database: ${i.name})</h2>
                <div style="overflow-x: auto;">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Institution</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${e}
                    </tbody>
                  </table>
                </div>
                `}}let i=document.getElementById(`tables-container`),a=document.getElementById(`stats`);a.innerHTML=`
          <div class="stat-card" style="grid-column: 1 / -1;">
            <div class="stat-num brutal-text">${n.length}</div>
            <div class="mono-text text-dim">Total Entries Across All Databases</div>
          </div>
        `,r===``&&(r=`<p class="mono-text text-dim" style="text-align: center; margin-top: 4rem;">No entries found in any database collection.</p>`),i.innerHTML=r}catch(e){console.error(e),document.getElementById(`tables-container`).innerHTML=`<p style="text-align:center; color: red;">ERROR: COULD NOT CONNECT TO BACKEND DATABASE.</p>`}}t(),setInterval(t,5e3);