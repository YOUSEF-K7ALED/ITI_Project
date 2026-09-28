const API=location.protocol==='file:'?'http://localhost:5000/api':'/api';
const $=s=>document.querySelector(s),app=$('#app');
let user=JSON.parse(localStorage.user||'null'),token=localStorage.token||'';
const CATS=['Concert','Workshop','Course','Sports Event','Conference','Arts Event'];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fd=d=>new Date(d).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
function toast(m){const t=$('#toast');t.textContent=m;t.className='on';setTimeout(()=>t.className='',2600)}
async function api(p,o={}){
  const r=await fetch(API+p,{method:o.method||'GET',headers:{'Content-Type':'application/json',...(token&&{Authorization:'Bearer '+token})},body:o.body?JSON.stringify(o.body):undefined});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||d.success===false){if(r.status===401&&token)logout(true);throw Error(d.message||'Request failed')}
  return d}
const save=d=>{token=d.token;user=d.user;localStorage.token=token;localStorage.user=JSON.stringify(user)};
function logout(x){token='';user=null;localStorage.clear();nav();location.hash='#/login';if(x)toast('Session expired')}
function nav(){$('#nav').innerHTML='<a href="#/">Events</a>'+(user?`${user.role==='admin'?'<a href="#/admin">Admin</a>':''}<a href="#/bookings">My Bookings</a><a href="#/profile">${esc(user.name)}</a><a href="#" id="lo">Logout</a>`:'<a href="#/login">Login</a><a class="btn" href="#/register">Sign up</a>');
  if(user)$('#lo').onclick=e=>{e.preventDefault();logout()}}
const guard=(admin)=>!user?(location.hash='#/login',1):admin&&user.role!=='admin'?(location.hash='#/',1):0;
const go=async fn=>{try{await fn()}catch(e){toast(e.message)}};

/* ---------- Events ---------- */
const evCard=e=>`<div class="card"><span class="tag">${esc(e.category)}</span><h3>${esc(e.title)}</h3><div class="m">📅 ${fd(e.date)} ${esc(e.time)}<br>📍 ${esc(e.location)}</div><div class="price">${e.price?e.price+' EGP':'Free'}</div><div class="m">${e.availableSeats} seats left</div><a class="btn" href="#/event/${e._id}">Details</a></div>`;
async function events(q){
  const f=new URLSearchParams(q);
  app.innerHTML=`<h1>Discover Events</h1><form class="filters" id="f"><input name="search" placeholder="Search title" value="${esc(f.get('search'))}"><select name="category"><option value="">All categories</option>${CATS.map(c=>`<option ${f.get('category')==c?'selected':''}>${c}</option>`).join('')}</select><input name="location" placeholder="Location" value="${esc(f.get('location'))}"><input name="maxPrice" type="number" min="0" placeholder="Max price" value="${esc(f.get('maxPrice'))}"><input name="date" type="date" value="${esc(f.get('date'))}"><button class="btn">Filter</button></form><div id="l" class="grid"></div><div id="p" class="pg"></div>`;
  $('#f').onsubmit=e=>{e.preventDefault();const p=new URLSearchParams([...new FormData(e.target)].filter(x=>x[1]));location.hash='#/?'+p};
  await go(async()=>{f.set('limit',9);const r=await api('/events?'+f),pg=+f.get('page')||1;
    $('#l').innerHTML=r.data.map(evCard).join('')||'<p class="m">No events found.</p>';
    const nx=n=>{f.delete('limit');f.set('page',n);return '#/?'+f};
    $('#p').innerHTML=r.pagination.pages>1?`${pg>1?`<a class="btn s" href="${nx(pg-1)}">←</a>`:''}<span>${pg} / ${r.pagination.pages}</span>${pg<r.pagination.pages?`<a class="btn s" href="${nx(pg+1)}">→</a>`:''}`:''})}
async function eventPage(id){
  await go(async()=>{const e=(await api('/events/'+id)).data;
    app.innerHTML=`<div class="box"><span class="tag">${esc(e.category)}</span><h1>${esc(e.title)}</h1><p>${esc(e.description)}</p><p class="m">📅 ${fd(e.date)} ${esc(e.time)} · 📍 ${esc(e.location)}</p><p class="price">${e.price?e.price+' EGP':'Free'}</p><p class="m">${e.availableSeats} of ${e.capacity} seats available</p><br><button class="btn" id="bk" ${e.availableSeats<1?'disabled':''}>${e.availableSeats<1?'Sold out':'Book now'}</button> <a class="btn s" href="#/">Back</a></div>`;
    $('#bk').onclick=()=>{if(!user)return location.hash='#/login';go(async()=>{const r=await api('/bookings',{method:'POST',body:{eventId:id}});
      if(!r.booking)return toast(r.message);toast('Booked!');location.hash='#/bookings'})}})}

