const STORAGE="taskflow_complete_v1";
const uid=(p="id")=>p+"_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,7);
const today=()=>new Date().toISOString().slice(0,10);
const addDays=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const ago=n=>new Date(Date.now()-n*86400000).toISOString();
const initials=name=>(name||"??").split(/\s+/).filter(Boolean).slice(0,2).map(v=>v[0]).join("").toUpperCase();
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const fmt=d=>d?new Intl.DateTimeFormat("fr-FR",{day:"2-digit",month:"short"}).format(new Date(d+"T12:00:00")):"—";
const relative=iso=>{const m=(Date.now()-new Date(iso).getTime())/60000;if(m<1)return"à l'instant";if(m<60)return`il y a ${Math.round(m)} min`;if(m<1440)return`il y a ${Math.round(m/60)} h`;return`il y a ${Math.round(m/1440)} j`};

const seed={
 users:[
  {id:"u1",name:"Antony Christ",email:"admin@taskflow.local",password:"admin123",role:"Administrateur",department:"Direction"},
  {id:"u2",name:"Amina Mbala",email:"amina@taskflow.local",password:"123456",role:"Membre",department:"Marketing"},
  {id:"u3",name:"Marc Kouassi",email:"marc@taskflow.local",password:"123456",role:"Membre",department:"Développement"},
  {id:"u4",name:"Sarah Nsimba",email:"sarah@taskflow.local",password:"123456",role:"Membre",department:"Finance"},
  {id:"u5",name:"Joël Moukoko",email:"joel@taskflow.local",password:"123456",role:"Membre",department:"Design"}
 ],
 projects:[
  {id:"p1",name:"Lancement produit",description:"Préparation et lancement de la nouvelle offre.",created:ago(18)},
  {id:"p2",name:"Site web corporate",description:"Refonte du site vitrine et optimisation mobile.",created:ago(30)},
  {id:"p3",name:"Campagne marketing",description:"Campagne digitale du prochain trimestre.",created:ago(12)}
 ],
 tasks:[
  {id:"t1",title:"Préparer le brief client",description:"Réunir les besoins et préparer le document de cadrage.",assignee:"u2",project:"p1",priority:"urgent",status:"todo",due:addDays(1),created:ago(3),comments:[],files:[]},
  {id:"t2",title:"Valider les visuels",description:"Validation finale des maquettes avant publication.",assignee:"u5",project:"p1",priority:"high",status:"todo",due:addDays(4),created:ago(5),comments:[],files:[]},
  {id:"t3",title:"Développer la page d'accueil",description:"Intégrer la nouvelle homepage responsive.",assignee:"u3",project:"p2",priority:"normal",status:"progress",due:today(),created:ago(7),comments:[],files:[]},
  {id:"t4",title:"Rédiger les textes campagne",description:"Produire les textes pour les différents supports.",assignee:"u2",project:"p3",priority:"normal",status:"progress",due:addDays(3),created:ago(4),comments:[],files:[]},
  {id:"t5",title:"Planning équipe",description:"Construire le planning des intervenants.",assignee:"u1",project:"p1",priority:"low",status:"done",due:addDays(-2),created:ago(10),comments:[],files:[]},
  {id:"t6",title:"Budget prévisionnel",description:"Consolider les coûts du projet.",assignee:"u4",project:"p3",priority:"high",status:"done",due:addDays(-1),created:ago(9),comments:[],files:[]},
  {id:"t7",title:"Validation juridique",description:"Attendre le retour sur les documents contractuels.",assignee:"u4",project:"p1",priority:"high",status:"wait",due:addDays(2),created:ago(2),comments:[],files:[]},
  {id:"t8",title:"Configurer analytics",description:"Installer les événements de suivi.",assignee:"u3",project:"p2",priority:"normal",status:"done",due:addDays(-4),created:ago(14),comments:[],files:[]},
  {id:"t9",title:"Créer les réseaux sociaux",description:"Préparer les profils de la nouvelle marque.",assignee:"u2",project:"p3",priority:"low",status:"todo",due:addDays(7),created:ago(1),comments:[],files:[]}
 ],
 notifications:[
  {id:uid("n"),text:"Bienvenue dans TaskFlow. Votre espace est prêt.",time:ago(0),read:false},
  {id:uid("n"),text:"Joël a terminé « Planning équipe ».",time:ago(1),read:false},
  {id:uid("n"),text:"La tâche « Développer la page d'accueil » est à échéance aujourd'hui.",time:ago(0),read:false}
 ],
 settings:{email:true,deadlines:true,compact:false},
 currentUser:null
};
let state=JSON.parse(localStorage.getItem(STORAGE)||"null")||seed;
const save=()=>localStorage.setItem(STORAGE,JSON.stringify(state));
const me=()=>state.users.find(u=>u.id===state.currentUser);
const user=id=>state.users.find(u=>u.id===id);
const project=id=>state.projects.find(p=>p.id===id);
const statusName=s=>({todo:"À faire",progress:"En cours",wait:"En attente",done:"Terminé"})[s]||s;
const priorityName=p=>({low:"Faible",normal:"Normale",high:"Haute",urgent:"Urgente"})[p]||p;
const overdue=t=>t.due&&t.due<today()&&t.status!=="done";
const pageNames={dashboard:"Tableau de bord",tasks:"Tâches",projects:"Projets",calendar:"Calendrier",team:"Équipe",reports:"Rapports",notifications:"Notifications",settings:"Paramètres"};

