// const API=location.protocol==='file:'?'http://localhost:5000/api':'/api';
// const $=s=>document.querySelector(s),app=$('#app');
// let user=JSON.parse(localStorage.user||'null'),token=localStorage.token||'';
// const CATS=['Concert','Workshop','Course','Sports Event','Conference','Arts Event'];
// const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// const fd=d=>new Date(d).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
// function toast(m){const t=$('#toast');t.textContent=m;t.className='on';setTimeout(()=>t.className='',2600)}
// async function api(p,o={}){
//   const r=await fetch(API+p,{method:o.method||'GET',headers:{'Content-Type':'application/json',...(token&&{Authorization:'Bearer '+token})},body:o.body?JSON.stringify(o.body):undefined});
//   const d=await r.json().catch(()=>({}));
//   if(!r.ok||d.success===false){if(r.status===401&&token)logout(true);throw Error(d.message||'Request failed')}
//   return d}
// const save=d=>{token=d.token;user=d.user;localStorage.token=token;localStorage.user=JSON.stringify(user)};
// function logout(x){token='';user=null;localStorage.clear();nav();location.hash='#/login';if(x)toast('Session expired')}
// function nav(){$('#nav').innerHTML='<a href="#/">Events</a>'+(user?`${user.role==='admin'?'<a href="#/admin">Admin</a>':''}<a href="#/bookings">My Bookings</a><a href="#/profile">${esc(user.name)}</a><a href="#" id="lo">Logout</a>`:'<a href="#/login">Login</a><a class="btn" href="#/register">Sign up</a>');
//   if(user)$('#lo').onclick=e=>{e.preventDefault();logout()}}
// const guard=(admin)=>!user?(location.hash='#/login',1):admin&&user.role!=='admin'?(location.hash='#/',1):0;
// const go=async fn=>{try{await fn()}catch(e){toast(e.message)}};

// /* ---------- Events ---------- */
// const evCard=e=>`<div class="card"><span class="tag">${esc(e.category)}</span><h3>${esc(e.title)}</h3><div class="m">📅 ${fd(e.date)} ${esc(e.time)}<br>📍 ${esc(e.location)}</div><div class="price">${e.price?e.price+' EGP':'Free'}</div><div class="m">${e.availableSeats} seats left</div><a class="btn" href="#/event/${e._id}">Details</a></div>`;
// async function events(q){
//   const f=new URLSearchParams(q);
//   app.innerHTML=`<h1>Discover Events</h1><form class="filters" id="f"><input name="search" placeholder="Search title" value="${esc(f.get('search'))}"><select name="category"><option value="">All categories</option>${CATS.map(c=>`<option ${f.get('category')==c?'selected':''}>${c}</option>`).join('')}</select><input name="location" placeholder="Location" value="${esc(f.get('location'))}"><input name="maxPrice" type="number" min="0" placeholder="Max price" value="${esc(f.get('maxPrice'))}"><input name="date" type="date" value="${esc(f.get('date'))}"><button class="btn">Filter</button></form><div id="l" class="grid"></div><div id="p" class="pg"></div>`;
//   $('#f').onsubmit=e=>{e.preventDefault();const p=new URLSearchParams([...new FormData(e.target)].filter(x=>x[1]));location.hash='#/?'+p};
//   await go(async()=>{f.set('limit',9);const r=await api('/events?'+f),pg=+f.get('page')||1;
//     $('#l').innerHTML=r.data.map(evCard).join('')||'<p class="m">No events found.</p>';
//     const nx=n=>{f.delete('limit');f.set('page',n);return '#/?'+f};
//     $('#p').innerHTML=r.pagination.pages>1?`${pg>1?`<a class="btn s" href="${nx(pg-1)}">←</a>`:''}<span>${pg} / ${r.pagination.pages}</span>${pg<r.pagination.pages?`<a class="btn s" href="${nx(pg+1)}">→</a>`:''}`:''})}
// async function eventPage(id){
//   await go(async()=>{const e=(await api('/events/'+id)).data;
//     app.innerHTML=`<div class="box"><span class="tag">${esc(e.category)}</span><h1>${esc(e.title)}</h1><p>${esc(e.description)}</p><p class="m">📅 ${fd(e.date)} ${esc(e.time)} · 📍 ${esc(e.location)}</p><p class="price">${e.price?e.price+' EGP':'Free'}</p><p class="m">${e.availableSeats} of ${e.capacity} seats available</p><br><button class="btn" id="bk" ${e.availableSeats<1?'disabled':''}>${e.availableSeats<1?'Sold out':'Book now'}</button> <a class="btn s" href="#/">Back</a></div>`;
//     $('#bk').onclick=()=>{if(!user)return location.hash='#/login';go(async()=>{const r=await api('/bookings',{method:'POST',body:{eventId:id}});
//       if(!r.booking)return toast(r.message);toast('Booked!');location.hash='#/bookings'})}})}

