import"./modulepreload-polyfill-Dezn_h7o.js";/* empty css              */import{n as e,r as t}from"./firebase-db-V32IiDTQ.js";async function n(){if(!localStorage.getItem(`caelys_admin_token`)){window.location.href=`/login.html`;return}try{let n=await e(),r=await t(),i=[...n,...r],a=document.getElementById(`tables-container`),o=document.getElementById(`stats`),s=i.length,c={};i.forEach(e=>{c[e.vertical]=(c[e.vertical]||0)+1});let l=`
          <div class="stat-card">
            <div class="stat-num brutal-text">${s}</div>
            <div class="mono-text text-dim">Total Entries</div>
          </div>
        `;for(let[e,t]of Object.entries(c))l+=`
            <div class="stat-card">
              <div class="stat-num brutal-text" style="color: var(--ivory); font-size: 3rem;">${t}</div>
              <div class="mono-text text-dim">${e}</div>
            </div>
          `;o.innerHTML=l;let u=[`Model United Nations`,`Debate & Rhetoric`,`Climate Conclave`],d=(e,t)=>{if(t.length===0)return``;let n=t.reverse().map(e=>`
              <tr>
                <td style="color: var(--accent-color); font-size: 0.8rem;">#${e.id.slice(-6)}</td>
                <td><strong>${e.name}</strong></td>
                <td>${e.email}</td>
                <td>${e.phone||`N/A`}</td>
                <td>${e.institution}</td>
                <td style="font-size: 0.8rem; color: var(--pale-blue);">${e.timestamp?e.timestamp.toDate().toLocaleString():`Just now`}</td>
              </tr>
            `).join(``);return`
            <h2 class="display-large brutal-text" style="color: var(--ivory); font-size: 2rem; margin-top: 4rem; margin-bottom: 1rem; border-bottom: 2px solid var(--border-color); padding-bottom: 1rem;">${e.toUpperCase()}</h2>
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
                  ${n}
                </tbody>
              </table>
            </div>
            `},f=``;u.forEach(e=>{let t=n.filter(t=>t.vertical===e);f+=d(`Delegate Registrations - ${e}`,t)}),u.forEach(e=>{let t=r.filter(t=>t.vertical===e);f+=d(`Team Applications - ${e}`,t)}),f===``&&(f=`<p class="mono-text text-dim" style="text-align: center; margin-top: 4rem;">No entries found in the database.</p>`),a.innerHTML=f}catch(e){console.error(e),document.getElementById(`tables-container`).innerHTML=`<p style="text-align:center; color: red;">ERROR: COULD NOT CONNECT TO BACKEND DATABASE.</p>`}}n(),setInterval(n,5e3);