const landing=document.getElementById("landing-view"), auth=document.getElementById("auth-view"), app=document.getElementById("app-view");
let currentAppPage="dashboard", calDate=new Date();

function toast(msg,error=false){const x=document.createElement("div");x.className="toast"+(error?" error":"");x.textContent=msg;document.getElementById("toast-area").appendChild(x);setTimeout(()=>x.remove(),2800)}
function showView(view){landing.classList.add("hidden");auth.classList.add("hidden");app.classList.add("hidden");view.classList.remove("hidden");window.scrollTo(0,0)}
function openAuth(){showView(auth)}
function openApp(){if(!state.currentUser){openAuth()}else{showView(app);renderApp()}}
function backHome(){showView(landing);history.replaceState(null,"","#accueil")}
document.querySelectorAll("[data-open-app]").forEach(b=>b.addEventListener("click",openApp));
document.querySelectorAll("[data-open-auth]").forEach(b=>b.addEventListener("click",openAuth));
document.querySelectorAll("[data-back-home]").forEach(b=>b.addEventListener("click",backHome));

document.getElementById("public-menu-btn").onclick=()=>{const h=document.querySelector(".public-header");const is=h.classList.toggle("menu-open");document.getElementById("public-menu-btn").setAttribute("aria-expanded",is)};
document.querySelectorAll(".public-nav a").forEach(a=>a.onclick=()=>document.querySelector(".public-header").classList.remove("menu-open"));
document.querySelectorAll(".method-step").forEach(s=>s.onclick=()=>{document.querySelectorAll(".method-step").forEach(x=>x.classList.remove("active"));s.classList.add("active")});

document.querySelectorAll("[data-auth-tab]").forEach(tab=>tab.onclick=()=>{
 document.querySelectorAll("[data-auth-tab]").forEach(x=>x.classList.remove("active"));tab.classList.add("active");
 document.getElementById("login-form").classList.toggle("hidden",tab.dataset.authTab!=="login");
 document.getElementById("register-form").classList.toggle("hidden",tab.dataset.authTab!=="register");
});
document.getElementById("login-form").onsubmit=e=>{
 e.preventDefault();
 const email=document.getElementById("login-email").value.trim().toLowerCase(),pw=document.getElementById("login-password").value;
 const u=state.users.find(x=>x.email.toLowerCase()===email&&x.password===pw);
 if(!u)return toast("Email ou mot de passe incorrect.",true);
 state.currentUser=u.id;save();openApp();location.hash="dashboard";
};
document.getElementById("register-form").onsubmit=e=>{
 e.preventDefault();const name=document.getElementById("register-name").value.trim(),email=document.getElementById("register-email").value.trim().toLowerCase(),pw=document.getElementById("register-password").value;
 if(state.users.some(x=>x.email.toLowerCase()===email))return toast("Cet email existe déjà.",true);
 const u={id:uid("u"),name,email,password:pw,role:"Membre",department:"Général"};state.users.push(u);state.currentUser=u.id;save();openApp();location.hash="dashboard";toast("Compte créé avec succès");
};

function pillStatus(s){return `<span class="pill status-${s}">${statusName(s)}</span>`}
function pillPriority(p){return `<span class="pill priority-${p}">${priorityName(p)}</span>`}
function personHTML(id){const u=user(id);return u?`<div class="person"><span class="user-avatar">${initials(u.name)}</span>${esc(u.name.split(" ")[0])}</div>`:"—"}

function renderApp(){
 if(!state.currentUser){openAuth();return}
 document.getElementById("app-page-title").textContent=pageNames[currentAppPage];
 document.querySelectorAll("[data-app-page]").forEach(a=>a.classList.toggle("active",a.dataset.appPage===currentAppPage));
 updateSide();
 const pages={dashboard:dashboard,tasks:tasks,projects:projects,calendar:calendar,team:team,reports:reports,notifications:notifications,settings:settings};
 (pages[currentAppPage]||dashboard)();
}
function updateSide(){
 const u=me();const av=initials(u.name);document.getElementById("side-avatar").textContent=av;document.getElementById("top-avatar").textContent=av;
 document.getElementById("side-user-name").textContent=u.name;document.getElementById("top-name").textContent=u.name.split(" ")[0];document.getElementById("side-user-role").textContent=u.role;
 const active=state.tasks.filter(t=>t.status!=="done"&&t.assignee===u.id).length,unread=state.notifications.filter(n=>!n.read).length;
 document.getElementById("nav-active-tasks").textContent=active||"";document.getElementById("nav-unread").textContent=unread||"";document.getElementById("notify-dot").style.display=unread?"block":"none";
}
document.querySelectorAll("[data-app-page]").forEach(a=>a.onclick=e=>{e.preventDefault();currentAppPage=a.dataset.appPage;renderApp();document.getElementById("app-sidebar").classList.remove("open")});
document.getElementById("open-side").onclick=()=>document.getElementById("app-sidebar").classList.add("open");
document.getElementById("close-side").onclick=()=>document.getElementById("app-sidebar").classList.remove("open");
document.getElementById("new-task-top").onclick=()=>openTaskForm();
document.querySelectorAll("[data-app-route]").forEach(b=>b.onclick=()=>{currentAppPage=b.dataset.appRoute;renderApp()});
document.getElementById("account-btn").onclick=openProfile;
document.getElementById("top-account").onclick=openProfile;
document.getElementById("help-btn").onclick=guide;
document.getElementById("global-search").onkeydown=e=>{if(e.key==="Enter"&&e.target.value.trim()){currentAppPage="tasks";renderApp();setTimeout(()=>{const x=document.getElementById("task-search");if(x){x.value=e.target.value;x.dispatchEvent(new Event("input"))}},25)}};
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();document.getElementById("global-search").focus()}if(e.key==="Escape")closeModal()});

