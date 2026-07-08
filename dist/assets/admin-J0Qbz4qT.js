import"./modulepreload-polyfill-Dezn_h7o.js";/* empty css              */import{n as e,t}from"./firebase-db-BsdMy0SF.js";async function n(){if(!localStorage.getItem(`caelys_admin_token`)){window.location.href=`/login.html`;return}try{let n=await t(),r=await e();n.push(...r);let i=document.getElementById(`table-body`),a=document.getElementById(`stats`),o=n.length,s={};n.forEach(e=>{s[e.vertical]=(s[e.vertical]||0)+1});let c=`
          <div class="stat-card">
            <div class="stat-num brutal-text">${o}</div>
            <div class="mono-text text-dim">Total Tickets</div>
          </div>
        `;for(let[e,t]of Object.entries(s))c+=`
            <div class="stat-card">
              <div class="stat-num brutal-text" style="color: var(--ivory); font-size: 3rem;">${t}</div>
              <div class="mono-text text-dim">${e}</div>
            </div>
          `;a.innerHTML=c,i.innerHTML=n.reverse().map(e=>`
          <tr>
            <td style="color: var(--accent-color); font-size: 0.8rem;">#${e.id.slice(-6)}</td>
            <td><strong>${e.name}</strong></td>
            <td>${e.email}</td>
            <td>${e.phone||`N/A`}</td>
            <td>${e.institution}</td>
            <td><span class="badge">${e.vertical}</span></td>
            <td style="font-size: 0.8rem; color: var(--pale-blue);">${e.timestamp?e.timestamp.toDate().toLocaleString():`Just now`}</td>
          </tr>
        `).join(``)}catch(e){console.error(e),document.getElementById(`table-body`).innerHTML=`<tr><td colspan="6" style="text-align:center; color: red;">ERROR: COULD NOT CONNECT TO BACKEND DATABASE. IS SERVER.CJS RUNNING?</td></tr>`}}n(),setInterval(n,5e3);