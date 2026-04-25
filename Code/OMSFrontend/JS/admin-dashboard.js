const DELETE_IMG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;

const DEF_SUPPLIERS = [
  { name:'TechWorld Ltd.',    email:'supplier@store.com',  password:'••••••••••••', displayPassword:'••••••••••••', phone:'+20111111111' },
  { name:'GadgetHub Egypt',   email:'gadget@hub.eg',       password:'••••••••••••', displayPassword:'••••••••••••', phone:'+20122222222' },
  { name:'Mobile Zone Cairo', email:'zone@mobile.eg',      password:'••••••••••••', displayPassword:'••••••••••••', phone:'+20133333333' },
];
const DEF_CLIENTS = [
  { first:'Ahmed', last:'Hassan',  email:'ahmed@gmail.com', password:'•••••••••••••' },
  { first:'Sara',  last:'Mohamed', email:'sara@gmail.com',  password:'•••••••••••••' },
  { first:'Omar',  last:'Ali',     email:'omar@gmail.com',  password:'•••••••••••••' },
];

let suppliers = JSON.parse(localStorage.getItem('adminSuppliers') || 'null') || DEF_SUPPLIERS;
let clients   = JSON.parse(localStorage.getItem('adminClients')   || 'null') || DEF_CLIENTS;

function save() {
  localStorage.setItem('adminSuppliers', JSON.stringify(suppliers));
  localStorage.setItem('adminClients',   JSON.stringify(clients));
}

function renderAll() {
  const totCli = document.getElementById('totalClients');
  const totSup = document.getElementById('totalSuppliers');
  if (totCli) totCli.textContent = clients.length;
  if (totSup) totSup.textContent = suppliers.length;

  const suppWrap = document.getElementById('suppliersWrapper');
  const noSupp   = document.getElementById('noSuppliers');
  const suppBody = document.getElementById('suppliersBody');

  if (suppliers.length === 0) {
    if (suppWrap) suppWrap.style.display = 'none';
    if (noSupp) noSupp.style.display = 'block';
  } else {
    if (suppWrap) suppWrap.style.display = 'block';
    if (noSupp) noSupp.style.display = 'none';
    if (suppBody) {
      suppBody.innerHTML = suppliers.map((s, i) => `
        <tr>
          <td class="td-title">${s.name}</td>
          <td>${s.email}</td>
          <td class="td-pass">${s.displayPassword || '••••••••••••'}</td>
          <td>${s.phone}</td>
          <td><button class="btn-icon-delete" onclick="deleteSupplier(${i})" title="Delete">${DELETE_IMG}</button></td>
        </tr>
      `).join('');
    }
  }

  const cliWrap = document.getElementById('clientsWrapper');
  const noCli   = document.getElementById('noClients');
  const cliBody = document.getElementById('clientsBody');

  if (clients.length === 0) {
    if (cliWrap) cliWrap.style.display = 'none';
    if (noCli) noCli.style.display = 'block';
  } else {
    if (cliWrap) cliWrap.style.display = 'block';
    if (noCli) noCli.style.display = 'none';
    if (cliBody) {
      cliBody.innerHTML = clients.map((c, i) => `
        <tr>
          <td>${c.first}</td>
          <td>${c.last}</td>
          <td>${c.email}</td>
          <td class="td-pass">•••••••••••••</td>
          <td><button class="btn-icon-delete" onclick="deleteClient(${i})" title="Delete">${DELETE_IMG}</button></td>
        </tr>
      `).join('');
    }
  }
}

function deleteSupplier(i) {
  suppliers.splice(i, 1); save(); renderAll();
  const mod = document.getElementById('deletedModal');
  if (mod) mod.classList.add('active');
}
function deleteClient(i) {
  clients.splice(i, 1); save(); renderAll();
  const mod = document.getElementById('deletedModal');
  if (mod) mod.classList.add('active');
}

function closeModal(id) {
  const mod = document.getElementById(id);
  if (mod) mod.classList.remove('active');
}

function handleLogout() {
  localStorage.removeItem('currentUser');
  window.location.replace('login.html');
}

window.onload = () => {
  renderAll();
};