// /* ---------- Auth ---------- */
// function authPage(reg){
//   app.innerHTML=`<form class="box" id="a"><h2>${reg?'Create account':'Login'}</h2>${reg?'<input name="name" placeholder="Name" required>':''}<input name="email" type="email" placeholder="Email" required><input name="password" type="password" placeholder="Password" minlength="6" required><button class="btn">${reg?'Sign up':'Login'}</button><a href="#/${reg?'login':'register'}" class="m">${reg?'Have an account? Login':'No account? Sign up'}</a></form>`;
//   $('#a').onsubmit=e=>{e.preventDefault();go(async()=>{save(await api('/auth/'+(reg?'register':'login'),{method:'POST',body:Object.fromEntries(new FormData(e.target))}));nav();location.hash='#/'})}}

// /* ---------- Bookings ---------- */
// async function bookings(){
//   if(guard())return;
//   await go(async()=>{const b=await api('/bookings/my-bookings');if(!Array.isArray(b))throw Error(b.message);
//     app.innerHTML='<h1>My Bookings</h1>'+(b.length?`<div class="ov"><table><tr><th>Event</th><th>Date</th><th>Location</th><th>Status</th><th></th></tr>${b.map(x=>`<tr><td>${x.event?`<a href="#/event/${x.event._id}">${esc(x.event.title)}</a>`:'(deleted)'}</td><td>${x.event?fd(x.event.date):''}</td><td>${esc(x.event?.location)}</td><td><span class="st ${x.status}">${x.status}</span></td><td>${x.status=='confirmed'?`<button class="btn d" data-id="${x._id}">Cancel</button>`:''}</td></tr>`).join('')}</table></div>`:'<p class="m">No bookings yet.</p>');
//     app.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>confirm('Cancel this booking?')&&go(async()=>{await api(`/bookings/${b.dataset.id}/cancel`,{method:'PATCH'});toast('Cancelled');bookings()}))})}

// /* ---------- Profile ---------- */
// async function profile(){
//   if(guard())return;
//   app.innerHTML=`<h1 style="text-align:center">Profile</h1><form class="box" id="pf"><h3>Info</h3><input name="name" value="${esc(user.name)}" required><input name="email" type="email" value="${esc(user.email)}" required><button class="btn">Save</button></form><br><form class="box" id="pw"><h3>Change password</h3><input name="currentPassword" type="password" placeholder="Current" required><input name="newPassword" type="password" placeholder="New" minlength="6" required><button class="btn">Update</button></form><br><form class="box" id="dl"><h3>Delete account</h3><input name="password" type="password" placeholder="Password" required><button class="btn d">Delete</button></form>`;
//   const sub=(id,fn)=>$(id).onsubmit=e=>{e.preventDefault();go(()=>fn(Object.fromEntries(new FormData(e.target)),e.target))};
//   sub('#pf',async d=>{const r=await api('/profile',{method:'PUT',body:d});user=r.user;localStorage.user=JSON.stringify(user);nav();toast('Saved')});
//   sub('#pw',async(d,f)=>{await api('/profile/change-password',{method:'PUT',body:d});f.reset();toast('Password updated')});
//   sub('#dl',async d=>{if(!confirm('Delete your account permanently?'))return;await api('/profile',{method:'DELETE',body:d});logout()})}