/* ---------- Auth ---------- */
function authPage(reg){
  app.innerHTML=`<form class="box" id="a"><h2>${reg?'Create account':'Login'}</h2>${reg?'<input name="name" placeholder="Name" required>':''}<input name="email" type="email" placeholder="Email" required><input name="password" type="password" placeholder="Password" minlength="6" required><button class="btn">${reg?'Sign up':'Login'}</button><a href="#/${reg?'login':'register'}" class="m">${reg?'Have an account? Login':'No account? Sign up'}</a></form>`;
  $('#a').onsubmit=e=>{e.preventDefault();go(async()=>{save(await api('/auth/'+(reg?'register':'login'),{method:'POST',body:Object.fromEntries(new FormData(e.target))}));nav();location.hash='#/'})}}

/* ---------- Bookings ---------- */
async function bookings(){
  if(guard())return;
  await go(async()=>{const b=await api('/bookings/my-bookings');if(!Array.isArray(b))throw Error(b.message);
    app.innerHTML='<h1>My Bookings</h1>'+(b.length?`<div class="ov"><table><tr><th>Event</th><th>Date</th><th>Location</th><th>Status</th><th></th></tr>${b.map(x=>`<tr><td>${x.event?`<a href="#/event/${x.event._id}">${esc(x.event.title)}</a>`:'(deleted)'}</td><td>${x.event?fd(x.event.date):''}</td><td>${esc(x.event?.location)}</td><td><span class="st ${x.status}">${x.status}</span></td><td>${x.status=='confirmed'?`<button class="btn d" data-id="${x._id}">Cancel</button>`:''}</td></tr>`).join('')}</table></div>`:'<p class="m">No bookings yet.</p>');
    app.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>confirm('Cancel this booking?')&&go(async()=>{await api(`/bookings/${b.dataset.id}/cancel`,{method:'PATCH'});toast('Cancelled');bookings()}))})}

/* ---------- Profile ---------- */
async function profile(){
  if(guard())return;
  app.innerHTML=`<h1 style="text-align:center">Profile</h1><form class="box" id="pf"><h3>Info</h3><input name="name" value="${esc(user.name)}" required><input name="email" type="email" value="${esc(user.email)}" required><button class="btn">Save</button></form><br><form class="box" id="pw"><h3>Change password</h3><input name="currentPassword" type="password" placeholder="Current" required><input name="newPassword" type="password" placeholder="New" minlength="6" required><button class="btn">Update</button></form><br><form class="box" id="dl"><h3>Delete account</h3><input name="password" type="password" placeholder="Password" required><button class="btn d">Delete</button></form>`;
  const sub=(id,fn)=>$(id).onsubmit=e=>{e.preventDefault();go(()=>fn(Object.fromEntries(new FormData(e.target)),e.target))};
  sub('#pf',async d=>{const r=await api('/profile',{method:'PUT',body:d});user=r.user;localStorage.user=JSON.stringify(user);nav();toast('Saved')});
  sub('#pw',async(d,f)=>{await api('/profile/change-password',{method:'PUT',body:d});f.reset();toast('Password updated')});
  sub('#dl',async d=>{if(!confirm('Delete your account permanently?'))return;await api('/profile',{method:'DELETE',body:d});logout()})}