function appShell(title,subtitle,actions,body){
 return `<section class="app-page"><div class="page-head"><div><p class="eyebrow-app">TASKFLOW</p><h1 class="page-title">${title}</h1><p class="page-subtitle">${subtitle}</p></div><div class="actions">${actions||""}</div></div>${body}</section>`
}
function empty(text){return `<div class="empty"><div class="empty-icon">◌</div>${text}</div>`}
function projectProgress(p){const ts=state.tasks.filter(t=>t.project===p.id);return ts.length?Math.round(ts.filter(t=>t.status==="done").length/ts.length*100):0}
function taskRow(t){
 return `<tr><td><button class="task-link" data-task-id="${t.id}"><span class="task-name">${esc(t.title)}</span><span class="task-meta">${esc(project(t.project)?.name||"Sans projet")}</span></button></td><td>${personHTML(t.assignee)}</td><td>${pillPriority(t.priority)}</td><td>${pillStatus(t.status)}</td><td class="${overdue(t)?"overdue":""}">${fmt(t.due)}</td><td><button class="tiny-btn" data-edit-task="${t.id}">✎</button> <button class="tiny-btn" data-remove-task="${t.id}">×</button></td></tr>`
}
function taskTable(list){if(!list.length)return empty("Aucune tâche trouvée");return `<div class="table-panel"><table class="task-table"><thead><tr><th>Tâche</th><th>Responsable</th><th>Priorité</th><th>Statut</th><th>Échéance</th><th></th></tr></thead><tbody>${list.map(taskRow).join("")}</tbody></table></div>`}

function dashboard(){
 const u=me(),my=state.tasks.filter(t=>t.assignee===u.id),active=my.filter(t=>t.status!=="done"),todayTasks=state.tasks.filter(t=>t.due===today()&&t.status!=="done"),done=state.tasks.filter(t=>t.status==="done"),over=state.tasks.filter(overdue);
 const recent=[...state.notifications].sort((a,b)=>b.time.localeCompare(a.time)).slice(0,5);
 document.getElementById("app-page-content").innerHTML=appShell(`Bonjour, ${esc(u.name.split(" ")[0])} 👋`,"Voici ce qui se passe dans votre espace aujourd'hui.",`<button class="btn btn-dark" data-new-task>＋ Nouvelle tâche</button>`,
 `<div class="grid stats-grid">
  <div class="stat-card"><span class="stat-icon">✓</span><small>Tâches actives</small><div class="stat-value">${active.length}</div><small>${my.filter(t=>t.status==="progress").length} en cours</small></div>
  <div class="stat-card"><span class="stat-icon">◷</span><small>À échéance aujourd'hui</small><div class="stat-value">${todayTasks.length}</div><small>${over.length} en retard équipe</small></div>
  <div class="stat-card"><span class="stat-icon">✓</span><small>Tâches terminées</small><div class="stat-value">${done.length}</div><small>sur ${state.tasks.length}</small></div>
  <div class="stat-card"><span class="stat-icon">♙</span><small>Membres</small><div class="stat-value">${state.users.length}</div><small>${state.projects.length} projets</small></div>
 </div>
 <div class="grid dashboard-grid" style="margin-top:15px">
  <div class="panel"><div class="panel-head"><h2>Tâches récentes</h2><button data-go="tasks">Voir toutes →</button></div>${taskTable([...state.tasks].sort((a,b)=>b.created.localeCompare(a.created)).slice(0,6))}</div>
  <div class="panel"><div class="panel-head"><h2>Activité</h2><button data-go="notifications">Tout voir →</button></div>${recent.map(n=>`<div class="activity"><i>${n.read?"✓":"!"}</i><div><p>${esc(n.text)}</p><small>${relative(n.time)}</small></div></div>`).join("")}</div>
 </div>
 <div class="panel" style="margin-top:15px"><div class="panel-head"><h2>Progression des projets</h2><button data-go="projects">Gérer →</button></div>${state.projects.map(p=>`<div class="project-mini"><div class="project-line"><b>${esc(p.name)}</b><span>${projectProgress(p)}%</span></div><div class="progress"><i style="width:${projectProgress(p)}%"></i></div></div>`).join("")}</div>`);
 bindGlobalAppActions();
}