// /* ---------- Admin ---------- */
// const tabs=['stats','users','bookings','events'];
// async function admin(t='stats'){
//   if(guard(1))return;
//   app.innerHTML=`<h1>Admin</h1><div class="tabs">${tabs.map(x=>`<a class="btn s ${x==t?'on':''}" href="#/admin/${x}">${x}</a>`).join('')}</div><div id="t"></div>`;
//   const T=$('#t');
//   await go(async()=>{
//     if(t=='stats'){const s=(await api('/admin/stats')).stats;T.innerHTML='<div class="stats">'+Object.entries(s).map(([k,v])=>`<div class="box"><b>${v}</b>${k.replace('Count',' ').replace(/([A-Z])/g,' $1')}</div>`).join('')+'</div>'}
//     if(t=='users'){const u=(await api('/admin/users?limit=100')).users;
//       T.innerHTML=`<div class="ov"><table><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr>${u.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.email)}</td><td>${x.role}</td><td>${x.isBlocked?'Blocked':'Active'}</td><td>${x.role=='admin'?'':`${x.isBlocked?'':`<button class="btn s" data-b="${x._id}">Block</button> `}<button class="btn d" data-d="${x._id}">Delete</button>`}</td></tr>`).join('')}</table></div>`;
//       T.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>go(async()=>{await api(`/admin/users/${b.dataset.b}/block`,{method:'PUT'});toast('Blocked');admin(t)}));
//       T.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>confirm('Delete user?')&&go(async()=>{await api('/admin/users/'+b.dataset.d,{method:'DELETE'});toast('Deleted');admin(t)}))}
//     if(t=='bookings'){const b=(await api('/admin/bookings?limit=100')).bookings;
//       T.innerHTML=`<div class="ov"><table><tr><th>User</th><th>Event</th><th>Date</th><th>Status</th></tr>${b.map(x=>`<tr><td>${esc(x.user?.name)}<br><span class="m">${esc(x.user?.email)}</span></td><td>${esc(x.event?.title)}</td><td>${fd(x.bookingDate)}</td><td><span class="st ${x.status}">${x.status}</span></td></tr>`).join('')}</table></div>`}
//     if(t=='events')await adminEvents(T)})}
// async function adminEvents(T,ed){
//   const list=(await api('/events?limit=100')).data,e=ed||{};
//   const i=(n,l,ty='text',x='')=>`<label class="m">${l}<input name="${n}" type="${ty}" value="${esc(e[n])}" required ${x}></label>`;
//   T.innerHTML=`<form class="box wide" id="ef"><h3>${e._id?'Edit':'New'} event</h3><div class="filters">${i('title','Title')}<label class="m">Category<select name="category">${CATS.map(c=>`<option ${e.category==c?'selected':''}>${c}</option>`).join('')}</select></label>${i('location','Location')}${i('date','Date','date')}${i('time','Time','text','placeholder="7:00 PM"')}${i('price','Price','number','min=0')}${i('capacity','Capacity','number','min=1')}</div><textarea name="description" placeholder="Description" required>${esc(e.description)}</textarea><div><button class="btn">Save</button> ${e._id?'<button type="button" class="btn s" id="cx">Cancel</button>':''}</div></form><br><div class="ov"><table><tr><th>Title</th><th>Date</th><th>Booked</th><th></th></tr>${list.map(x=>`<tr><td>${esc(x.title)}</td><td>${fd(x.date)}</td><td>${x.bookedSeats}/${x.capacity}</td><td><button class="btn s" data-e="${x._id}">Edit</button> <button class="btn d" data-x="${x._id}">Delete</button></td></tr>`).join('')}</table></div>`;
//   if(e.date)T.querySelector('[name=date]').value=String(e.date).slice(0,10);
//   if(e._id)$('#cx').onclick=()=>adminEvents(T);
//   $('#ef').onsubmit=ev=>{ev.preventDefault();go(async()=>{const d=Object.fromEntries(new FormData(ev.target));d.price=+d.price;d.capacity=+d.capacity;
//     await api('/events'+(e._id?'/'+e._id:''),{method:e._id?'PUT':'POST',body:d});toast('Saved');adminEvents(T)})};
//   T.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{adminEvents(T,list.find(x=>x._id==b.dataset.e));scrollTo(0,0)});
//   T.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>confirm('Delete event?')&&go(async()=>{await api('/events/'+b.dataset.x,{method:'DELETE'});toast('Deleted');adminEvents(T)}))}

