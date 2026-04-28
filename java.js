// ── FIREBASE CONFIG ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAleXyrxtFEGk4LbXG5LbBHipvjMOHEMPs",
  authDomain: "laptopform-f293b.firebaseapp.com",
  databaseURL: "https://laptopform-f293b-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "laptopform-f293b",
  storageBucket: "laptopform-f293b.firebasestorage.app",
  messagingSenderId: "289492991554",
  appId: "1:289492991554:web:a34e296a3c9c23f825b7db",
  measurementId: "G-8706Z8FPQR"
};

// Initialize Firebase (prevent duplicate init)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db   = firebase.database();
const auth = firebase.auth();

// ── LOADING HELPER ───────────────────────────────────────────────
function setLoading(active) {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.toggle('active', active);
  const btn = document.getElementById('submitBtn') || document.getElementById('loginBtn');
  if (btn) btn.disabled = active;
}

// ── TOAST HELPER ─────────────────────────────────────────────────
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── GET FIELD VALUE ───────────────────────────────────────────────
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// ── FORM SUBMIT ───────────────────────────────────────────────────
function submitForm() {
  const required = ['assetTag', 'brand', 'model', 'serialNumber'];
  for (const fieldId of required) {
    if (!val(fieldId)) {
      showToast('Please fill in Asset Tag, Brand, Model and Serial Number.', true);
      const el = document.getElementById(fieldId);
      if (el) el.focus();
      return;
    }
  }

  const user = auth.currentUser;

  const entry = {
    assetTag:     val('assetTag'),
    assignedTo:   val('assignedTo'),
    department:   val('department'),
    dateAssigned: val('dateAssigned'),
    brand:        val('brand'),
    model:        val('model'),
    serialNumber: val('serialNumber'),
    os:           val('os'),
    cpu:          val('cpu'),
    ram:          val('ram'),
    storage:      val('storage'),
    storageType:  val('storageType'),
    screenSize:   val('screenSize'),
    condition:    val('condition'),
    availability: val('availability'),
    notes:        val('notes'),
    recordedBy:   user ? user.email : 'unknown',
    timestamp:    new Date().toISOString()
  };

  setLoading(true);

  db.ref('laptops').push(entry)
    .then(() => {
      setLoading(false);
      showToast('Saved successfully.');
      resetForm();
    })
    .catch(err => {
      setLoading(false);
      console.error('Firebase error:', err);
      showToast('Failed to save. Check permissions.', true);
    });
}

// ── FORM RESET ────────────────────────────────────────────────────
function resetForm() {
  const fields = [
    'assetTag','assignedTo','department','dateAssigned',
    'brand','model','serialNumber','os','cpu',
    'ram','storage','storageType','screenSize','condition','availability','notes'
  ];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}