// ── ROLE-BASED SIDEBAR CONFIG ──
const roleConfig = {
  admin: {
    dashboard: 'dashboard-admin.html',
    subtitle:  'Clinical Trial Management',
    label:     'System Administrator',
    avatar:    'AD',
    nav: [
      { href:'dashboard-admin.html',   icon:'fa-house',              text:'Dashboard' },
      { href:'studies.html',           icon:'fa-clipboard-list',     text:'Studies' },
      { href:'participants.html',      icon:'fa-users',              text:'Participants' },
      { href:'ecrf.html',              icon:'fa-file-medical',       text:'eCRF' },
      { href:'adverse-events.html',    icon:'fa-triangle-exclamation', text:'Adverse Events' },
      { href:'documents.html',         icon:'fa-folder-open',        text:'Regulatory Docs' },
      { href:'reports.html',           icon:'fa-chart-bar',          text:'Reports' },
      { href:'#',                      icon:'fa-gear',               text:'Settings' }
    ]
  },
  sponsor: {
    dashboard: 'dashboard-sponsor.html',
    subtitle:  'Sponsor Portal',
    label:     'Sponsor',
    avatar:    'SP',
    nav: [
      { href:'dashboard-sponsor.html', icon:'fa-house',              text:'Dashboard' },
      { href:'studies.html',           icon:'fa-clipboard-list',     text:'My Studies' },
      { href:'participants.html',      icon:'fa-users',              text:'Participants' },
      { href:'adverse-events.html',    icon:'fa-triangle-exclamation', text:'Safety Reports' },
      { href:'documents.html',         icon:'fa-folder-open',        text:'Documents' },
      { href:'reports.html',           icon:'fa-chart-bar',          text:'Analytics' }
    ]
  },
  pi: {
    dashboard: 'dashboard-pi.html',
    subtitle:  'PI Portal',
    label:     'Principal Investigator',
    avatar:    'PI',
    nav: [
      { href:'dashboard-pi.html',      icon:'fa-house',              text:'Dashboard' },
      { href:'studies.html',           icon:'fa-clipboard-list',     text:'My Studies' },
      { href:'participants.html',      icon:'fa-users',              text:'Participants' },
      { href:'ecrf.html',              icon:'fa-file-medical',       text:'eCRF Review' },
      { href:'adverse-events.html',    icon:'fa-triangle-exclamation', text:'Adverse Events' },
      { href:'documents.html',         icon:'fa-folder-open',        text:'Documents' },
      { href:'reports.html',           icon:'fa-chart-bar',          text:'Reports' }
    ]
  },
  coordinator: {
    dashboard: 'dashboard-coordinator.html',
    subtitle:  'Coordinator Portal',
    label:     'Site Coordinator',
    avatar:    'SC',
    nav: [
      { href:'dashboard-coordinator.html', icon:'fa-house',          text:'Dashboard' },
      { href:'participants.html',          icon:'fa-users',          text:'Participants' },
      { href:'ecrf.html',                  icon:'fa-file-medical',   text:'eCRF Entry' },
      { href:'adverse-events.html',        icon:'fa-triangle-exclamation', text:'Adverse Events' },
      { href:'documents.html',             icon:'fa-folder-open',    text:'Documents' },
      { href:'studies.html',               icon:'fa-clipboard-list', text:'Study Info' }
    ]
  },
  datamanager: {
    dashboard: 'dashboard-datamanager.html',
    subtitle:  'Data Manager Portal',
    label:     'Data Manager',
    avatar:    'DM',
    nav: [
      { href:'dashboard-datamanager.html', icon:'fa-house',          text:'Dashboard' },
      { href:'studies.html',               icon:'fa-clipboard-list', text:'Studies' },
      { href:'participants.html',          icon:'fa-users',          text:'Participants' },
      { href:'ecrf.html',                  icon:'fa-file-medical',   text:'eCRF Review' },
      { href:'reports.html',               icon:'fa-chart-bar',      text:'Reports' }
    ]
  },
  participant: {
    dashboard: 'dashboard-participant.html',
    subtitle:  'Participant Portal',
    label:     'Study Participant',
    avatar:    'PT',
    nav: [
      { href:'dashboard-participant.html', icon:'fa-house',          text:'My Dashboard' },
      { href:'participant-visits.html',    icon:'fa-calendar-check', text:'My Visits' },
      { href:'participant-health.html',    icon:'fa-file-medical',   text:'My Health Data' },
      { href:'participant-documents.html', icon:'fa-folder-open',    text:'My Documents' },
      { href:'#',                          icon:'fa-circle-question',text:'Help & FAQ' }
    ]
  }
};

function applyRoleToSidebar() {
  const role = localStorage.getItem('ctms_role') || 'admin';
  const cfg  = roleConfig[role] || roleConfig.admin;
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  // ── Rewrite subtitle ──
  const subtitleEl = document.querySelector('.sidebar-logo span');
  if (subtitleEl) subtitleEl.textContent = cfg.subtitle;

  // ── Rebuild nav ──
  const nav = document.querySelector('.sidebar nav');
  if (nav) {
    nav.innerHTML = cfg.nav.map(item => {
      const active = (currentPage === item.href) ? ' class="active"' : '';
      return `<a href="${item.href}"${active}><i class="fa-solid ${item.icon}"></i><span>${item.text}</span></a>`;
    }).join('\n');
  }

  // ── Update footer role label ──
  const roleSpan = document.querySelector('.sidebar-footer .role-label');
  if (roleSpan) roleSpan.textContent = cfg.label;

  // ── Update topbar avatar ──
  const avatar = document.querySelector('.avatar');
  if (avatar) avatar.textContent = cfg.avatar;
}



// Tab switching
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tab-group') || btn.parentElement.parentElement;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

// Simple modal
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

document.addEventListener('DOMContentLoaded', () => {
  applyRoleToSidebar();
  initTabs();
  document.querySelectorAll('.modal-backdrop').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.style.display = 'none'; });
  });
});