// /* ---------- Router ---------- */
// function route(){
//   const [p,q]=(location.hash.slice(1)||'/').split('?'),s=p.split('/').filter(Boolean);
//   scrollTo(0,0);nav();
//   if(!s.length)events(q);
//   else if(s[0]=='event')eventPage(s[1]);
//   else if(s[0]=='login')authPage(0);
//   else if(s[0]=='register')authPage(1);
//   else if(s[0]=='bookings')bookings();
//   else if(s[0]=='profile')profile();
//   else if(s[0]=='admin')admin(s[1]);
//   else app.innerHTML='<h1>404</h1>'}
// addEventListener('hashchange',route);route();





const API_URL = location.protocol === 'file:' ? 'http://localhost:5000/api' : '/api';

const CATEGORIES = ['Concert', 'Workshop', 'Course', 'Sports Event', 'Conference', 'Arts Event'];

// The logged-in user and their token are remembered in the browser
let user = JSON.parse(localStorage.getItem('user') || 'null');
let token = localStorage.getItem('token') || '';

// Shortcut to find one element on the page
const $ = (selector) => document.querySelector(selector);
const app = $('#app'); // the page content is shown inside this element


/* ---------------------------------------------------------------------
   2. Small helper functions
   --------------------------------------------------------------------- */

// Make a copy of a <template> from index.html
function cloneTemplate(templateId) {
  return document.getElementById(templateId).content.cloneNode(true);
}

// Replace everything inside `container` with a copy of a template
function showTemplate(templateId, container = app) {
  container.replaceChildren(cloneTemplate(templateId));
}

// Put text into the elements marked data-field="..."
// Example: fillText(card, { title: 'Hello' }) fills <h3 data-field="title">
function fillText(root, values) {
  for (const [field, text] of Object.entries(values)) {
    root.querySelector(`[data-field="${field}"]`).textContent = text ?? '';
  }
}

// Set the value of form inputs by their name
// Example: setInputValues(form, { email: 'a@b.com' })
function setInputValues(form, values) {
  for (const [name, value] of Object.entries(values)) {
    form.elements[name].value = value ?? '';
  }
}

// Add the category options to a <select>, and pick one if given
function addCategoryOptions(select, selectedCategory) {
  for (const category of CATEGORIES) {
    select.add(new Option(category, category, false, category == selectedCategory));
  }
}

// Show a colored status label such as "confirmed" or "cancelled"
function setStatusBadge(badge, status) {
  badge.textContent = status;
  badge.className = 'status ' + status;
}

// Turn a date into text like "5 Jan 2026"
function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

// Show "200 EGP", or "Free" when the price is 0
function formatPrice(price) {
  return price ? price + ' EGP' : 'Free';
}

// Show a small message at the bottom of the screen for a moment
function toast(message) {
  const box = $('#toast');
  box.textContent = message;
  box.className = 'show';
  setTimeout(() => (box.className = ''), 2600);
}