function tasks(){
 document.getElementById("app-page-content").innerHTML=appShell("Tâches","Créez, attribuez et suivez chaque tâche.",`<button class="btn btn-dark" data-new-task>＋ Nouvelle tâche</button>`,
 `<div class="toolbar"><input class="input search-input" id="task-search" placeholder="⌕ Rechercher..."><select class="select" id="f-status"><option value="">Tous les statuts</option><option value="todo">À faire</option><option value="progress">En cours</option><option value="wait">En attente</option><option value="done">Terminé</option></select><select class="select" id="f-priority"><option value="">Toutes priorités</option><option value="low">Faible</option><option value="normal">Normale</option><option value="high">Haute</option><option value="urgent">Urgente</option></select><select class="select" id="f-project"><option value="">Tous les projets</option>${state.projects.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select><button class="btn btn-dark" id="kanban-toggle">Vue Kanban</button></div><div id="task-results" class="panel">${taskTable(state.tasks)}</div>`);
 const filter=()=>{const q=(document.getElementById("task-search").value||"").toLowerCase(),s=document.getElementById("f-status").value,p=document.getElementById("f-priority").value,pr=document.getElementById("f-project").value;document.getElementById("task-results").innerHTML=taskTable(state.tasks.filter(t=>(!q||t.title.toLowerCase().includes(q)||t.description.toLowerCase().includes(q))&&(!s||t.status===s)&&(!p||t.priority===p)&&(!pr||t.project===pr)));bindTaskButtons()};
 ["task-search","f-status","f-priority","f-project"].forEach(id=>document.getElementById(id).addEventListener("input",filter));bindTaskButtons();
 document.getElementById("kanban-toggle").onclick=()=>renderKanban();
}
function bindTaskButtons(){
 document.querySelectorAll("[data-task-id]").forEach(x=>x.onclick=()=>openTask(x.dataset.taskId));
 document.querySelectorAll("[data-edit-task]").forEach(x=>x.onclick=()=>openTaskForm(x.dataset.editTask));
 document.querySelectorAll("[data-remove-task]").forEach(x=>x.onclick=()=>removeTask(x.dataset.removeTask));
}
function renderKanban(){
 document.getElementById("task-results").className="kanban";
 document.getElementById("task-results").innerHTML=["todo","progress","wait","done"].map(s=>`<div class="kanban-col" data-drop="${s}"><div class="kanban-head"><b>${statusName(s)}</b><span>${state.tasks.filter(t=>t.status===s).length}</span></div><div class="kanban-list">${state.tasks.filter(t=>t.status===s).map(t=>`<article class="kanban-card" draggable="true" data-drag="${t.id}">${pillPriority(t.priority)}<h4>${esc(t.title)}</h4><p>${esc(t.description.slice(0,78))}</p><div class="kanban-foot">${personHTML(t.assignee)}<span class="due ${overdue(t)?"overdue":""}">${fmt(t.due)}</span></div></article>`).join("")}</div></div>`).join("");
 const toggle=document.getElementById("kanban-toggle");toggle.textContent="Vue liste";toggle.onclick=()=>tasks();
 document.querySelectorAll("[data-drag]").forEach(c=>{c.onclick=()=>openTask(c.dataset.drag);c.ondragstart=e=>{e.dataTransfer.setData("task",c.dataset.drag);c.classList.add("dragging")};c.ondragend=()=>c.classList.remove("dragging")});
 document.querySelectorAll("[data-drop]").forEach(col=>{col.ondragover=e=>e.preventDefault();col.ondrop=e=>{e.preventDefault();const t=state.tasks.find(x=>x.id===e.dataTransfer.getData("task"));if(t){t.status=col.dataset.drop;save();addNotification(`« ${t.title} » est maintenant ${statusName(t.status)}.`,false);renderKanban();updateSide();toast("Statut mis à jour")}}});
}