/* ---------- Admin ---------- */
const tabs=['stats','users','bookings','events'];
async function admin(t='stats'){
  if(guard(1))return;
  app.innerHTML=`<h1>Admin</h1><div class="tabs">${tabs.map(x=>`<a class="btn s ${x==t?'on':''}" href="#/admin/${x}">${x}</a>`).join('')}</div><div id="t"></div>`;
  const T=$('#t');
  await go(async()=>{
    if(t=='stats'){const s=(await api('/admin/stats')).stats;T.innerHTML='<div class="stats">'+Object.entries(s).map(([k,v])=>`<div class="box"><b>${v}</b>${k.replace('Count',' ').replace(/([A-Z])/g,' $1')}</div>`).join('')+'</div>'}
    if(t=='users'){const u=(await api('/admin/users?limit=100')).users;
      T.innerHTML=`<div class="ov"><table><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr>${u.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.email)}</td><td>${x.role}</td><td>${x.isBlocked?'Blocked':'Active'}</td><td>${x.role=='admin'?'':`${x.isBlocked?'':`<button class="btn s" data-b="${x._id}">Block</button> `}<button class="btn d" data-d="${x._id}">Delete</button>`}</td></tr>`).join('')}</table></div>`;
      T.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>go(async()=>{await api(`/admin/users/${b.dataset.b}/block`,{method:'PUT'});toast('Blocked');admin(t)}));
      T.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>confirm('Delete user?')&&go(async()=>{await api('/admin/users/'+b.dataset.d,{method:'DELETE'});toast('Deleted');admin(t)}))}
    if(t=='bookings'){const b=(await api('/admin/bookings?limit=100')).bookings;
      T.innerHTML=`<div class="ov"><table><tr><th>User</th><th>Event</th><th>Date</th><th>Status</th></tr>${b.map(x=>`<tr><td>${esc(x.user?.name)}<br><span class="m">${esc(x.user?.email)}</span></td><td>${esc(x.event?.title)}</td><td>${fd(x.bookingDate)}</td><td><span class="st ${x.status}">${x.status}</span></td></tr>`).join('')}</table></div>`}
    if(t=='events')await adminEvents(T)})}
async function adminEvents(T,ed){
  const list=(await api('/events?limit=100')).data,e=ed||{};
  const i=(n,l,ty='text',x='')=>`<label class="m">${l}<input name="${n}" type="${ty}" value="${esc(e[n])}" required ${x}></label>`;
  T.innerHTML=`<form class="box wide" id="ef"><h3>${e._id?'Edit':'New'} event</h3><div class="filters">${i('title','Title')}<label class="m">Category<select name="category">${CATS.map(c=>`<option ${e.category==c?'selected':''}>${c}</option>`).join('')}</select></label>${i('location','Location')}${i('date','Date','date')}${i('time','Time','text','placeholder="7:00 PM"')}${i('price','Price','number','min=0')}${i('capacity','Capacity','number','min=1')}</div><textarea name="description" placeholder="Description" required>${esc(e.description)}</textarea><div><button class="btn">Save</button> ${e._id?'<button type="button" class="btn s" id="cx">Cancel</button>':''}</div></form><br><div class="ov"><table><tr><th>Title</th><th>Date</th><th>Booked</th><th></th></tr>${list.map(x=>`<tr><td>${esc(x.title)}</td><td>${fd(x.date)}</td><td>${x.bookedSeats}/${x.capacity}</td><td><button class="btn s" data-e="${x._id}">Edit</button> <button class="btn d" data-x="${x._id}">Delete</button></td></tr>`).join('')}</table></div>`;
  if(e.date)T.querySelector('[name=date]').value=String(e.date).slice(0,10);
  if(e._id)$('#cx').onclick=()=>adminEvents(T);
  $('#ef').onsubmit=ev=>{ev.preventDefault();go(async()=>{const d=Object.fromEntries(new FormData(ev.target));d.price=+d.price;d.capacity=+d.capacity;
    await api('/events'+(e._id?'/'+e._id:''),{method:e._id?'PUT':'POST',body:d});toast('Saved');adminEvents(T)})};
  T.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{adminEvents(T,list.find(x=>x._id==b.dataset.e));scrollTo(0,0)});
  T.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>confirm('Delete event?')&&go(async()=>{await api('/events/'+b.dataset.x,{method:'DELETE'});toast('Deleted');adminEvents(T)}))}

/* ---------- Router ---------- */
function route(){
  const [p,q]=(location.hash.slice(1)||'/').split('?'),s=p.split('/').filter(Boolean);
  scrollTo(0,0);nav();
  if(!s.length)events(q);
  else if(s[0]=='event')eventPage(s[1]);
  else if(s[0]=='login')authPage(0);
  else if(s[0]=='register')authPage(1);
  else if(s[0]=='bookings')bookings();
  else if(s[0]=='profile')profile();
  else if(s[0]=='admin')admin(s[1]);
  else app.innerHTML='<h1>404</h1>'}
addEventListener('hashchange',route);route();