// Run some code, and if it fails show the error message as a toast
async function runSafely(action) {
  try {
    await action();
  } catch (error) {
    toast(error.message);
  }
}

// Run `handler` when a form is submitted.
// The handler receives the form values as an object, and the form itself.
function handleForm(selector, handler) {
  $(selector).onsubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const data = Object.fromEntries(new FormData(form));
    runSafely(() => handler(data, form));
  };
}


/* ---------------------------------------------------------------------
   3. Talking to the backend
   --------------------------------------------------------------------- */

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;

  const response = await fetch(API_URL + path, {
    method: options.method || 'GET',
    headers: headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    // 401 = our login is no longer valid
    if (response.status === 401 && token) logout(true);
    throw Error(data.message || 'Request failed');
  }
  return data;
}


/* ---------------------------------------------------------------------
   4. Login state and navigation bar
   --------------------------------------------------------------------- */

// Remember the user after login / sign up
function saveLogin(data) {
  token = data.token;
  user = data.user;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function logout(sessionExpired) {
  token = '';
  user = null;
  localStorage.clear();
  renderNav();
  location.hash = '#/login';
  if (sessionExpired) toast('Session expired');
}

// Show different links depending on whether someone is logged in
function renderNav() {
  const navLinks = $('#nav-links');

  if (!user) {
    navLinks.replaceChildren(cloneTemplate('tpl-nav-guest'));
    return;
  }

  const links = cloneTemplate('tpl-nav-user');
  fillText(links, { name: user.name });

  // Only admins see the Admin link
  if (user.role !== 'admin') links.querySelector('#admin-link').remove();

  links.querySelector('#logout-link').onclick = (event) => {
    event.preventDefault();
    logout();
  };

  navLinks.replaceChildren(links);
}

// Send the visitor away if they are not allowed on this page.
// Returns true when they were sent away.
function redirectIfNotAllowed(adminOnly) {
  if (!user) {
    location.hash = '#/login';
    return true;
  }
  if (adminOnly && user.role !== 'admin') {
    location.hash = '#/';
    return true;
  }
  return false;
}


/* ---------------------------------------------------------------------
   5. Events list page (with search filters and page numbers)
   --------------------------------------------------------------------- */

// Build one event card
function createEventCard(event) {
  const card = cloneTemplate('tpl-event-card');
  fillText(card, {
    category: event.category,
    title: event.title,
    date: formatDate(event.date),
    time: event.time,
    location: event.location,
    price: formatPrice(event.price),
    seats: event.availableSeats,
  });
  card.querySelector('.details-link').href = '#/event/' + event._id;
  return card;
}

// Link to another page of results, keeping the current filters
function pageLink(filters, page) {
  const params = new URLSearchParams(filters);
  params.delete('limit');
  params.set('page', page);
  return '#/?' + params;
}

async function showEventsPage(query) {
  const filters = new URLSearchParams(query); // filters come from the URL
  showTemplate('tpl-events-page');

  // Fill the filter form with the current filters
  const form = $('#filter-form');
  setInputValues(form, {
    search: filters.get('search'),
    location: filters.get('location'),
    maxPrice: filters.get('maxPrice'),
    date: filters.get('date'),
  });
  addCategoryOptions(form.elements.category, filters.get('category'));

  // When the form is sent, put the (non-empty) filters in the URL
  form.onsubmit = (event) => {
    event.preventDefault();
    const filled = [...new FormData(form)].filter(([, value]) => value);
    location.hash = '#/?' + new URLSearchParams(filled);
  };

  await runSafely(async () => {
    // Ask the backend for 9 events per page
    const apiParams = new URLSearchParams(filters);
    apiParams.set('limit', 9);
    const result = await api('/events?' + apiParams);

    // Show the event cards
    const list = $('#events-list');
    if (result.data.length) {
      list.append(...result.data.map(createEventCard));
    } else {
      list.append(cloneTemplate('tpl-no-events'));
    }

    // Show page numbers (only when there is more than one page)
    const currentPage = +filters.get('page') || 1;
    const totalPages = result.pagination.pages;
    if (totalPages > 1) {
      const pagination = cloneTemplate('tpl-pagination');
      fillText(pagination, { pageInfo: `${currentPage} / ${totalPages}` });

      const prevLink = pagination.querySelector('.prev-page');
      const nextLink = pagination.querySelector('.next-page');

      if (currentPage > 1) prevLink.href = pageLink(filters, currentPage - 1);
      else prevLink.remove();

      if (currentPage < totalPages) nextLink.href = pageLink(filters, currentPage + 1);
      else nextLink.remove();

      $('#pagination').append(pagination);
    }
  });
}


/* ---------------------------------------------------------------------
   6. Single event page (with the Book button)
   --------------------------------------------------------------------- */

async function showEventPage(eventId) {
  await runSafely(async () => {
    const event = (await api('/events/' + eventId)).data;

    showTemplate('tpl-event-details');
    fillText(app, {
      category: event.category,
      title: event.title,
      description: event.description,
      date: formatDate(event.date),
      time: event.time,
      location: event.location,
      price: formatPrice(event.price),
      seats: event.availableSeats,
      capacity: event.capacity,
    });

    // The Book button
    const soldOut = event.availableSeats < 1;
    const bookButton = $('#book-button');
    bookButton.disabled = soldOut;
    bookButton.textContent = soldOut ? 'Sold out' : 'Book now';

    bookButton.onclick = () => {
      if (!user) {
        location.hash = '#/login';
        return;
      }
      runSafely(async () => {
        const result = await api('/bookings', { method: 'POST', body: { eventId: eventId } });
        if (!result.booking) {
          toast(result.message);
          return;
        }
        toast('Booked!');
        location.hash = '#/bookings';
      });
    };
  });
}


/* ---------------------------------------------------------------------
   7. Login and Sign up pages
   --------------------------------------------------------------------- */

function showAuthPage(isRegister) {
  showTemplate(isRegister ? 'tpl-register-page' : 'tpl-login-page');

  handleForm('#auth-form', async (data) => {
    const result = await api('/auth/' + (isRegister ? 'register' : 'login'), { method: 'POST', body: data });
    saveLogin(result);
    renderNav();
    location.hash = '#/';
  });
}


/* ---------------------------------------------------------------------
   8. My bookings page
   --------------------------------------------------------------------- */

async function showBookingsPage() {
  if (redirectIfNotAllowed()) return;

  await runSafely(async () => {
    const bookings = await api('/bookings/my-bookings');
    if (!Array.isArray(bookings)) throw Error(bookings.message);

    showTemplate('tpl-bookings-page');

    // No bookings: keep only the "No bookings yet." message
    if (bookings.length === 0) {
      $('#bookings-table').remove();
      return;
    }
    $('#no-bookings').remove();

    const tableBody = $('#bookings-table tbody');
    for (const booking of bookings) {
      const row = cloneTemplate('tpl-booking-row');

      // The event's link (or "(deleted)" if the event no longer exists)
      const eventLink = row.querySelector('.event-link');
      if (booking.event) {
        eventLink.textContent = booking.event.title ?? '';
        eventLink.href = '#/event/' + booking.event._id;
        row.querySelector('.deleted-label').remove();
      } else {
        eventLink.remove();
      }

      fillText(row, {
        date: booking.event ? formatDate(booking.event.date) : '',
        location: booking.event?.location,
      });
      setStatusBadge(row.querySelector('.status'), booking.status);

      // Only confirmed bookings can be cancelled
      const cancelButton = row.querySelector('.cancel-button');
      if (booking.status == 'confirmed') {
        cancelButton.onclick = () => {
          if (!confirm('Cancel this booking?')) return;
          runSafely(async () => {
            await api(`/bookings/${booking._id}/cancel`, { method: 'PATCH' });
            toast('Cancelled');
            showBookingsPage();
          });
        };
      } else {
        cancelButton.remove();
      }

      tableBody.append(row);
    }
  });
}


/* ---------------------------------------------------------------------
   9. Profile page
   --------------------------------------------------------------------- */

function showProfilePage() {
  if (redirectIfNotAllowed()) return;

  showTemplate('tpl-profile-page');
  setInputValues($('#profile-form'), { name: user.name, email: user.email });

  // Save name and email
  handleForm('#profile-form', async (data) => {
    const result = await api('/profile', { method: 'PUT', body: data });
    user = result.user;
    localStorage.setItem('user', JSON.stringify(user));
    renderNav();
    toast('Saved');
  });

  // Change password
  handleForm('#password-form', async (data, form) => {
    await api('/profile/change-password', { method: 'PUT', body: data });
    form.reset();
    toast('Password updated');
  });

  // Delete account
  handleForm('#delete-form', async (data) => {
    if (!confirm('Delete your account permanently?')) return;
    await api('/profile', { method: 'DELETE', body: data });
    logout();
  });
}


/* ---------------------------------------------------------------------
   10. Admin pages
   --------------------------------------------------------------------- */

// The admin page has 4 tabs: stats, users, bookings, events
async function showAdminPage(tab = 'stats') {
  if (redirectIfNotAllowed(true)) return;

  showTemplate('tpl-admin-page');

  // Highlight the current tab
  const tabLink = $(`[data-tab="${tab}"]`);
  if (tabLink) tabLink.classList.add('active');

  const content = $('#admin-content');
  await runSafely(async () => {
    if (tab == 'stats') await showStatsTab(content);
    if (tab == 'users') await showUsersTab(content);
    if (tab == 'bookings') await showAdminBookingsTab(content);
    if (tab == 'events') await showAdminEventsTab(content);
  });
}

// ----- Admin: stats -----
async function showStatsTab(content) {
  const stats = (await api('/admin/stats')).stats;

  showTemplate('tpl-admin-stats', content);
  const grid = content.querySelector('.stats');

  for (const [name, value] of Object.entries(stats)) {
    const box = cloneTemplate('tpl-stat-box');
    // Turn a name like "totalUsersCount" into a readable label
    const label = name.replace('Count', ' ').replace(/([A-Z])/g, ' $1');
    fillText(box, { value: value, label: label });
    grid.append(box);
  }
}

// ----- Admin: users -----
async function showUsersTab(content) {
  const users = (await api('/admin/users?limit=100')).users;

  showTemplate('tpl-admin-users', content);
  const tableBody = content.querySelector('tbody');

  for (const person of users) {
    const row = cloneTemplate('tpl-user-row');
    fillText(row, {
      name: person.name,
      email: person.email,
      role: person.role,
      status: person.isBlocked ? 'Blocked' : 'Active',
    });

    const actions = row.querySelector('.actions');
    const blockButton = row.querySelector('.block-button');
    const deleteButton = row.querySelector('.delete-button');

    if (person.role == 'admin') {
      // Admins cannot be blocked or deleted
      actions.replaceChildren();
    } else {
      // Already blocked users don't need a Block button
      if (person.isBlocked) {
        blockButton.remove();
      } else {
        blockButton.onclick = () => {
          runSafely(async () => {
            await api(`/admin/users/${person._id}/block`, { method: 'PUT' });
            toast('Blocked');
            showAdminPage('users');
          });
        };
      }

      deleteButton.onclick = () => {
        if (!confirm('Delete user?')) return;
        runSafely(async () => {
          await api('/admin/users/' + person._id, { method: 'DELETE' });
          toast('Deleted');
          showAdminPage('users');
        });
      };
    }

    tableBody.append(row);
  }
}

// ----- Admin: bookings -----
async function showAdminBookingsTab(content) {
  const bookings = (await api('/admin/bookings?limit=100')).bookings;

  showTemplate('tpl-admin-bookings', content);
  const tableBody = content.querySelector('tbody');

  for (const booking of bookings) {
    const row = cloneTemplate('tpl-admin-booking-row');
    fillText(row, {
      userName: booking.user?.name,
      userEmail: booking.user?.email,
      eventTitle: booking.event?.title,
      date: formatDate(booking.bookingDate),
    });
    setStatusBadge(row.querySelector('.status'), booking.status);
    tableBody.append(row);
  }
}

// ----- Admin: events (add / edit / delete) -----
// Pass `eventToEdit` to fill the form with an existing event.
// Without it, the form is empty and creates a new event.
async function showAdminEventsTab(content, eventToEdit) {
  const events = (await api('/events?limit=100')).data;
  const editing = eventToEdit || {};
  const isEditing = Boolean(editing._id);

  showTemplate('tpl-admin-events', content);

  // Fill the form
  const form = content.querySelector('#event-form');
  fillText(form, { heading: (isEditing ? 'Edit' : 'New') + ' event' });
  addCategoryOptions(form.elements.category, editing.category);
  setInputValues(form, {
    title: editing.title,
    location: editing.location,
    time: editing.time,
    price: editing.price,
    capacity: editing.capacity,
    description: editing.description,
  });
  // The date from the backend looks like "2026-01-05T00:00:00Z"; the input needs "2026-01-05"
  if (editing.date) form.elements.date.value = String(editing.date).slice(0, 10);

  // The Cancel button only makes sense while editing
  const cancelButton = form.querySelector('#cancel-edit');
  if (isEditing) cancelButton.onclick = () => showAdminEventsTab(content);
  else cancelButton.remove();

  // Save the event (create or update)
  handleForm('#event-form', async (data) => {
    data.price = +data.price;
    data.capacity = +data.capacity;

    const path = isEditing ? '/events/' + editing._id : '/events';
    await api(path, { method: isEditing ? 'PUT' : 'POST', body: data });

    toast('Saved');
    showAdminEventsTab(content);
  });

  // Table of all events
  const tableBody = content.querySelector('tbody');
  for (const item of events) {
    const row = cloneTemplate('tpl-admin-event-row');
    fillText(row, {
      title: item.title,
      date: formatDate(item.date),
      booked: `${item.bookedSeats}/${item.capacity}`,
    });

    row.querySelector('.edit-button').onclick = () => {
      showAdminEventsTab(content, item);
      scrollTo(0, 0);
    };

    row.querySelector('.delete-button').onclick = () => {
      if (!confirm('Delete event?')) return;
      runSafely(async () => {
        await api('/events/' + item._id, { method: 'DELETE' });
        toast('Deleted');
        showAdminEventsTab(content);
      });
    };

    tableBody.append(row);
  }
}


/* ---------------------------------------------------------------------
   11. Router: decides which page to show from the URL (#/...)
   --------------------------------------------------------------------- */

function route() {
  // "#/event/123?x=1"  ->  path "/event/123", query "x=1"
  const [path, query] = (location.hash.slice(1) || '/').split('?');
  const parts = path.split('/').filter(Boolean); // ["event", "123"]

  scrollTo(0, 0);
  renderNav();

  if (parts.length === 0) showEventsPage(query);
  else if (parts[0] == 'event') showEventPage(parts[1]);
  else if (parts[0] == 'login') showAuthPage(false);
  else if (parts[0] == 'register') showAuthPage(true);
  else if (parts[0] == 'bookings') showBookingsPage();
  else if (parts[0] == 'profile') showProfilePage();
  else if (parts[0] == 'admin') showAdminPage(parts[1]);
  else showTemplate('tpl-not-found');
}

// Show the right page now, and again whenever the URL hash changes
addEventListener('hashchange', route);
route();