function projects(){
 document.getElementById("app-page-content").innerHTML=appShell("Projets","Centralisez les objectifs et la progression de vos équipes.",`<button class="btn btn-dark" data-new-project>＋ Nouveau projet</button>`,
 `<div class="cards-grid">${state.projects.map(p=>`<article class="project-card"><div style="display:flex;justify-content:space-between"><span class="project-symbol">▱</span><button class="tiny-btn" data-edit-project="${p.id}">✎</button></div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="project-line"><b>${projectProgress(p)}%</b><span>${state.tasks.filter(t=>t.project===p.id).length} tâches</span></div><div class="progress"><i style="width:${projectProgress(p)}%"></i></div></article>`).join("")}</div>`);
 document.querySelectorAll("[data-edit-project]").forEach(x=>x.onclick=()=>openProjectForm(x.dataset.editProject));bindGlobalAppActions();
}
function team(){
 document.getElementById("app-page-content").innerHTML=appShell("Équipe","Gérez les membres, rôles et responsabilités.",`<button class="btn btn-dark" data-new-user>＋ Inviter un membre</button>`,
 `<div class="cards-grid">${state.users.map(u=>`<article class="member-card" style="display:flex;align-items:center;gap:12px"><span class="user-avatar" style="width:44px;height:44px">${initials(u.name)}</span><div style="flex:1"><h3>${esc(u.name)}</h3><p>${esc(u.role)} · ${esc(u.department)}</p><small>${state.tasks.filter(t=>t.assignee===u.id&&t.status!=="done").length} tâches actives</small></div><button class="tiny-btn" data-member="${u.id}">→</button></article>`).join("")}</div>`);
 document.querySelectorAll("[data-member]").forEach(x=>x.onclick=()=>openMember(x.dataset.member));bindGlobalAppActions();
}
function calendar(){
 const y=calDate.getFullYear(),m=calDate.getMonth(),first=new Date(y,m,1),start=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate(),prev=new Date(y,m,0).getDate();let cells="";
 for(let i=0;i<42;i++){const n=i-start+1;let d,other=false;if(n<1){d=new Date(y,m-1,prev+n);other=true}else if(n>days){d=new Date(y,m+1,n-days);other=true}else d=new Date(y,m,n);const iso=d.toISOString().slice(0,10),events=state.tasks.filter(t=>t.due===iso);cells+=`<div class="day ${other?"other":""} ${iso===today()?"today":""}"><div class="day-number">${d.getDate()}</div>${events.slice(0,3).map(t=>`<div class="event ${t.priority==="urgent"?"urgent":t.priority==="normal"?"blue":""}" data-cal-task="${t.id}">${esc(t.title)}</div>`).join("")}</div>`}
 const title=new Intl.DateTimeFormat("fr-FR",{month:"long",year:"numeric"}).format(calDate);document.getElementById("app-page-content").innerHTML=appShell("Calendrier","Visualisez toutes les échéances.",`<button class="btn btn-dark" data-new-task>＋ Nouvelle tâche</button>`,
 `<div class="calendar"><div class="calendar-head"><h2>${title.charAt(0).toUpperCase()+title.slice(1)}</h2><div class="calendar-buttons"><button id="cal-prev">←</button><button id="cal-now">Aujourd'hui</button><button id="cal-next">→</button></div></div><div class="calendar-grid">${["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map(x=>`<div class="weekday">${x}</div>`).join("")}${cells}</div></div>`);
 document.getElementById("cal-prev").onclick=()=>{calDate.setMonth(calDate.getMonth()-1);calendar()};document.getElementById("cal-next").onclick=()=>{calDate.setMonth(calDate.getMonth()+1);calendar()};document.getElementById("cal-now").onclick=()=>{calDate=new Date();calendar()};document.querySelectorAll("[data-cal-task]").forEach(x=>x.onclick=()=>openTask(x.dataset.calTask));bindGlobalAppActions();
}

function reports(){
 const total=state.tasks.length,done=state.tasks.filter(t=>t.status==="done").length,rate=total?Math.round(done/total*100):0;const months=[];
 for(let i=5;i>=0;i--){const d=new Date();d.setMonth(d.getMonth()-i);months.push({m:d.toLocaleDateString("fr-FR",{month:"short"}),n:state.tasks.filter(t=>{const x=new Date(t.created);return x.getMonth()===d.getMonth()&&x.getFullYear()===d.getFullYear()}).length})}
 const max=Math.max(1,...months.map(x=>x.n));
 document.getElementById("app-page-content").innerHTML=appShell("Rapports","Mesurez la productivité et la santé des projets.",`<button class="btn btn-dark" id="export-csv">Exporter CSV</button>`,
 `<div class="grid stats-grid"><div class="stat-card"><small>Taux de complétion</small><div class="stat-value">${rate}%</div><small>${done} tâches terminées</small></div><div class="stat-card"><small>Tâches en retard</small><div class="stat-value">${state.tasks.filter(overdue).length}</div><small>À traiter</small></div><div class="stat-card"><small>Tâches urgentes</small><div class="stat-value">${state.tasks.filter(t=>t.priority==="urgent"&&t.status!=="done").length}</div><small>Actives</small></div><div class="stat-card"><small>Projets</small><div class="stat-value">${state.projects.length}</div><small>En suivi</small></div></div>
 <div class="grid reports" style="margin-top:15px"><div class="panel chart"><div class="panel-head"><h2>Création des tâches</h2></div><div class="bars">${months.map(x=>`<div class="bar-col"><b>${x.n}</b><i style="height:${Math.max(4,x.n/max*170)}px"></i><small>${x.m}</small></div>`).join("")}</div></div><div class="panel chart"><div class="panel-head"><h2>Répartition des statuts</h2></div><div class="donut-wrap"><div class="donut"></div><div class="legend"><span><i class="dot" style="background:var(--forest)"></i>Terminées ${state.tasks.filter(t=>t.status==="done").length}</span><span><i class="dot" style="background:var(--orange)"></i>En cours ${state.tasks.filter(t=>t.status==="progress").length}</span><span><i class="dot" style="background:#b5c1b4"></i>À faire ${state.tasks.filter(t=>t.status==="todo").length}</span><span><i class="dot" style="background:#deddd5"></i>En attente ${state.tasks.filter(t=>t.status==="wait").length}</span></div></div></div></div>
 <div class="panel" style="margin-top:15px"><div class="panel-head"><h2>Productivité par membre</h2></div>${state.users.map(u=>{const a=state.tasks.filter(t=>t.assignee===u.id),d=a.filter(t=>t.status==="done").length,p=a.length?Math.round(d/a.length*100):0;return `<div class="project-mini"><div class="project-line">${personHTML(u.id)}<b>${p}%</b></div><div class="progress"><i style="width:${p}%"></i></div></div>`}).join("")}</div>`);
 document.getElementById("export-csv").onclick=exportCSV;
}
function exportCSV(){
 const rows=[["Tâche","Projet","Responsable","Priorité","Statut","Echéance"],...state.tasks.map(t=>[t.title,project(t.project)?.name||"",user(t.assignee)?.name||"",priorityName(t.priority),statusName(t.status),t.due])];
 const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(";")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv"}));a.download="taskflow-rapport.csv";a.click();URL.revokeObjectURL(a.href);toast("Rapport CSV exporté");
}
function notifications(){
 document.getElementById("app-page-content").innerHTML=appShell("Notifications","Restez informé des changements importants.",`<button class="btn btn-dark" id="read-all">Tout marquer comme lu</button>`,
 `<div class="notification-list">${state.notifications.sort((a,b)=>b.time.localeCompare(a.time)).map(n=>`<div class="notification ${n.read?"":"unread"}"><span class="ndot" style="${n.read?"background:#d8dad3":""}"></span><div style="flex:1"><p>${esc(n.text)}</p><small>${relative(n.time)}</small></div>${!n.read?`<button class="tiny-btn" data-read-notif="${n.id}">✓</button>`:""}</div>`).join("")||empty("Aucune notification")}</div>`);
 document.getElementById("read-all").onclick=()=>{state.notifications.forEach(n=>n.read=true);save();renderApp();updateSide();toast("Notifications lues")};document.querySelectorAll("[data-read-notif]").forEach(x=>x.onclick=()=>{const n=state.notifications.find(n=>n.id===x.dataset.readNotif);if(n)n.read=true;save();renderApp();updateSide()});
}
function settings(){
 const u=me();document.getElementById("app-page-content").innerHTML=appShell("Paramètres","Personnalisez votre espace TaskFlow.",`<button class="btn btn-dark" id="save-settings">Enregistrer</button>`,
 `<div class="settings-grid"><div class="settings-menu"><button class="active">Général</button><button data-profile>Mon profil</button><button id="reset-data">Réinitialiser les données de démo</button><button id="logout-button">Se déconnecter</button></div><div class="settings-panel"><h3>Préférences</h3><p class="muted" style="font-size:9px">Les réglages et données de cette démo sont sauvegardés dans localStorage.</p>
 <div class="setting-row"><div><b>Notifications</b><small>Afficher les alertes importantes dans TaskFlow.</small></div><button class="toggle ${state.settings.email?"on":""}" data-toggle="email"></button></div>
 <div class="setting-row"><div><b>Alertes d'échéance</b><small>Afficher les rappels avant les dates limites.</small></div><button class="toggle ${state.settings.deadlines?"on":""}" data-toggle="deadlines"></button></div>
 <div class="setting-row"><div><b>Interface compacte</b><small>Préparer une densité visuelle plus forte.</small></div><button class="toggle ${state.settings.compact?"on":""}" data-toggle="compact"></button></div>
 <div class="setting-row"><div><b>Compte</b><small>${esc(u.name)} · ${esc(u.email)} · ${esc(u.role)}</small></div><button class="btn btn-dark" data-profile>Modifier</button></div>
 </div></div>`);
 document.querySelectorAll("[data-toggle]").forEach(x=>x.onclick=()=>{state.settings[x.dataset.toggle]=!state.settings[x.dataset.toggle];save();settings()});document.querySelectorAll("[data-profile]").forEach(x=>x.onclick=openProfile);document.getElementById("save-settings").onclick=()=>toast("Paramètres enregistrés");
 document.getElementById("reset-data").onclick=()=>{if(confirm("Réinitialiser les données de démonstration ?")){localStorage.removeItem(STORAGE);location.reload()}};document.getElementById("logout-button").onclick=()=>{state.currentUser=null;save();openAuth();};
}

function bindGlobalAppActions(){
 document.querySelectorAll("[data-new-task]").forEach(b=>b.onclick=openTaskForm);
 document.querySelectorAll("[data-new-project]").forEach(b=>b.onclick=()=>openProjectForm());
 document.querySelectorAll("[data-new-user]").forEach(b=>b.onclick=openUserForm);
 document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{currentAppPage=b.dataset.go;renderApp()});
}

function openTaskForm(id=null){
 const t=id?state.tasks.find(x=>x.id===id):null;
 openModal(`<p class="eyebrow-app">GESTION DES TÂCHES</p><h2 class="modal-title">${t?"Modifier la tâche":"Nouvelle tâche"}</h2><p class="muted" style="font-size:9px">Responsable, priorité, statut et échéance dans la même fiche.</p>
 <form id="task-form"><div class="form-grid"><div class="form-field full"><label>Titre<input name="title" required value="${esc(t?.title||"")}"></label></div><div class="form-field full"><label>Description<textarea class="textarea" name="description">${esc(t?.description||"")}</textarea></label></div>
 <div class="form-field"><label>Projet<select name="project">${state.projects.map(p=>`<option value="${p.id}" ${t?.project===p.id?"selected":""}>${esc(p.name)}</option>`).join("")}</select></label></div>
 <div class="form-field"><label>Responsable<select name="assignee">${state.users.map(u=>`<option value="${u.id}" ${t?.assignee===u.id?"selected":""}>${esc(u.name)}</option>`).join("")}</select></label></div>
 <div class="form-field"><label>Priorité<select name="priority">${["low","normal","high","urgent"].map(x=>`<option value="${x}" ${t?.priority===x?"selected":""}>${priorityName(x)}</option>`).join("")}</select></label></div>
 <div class="form-field"><label>Statut<select name="status">${["todo","progress","wait","done"].map(x=>`<option value="${x}" ${t?.status===x?"selected":""}>${statusName(x)}</option>`).join("")}</select></label></div>
 <div class="form-field"><label>Date limite<input type="date" name="due" value="${t?.due||addDays(1)}"></label></div>
 <div class="form-field"><label>Pièces jointes<input type="file" id="task-files" multiple></label></div>
 </div><div class="modal-actions"><button type="button" class="btn" style="background:#fff;border:1px solid var(--line)" data-close-modal>Annuler</button><button class="btn btn-dark">${t?"Enregistrer":"Créer la tâche"}</button></div></form>`);
 document.getElementById("task-form").onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target),files=[...document.getElementById("task-files").files].map(f=>({name:f.name,size:f.size,type:f.type}));if(t){Object.assign(t,{title:fd.get("title"),description:fd.get("description"),project:fd.get("project"),assignee:fd.get("assignee"),priority:fd.get("priority"),status:fd.get("status"),due:fd.get("due")});t.files=[...(t.files||[]),...files]}else{state.tasks.unshift({id:uid("t"),title:fd.get("title"),description:fd.get("description"),project:fd.get("project"),assignee:fd.get("assignee"),priority:fd.get("priority"),status:fd.get("status"),due:fd.get("due"),created:ago(0),comments:[],files})}save();addNotification(`${t?"La tâche":"Nouvelle tâche"} « ${fd.get("title")} » ${t?"a été modifiée":"a été créée"}.`,false);closeModal();renderApp();updateSide();toast(t?"Tâche modifiée":"Tâche créée")};
}
function removeTask(id){const t=state.tasks.find(x=>x.id===id);if(!t||!confirm(`Supprimer « ${t.title} » ?`))return;state.tasks=state.tasks.filter(x=>x.id!==id);save();renderApp();updateSide();toast("Tâche supprimée")}
function openTask(id){
 const t=state.tasks.find(x=>x.id===id);if(!t)return;
 openModal(`<div style="display:flex;justify-content:space-between;gap:15px"><div><p class="eyebrow-app">DÉTAIL DE LA TÂCHE</p><h2 class="modal-title">${esc(t.title)}</h2><p class="muted" style="font-size:8px">${esc(project(t.project)?.name||"Sans projet")}</p></div><button class="btn" style="background:#fff;border:1px solid var(--line)" data-edit-detail="${t.id}">✎ Modifier</button></div>
 <div class="detail-meta">${pillStatus(t.status)} ${pillPriority(t.priority)} <span class="pill" style="background:#f0f0eb">Échéance : ${fmt(t.due)}</span></div>
 <div class="detail-box">${esc(t.description||"Aucune description")}</div>
 <div class="comments"><h4 style="font-size:10px">Commentaires (${t.comments?.length||0})</h4>${(t.comments||[]).map(c=>`<div class="comment"><span class="user-avatar">${initials(c.user)}</span><div><p><b>${esc(c.user)}</b> · ${esc(c.text)}</p><small>${relative(c.time)}</small></div></div>`).join("")}<form id="comment-form" class="comment-form"><input class="input" name="comment" required placeholder="Écrire un commentaire..."><button class="btn btn-dark">Envoyer</button></form></div>
 <div style="margin-top:15px"><h4 style="font-size:10px">Fichiers</h4><div class="attachments">${(t.files||[]).map(f=>`<span class="attachment">📎 ${esc(f.name)}</span>`).join("")||'<span class="muted" style="font-size:8px">Aucun fichier joint.</span>'}</div></div>`);
 document.getElementById("comment-form").onsubmit=e=>{e.preventDefault();const text=new FormData(e.target).get("comment");t.comments=t.comments||[];t.comments.push({user:me().name,text,time:ago(0)});save();openTask(id);toast("Commentaire ajouté")};document.querySelector("[data-edit-detail]").onclick=()=>openTaskForm(id);
}
function openProjectForm(id=null){
 const p=id?state.projects.find(x=>x.id===id):null;openModal(`<p class="eyebrow-app">PROJET</p><h2 class="modal-title">${p?"Modifier le projet":"Nouveau projet"}</h2><form id="project-form"><div class="form-field"><label>Nom<input name="name" required value="${esc(p?.name||"")}"></label></div><div class="form-field"><label>Description<textarea class="textarea" name="description">${esc(p?.description||"")}</textarea></label></div><div class="modal-actions"><button type="button" class="btn" style="background:#fff;border:1px solid var(--line)" data-close-modal>Annuler</button><button class="btn btn-dark">${p?"Enregistrer":"Créer le projet"}</button></div></form>`);
 document.getElementById("project-form").onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);if(p)Object.assign(p,{name:fd.get("name"),description:fd.get("description")});else state.projects.push({id:uid("p"),name:fd.get("name"),description:fd.get("description"),created:ago(0)});save();closeModal();renderApp();toast(p?"Projet modifié":"Projet créé")}
}
function openUserForm(){
 openModal(`<p class="eyebrow-app">ÉQUIPE</p><h2 class="modal-title">Inviter un membre</h2><form id="user-form"><div class="form-grid"><div class="form-field"><label>Nom<input name="name" required></label></div><div class="form-field"><label>Email<input name="email" type="email" required></label></div><div class="form-field"><label>Département<input name="department" value="Général"></label></div><div class="form-field"><label>Rôle<select name="role"><option>Membre</option><option>Manager</option></select></label></div></div><div class="modal-actions"><button type="button" class="btn" style="background:#fff;border:1px solid var(--line)" data-close-modal>Annuler</button><button class="btn btn-dark">Ajouter</button></div></form>`);
 document.getElementById("user-form").onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);state.users.push({id:uid("u"),name:fd.get("name"),email:fd.get("email"),password:"123456",role:fd.get("role"),department:fd.get("department")});save();closeModal();renderApp();toast("Membre ajouté")}
}
function openMember(id){const u=user(id),ts=state.tasks.filter(t=>t.assignee===id);openModal(`<div style="display:flex;gap:12px;align-items:center"><span class="user-avatar" style="width:50px;height:50px">${initials(u.name)}</span><div><h2 class="modal-title">${esc(u.name)}</h2><p class="muted" style="font-size:8px">${esc(u.role)} · ${esc(u.department)} · ${esc(u.email)}</p></div></div><div style="margin-top:20px"><h4 style="font-size:10px">Tâches assignées (${ts.length})</h4>${ts.map(t=>`<div class="activity"><i>${t.status==="done"?"✓":"!"}</i><div><p>${esc(t.title)}</p><small>${fmt(t.due)} · ${statusName(t.status)}</small></div></div>`).join("")||empty("Aucune tâche")}</div>`)}
function openProfile(){
 const u=me();openModal(`<p class="eyebrow-app">MON PROFIL</p><h2 class="modal-title">Informations personnelles</h2><form id="profile-form"><div class="form-field"><label>Nom<input name="name" required value="${esc(u.name)}"></label></div><div class="form-field"><label>Email<input name="email" type="email" required value="${esc(u.email)}"></label></div><div class="form-field"><label>Nouveau mot de passe<input name="password" type="password" placeholder="Laisser vide pour conserver"></label></div><div class="modal-actions"><button type="button" class="btn" style="background:#fff;border:1px solid var(--line)" data-close-modal>Annuler</button><button class="btn btn-dark">Enregistrer</button></div></form>`);
 document.getElementById("profile-form").onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);u.name=fd.get("name");u.email=fd.get("email");if(fd.get("password"))u.password=fd.get("password");save();closeModal();renderApp();updateSide();toast("Profil mis à jour")}
}
function guide(){openModal(`<p class="eyebrow-app">GUIDE RAPIDE</p><h2 class="modal-title">Utiliser TaskFlow</h2><div class="detail-box"><b>1. Projets</b><br>Créez un projet pour votre équipe.<br><br><b>2. Tâches</b><br>Créez une tâche et renseignez responsable, priorité, statut et échéance.<br><br><b>3. Kanban</b><br>Depuis Tâches → Vue Kanban, déplacez les cartes avec la souris.<br><br><b>4. Collaboration</b><br>Ouvrez une tâche pour ajouter des commentaires et voir les fichiers.<br><br><b>5. Rapports</b><br>Consultez la progression et exportez vos données en CSV.</div>`)}

function addNotification(text,read=false){state.notifications.unshift({id:uid("n"),text,time:ago(0),read});state.notifications=state.notifications.slice(0,50);save()}
function openModal(html){document.getElementById("modal-content").innerHTML=html;document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
document.addEventListener("click",e=>{
 if(e.target.closest("[data-close-modal]"))closeModal();
 const x=e.target.closest("[data-new-task]");if(x)openTaskForm();
});
document.addEventListener("click",e=>{const id=e.target.closest("[data-task-id]")?.dataset.taskId;if(id)openTask(id)});

document.querySelectorAll("[data-go]").forEach(x=>x.onclick=()=>{currentAppPage=x.dataset.go;renderApp()});

document.querySelectorAll(".public-nav a").forEach(a=>{a.addEventListener("click",()=>{document.querySelectorAll(".public-nav a").forEach(n=>n.classList.remove("active"));a.classList.add("active")})});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
if(location.hash==="#dashboard"||location.hash==="#tasks"||location.hash==="#projects"||location.hash==="#calendar"||location.hash==="#team"||location.hash==="#reports"||location.hash==="#notifications"||location.hash==="#settings"){currentAppPage=location.hash.slice(1);openApp()}else{showView(landing)}
