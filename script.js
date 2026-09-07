/* =========================================================
   EASY-FLY BOOKING — Scripts du site
   Contrat + Signature + PDF + EmailJS + WhatsApp
   ========================================================= */


/* =========================================================
   PAGE D'ACCUEIL
   ========================================================= */

function openTransport() {
  document.getElementById('transport-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeTransport() {
  document.getElementById('transport-modal').style.display = 'none';
  document.body.style.overflow = '';
}

(function () {
  var m = document.getElementById('transport-modal');

  if (m) {
    m.addEventListener('click', function (e) {
      if (e.target === this) {
        closeTransport();
      }
    });
  }
})();

function openModal(service) {
  var msg =
    'Bonjour, je suis intéressé(e) par votre futur service : ' +
    service +
    '. Pouvez-vous me tenir informé(e) ?';

  window.open(
    'https://wa.me/241065033140?text=' +
      encodeURIComponent(msg),
    '_blank'
  );
}




/* =========================================================
   MODALE RÉSERVATION (Séjours / Voitures) → WhatsApp
   ========================================================= */

var resaService = '';

function openReservation(service) {
  resaService = service;
  var titre = document.getElementById('resa-title');
  if (titre) {
    titre.textContent = 'Réservation — ' + service;
  }
  var modal = document.getElementById('reservation-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeReservation() {
  var modal = document.getElementById('reservation-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function envoyerReservation() {
  var nom = document.getElementById('resa-nom').value.trim();
  var tel = document.getElementById('resa-tel').value.trim();
  var ville = document.getElementById('resa-ville').value.trim();
  var dd = document.getElementById('resa-datedebut').value;
  var df = document.getElementById('resa-datefin').value;
  var details = document.getElementById('resa-details').value.trim();
  var alert = document.getElementById('resa-alert');

  // Validation des champs obligatoires
  if (!nom || !tel || !ville || !dd || !df) {
    alert.textContent = '⚠️ Merci de remplir tous les champs obligatoires (*).';
    alert.style.display = 'block';
    return false;
  }
  alert.style.display = 'none';

  // Construire le message WhatsApp
  var msg =
    'Bonjour Easy Fly Booking 👋\n\n' +
    '📋 *Demande de réservation — ' + resaService + '*\n\n' +
    '👤 *Nom :* ' + nom + '\n' +
    '📞 *Téléphone :* ' + tel + '\n' +
    '📍 *Ville / destination :* ' + ville + '\n' +
    '📅 *Du :* ' + dd + '\n' +
    '📅 *Au :* ' + df + '\n';

  if (details) {
    msg += '📝 *Détails :* ' + details + '\n';
  }

  msg += '\nMerci de me recontacter.';

  // Ouvrir WhatsApp
  var lien = document.getElementById('resa-send');
  lien.href = 'https://wa.me/241065033140?text=' + encodeURIComponent(msg);

  // Laisser le lien s'ouvrir (return true)
  setTimeout(closeReservation, 500);
  return true;
}

// Fermer la modale réservation en cliquant à l'extérieur
(function () {
  var m = document.getElementById('reservation-modal');
  if (m) {
    m.addEventListener('click', function (e) {
      if (e.target === this) {
        closeReservation();
      }
    });
  }
})();


/* =========================================================
   PAGE CONTRAT DE RÉSERVATION
   ========================================================= */


/* =========================
   STATE
   ========================= */

var contractNum = '';
var signatureData = '';
var sigDrawing = false;
var emailSending = false;


/* =========================
   INITIALISATION
   ========================= */

window.addEventListener('DOMContentLoaded', function () {

  if (!document.body.classList.contains('page-contrat')) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var t = params.get('transport');

  if (t) {

    var sel = document.getElementById('c-transport');

    var map = {
      'avion': 'Avion ✈',
      'train': 'Train 🚂',
      'bateau': 'Bateau 🚢'
    };

    if (sel && map[t.toLowerCase()]) {
      sel.value = map[t.toLowerCase()];
    }
  }

});


/* =========================================================
   NAVIGATION
   ========================================================= */

function goTo(n) {

  document.querySelectorAll('.page').forEach(function (p) {
    p.classList.remove('active');
  });

  var target = document.getElementById('page' + n);

  if (target) {
    target.classList.add('active');
  }

  document.querySelectorAll('.step').forEach(function (s, i) {

    s.classList.remove('active', 'done');

    if (i + 1 < n) {
      s.classList.add('done');
    }

    if (i + 1 === n) {
      s.classList.add('active');
    }

  });

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}


/* =========================================================
   ÉTAPE 1 → ÉTAPE 2
   ========================================================= */

function goToStep2() {

  var nom = document.getElementById('c-nom').value.trim();
  var tel = document.getElementById('c-tel').value.trim();
  var tsp = document.getElementById('c-transport').value;
  var dep = document.getElementById('c-depart').value.trim();
  var dest = document.getElementById('c-destination').value.trim();
  var date = document.getElementById('c-date').value;
  var pax = document.getElementById('c-passagers').value;
  var al = document.getElementById('alert1');

  if (!nom || !tel || !tsp || !dep || !dest || !date || !pax) {

    al.textContent =
      '⚠️ Veuillez remplir tous les champs obligatoires (*)';

    al.className = 'alert error';

    return;
  }

  al.className = 'alert';

  goTo(2);
}


/* =========================================================
   ÉTAPE 2 → ÉTAPE 3
   ========================================================= */

function goToStep3() {

  var al = document.getElementById('alert2');

  if (!document.getElementById('c-lu').checked) {

    al.textContent =
      '⚠️ Vous devez accepter les conditions générales pour continuer.';

    al.className = 'alert error';

    return;
  }

  al.className = 'alert';

  contractNum =
    'EFB-' + Date.now().toString().slice(-6);

  document.getElementById('prev-num').textContent = 'N° ' + contractNum;
  document.getElementById('prev-nom').textContent = document.getElementById('c-nom').value;
  document.getElementById('prev-tel').textContent = document.getElementById('c-tel').value;
  document.getElementById('prev-transport').textContent = document.getElementById('c-transport').value;
  document.getElementById('prev-depart').textContent = document.getElementById('c-depart').value;
  document.getElementById('prev-destination').textContent = document.getElementById('c-destination').value;
  document.getElementById('prev-date').textContent = formatDate(document.getElementById('c-date').value);
  document.getElementById('prev-passagers').textContent = document.getElementById('c-passagers').value;
  document.getElementById('prev-today').textContent = formatDate(new Date().toISOString().split('T')[0]);

  goTo(3);

  setTimeout(function () {
    initCanvas();
  }, 100);
}


/* =========================================================
   CONDITIONS GÉNÉRALES
   ========================================================= */

function toggleCheck() {

  var cb = document.getElementById('c-lu');

  cb.checked = !cb.checked;

  checkRead();
}


function checkRead() {

  document.getElementById('btn-sign').disabled =
    !document.getElementById('c-lu').checked;
}


/* =========================================================
   CANVAS SIGNATURE
   ========================================================= */

function initCanvas() {

  var canvas = document.getElementById('sigCanvas');
  var wrap = document.getElementById('sigWrap');

  if (!canvas || !wrap) {
    return;
  }

  canvas.width = wrap.offsetWidth;
  canvas.height = 180;

  var ctx = canvas.getContext('2d');

  ctx.strokeStyle = '#0057B8';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  function getPos(e) {

    var r = canvas.getBoundingClientRect();

    if (e.touches) {
      return {
        x: e.touches[0].clientX - r.left,
        y: e.touches[0].clientY - r.top
      };
    }

    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top
    };
  }

  canvas.addEventListener('mousedown', function (e) {
    sigDrawing = true;
    ctx.beginPath();
    var p = getPos(e);
    ctx.moveTo(p.x, p.y);
    hidePlaceholder();
  });

  canvas.addEventListener('mousemove', function (e) {
    if (!sigDrawing) { return; }
    var p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  });

  canvas.addEventListener('mouseup', function () {
    sigDrawing = false;
  });

  canvas.addEventListener('mouseleave', function () {
    sigDrawing = false;
  });

  canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    sigDrawing = true;
    ctx.beginPath();
    var p = getPos(e);
    ctx.moveTo(p.x, p.y);
    hidePlaceholder();
  }, { passive: false });

  canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
    if (!sigDrawing) { return; }
    var p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }, { passive: false });

  canvas.addEventListener('touchend', function () {
    sigDrawing = false;
  });
}


/* =========================================================
   SIGNATURE
   ========================================================= */

function hidePlaceholder() {

  var placeholder = document.getElementById('sigPlaceholder');

  if (placeholder) {
    placeholder.style.display = 'none';
  }
}


function clearSig() {

  var canvas = document.getElementById('sigCanvas');

  if (!canvas) {
    return;
  }

  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

  var placeholder = document.getElementById('sigPlaceholder');

  if (placeholder) {
    placeholder.style.display = 'flex';
  }

  signatureData = '';
}


function isSigEmpty() {

  var canvas = document.getElementById('sigCanvas');

  if (!canvas) {
    return true;
  }

  var data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;

  for (var i = 3; i < data.length; i += 4) {
    if (data[i] > 0) {
      return false;
    }
  }

  return true;
}


// ══════════════════════════════════════════
// VALIDATION FINALE
// ══════════════════════════════════════════
async function validerContrat() {
  var al = document.getElementById('alert3');

  if (isSigEmpty()) {
    al.textContent = '⚠️ Veuillez apposer votre signature avant de valider.';
    al.className = 'alert error';
    return;
  }

  al.className = 'alert';

  // Récupération de la signature
signatureData = document.getElementById('sigCanvas').toDataURL('image/jpeg', 0.5);

  // Affichage du numéro de contrat
  document.getElementById('confirm-num').textContent = contractNum;

  try {
    // Génère UNE SEULE FOIS le PDF
    var resultat = genererPDF();

    // Affiche la taille du PDF dans la console
    console.log(
      "📄 Taille du PDF :",
      (resultat.blob.size / 1024).toFixed(2),
      "Ko"
    );

    // Télécharge exactement le même PDF
    telechargerPDF(resultat.blob);

    // Envoie exactement le même PDF par EmailJS
    await envoyerEmail(resultat.dataUri);

    console.log("✅ Contrat envoyé avec succès.");

    // Affiche la page de confirmation seulement après l'envoi
    goTo(4);

  } catch (err) {
    console.error("❌ Erreur :", err);

    al.textContent =
      "❌ Une erreur est survenue lors de l'envoi du contrat. Veuillez réessayer.";

    al.className = "alert error";
  }
}


// ══════════════════════════════════════════
// EMAIL VIA EMAILJS
// ══════════════════════════════════════════
function envoyerEmail(pdfDataUri) {

  emailjs.init({
    publicKey: 'IAD_jqwLE5Sz3kXcy'
  });

  // Pièce jointe EmailJS = base64 PUR (on retire le préfixe "data:application/pdf;base64,")
  var pdfBase64 = pdfDataUri.split(',')[1];

  var params = {

    // Nom affiché comme expéditeur
    name: 'Easy Fly Booking',

    // Informations du contrat
    contrat_num: contractNum,

    client_nom:
      document.getElementById('c-nom').value,

    client_tel:
      document.getElementById('c-tel').value,

    client_email:
      document.getElementById('c-email').value || 'Non renseigné',

    transport:
      document.getElementById('c-transport').value,

    depart:
      document.getElementById('c-depart').value,

    destination:
      document.getElementById('c-destination').value,

    date_voyage:
      formatDate(document.getElementById('c-date').value),

    passagers:
      document.getElementById('c-passagers').value,

    notes:
      document.getElementById('c-notes').value || 'Aucune',

    date_contrat:
      formatDate(new Date().toISOString().split('T')[0]),

    // ══════════════════════════════════════
    // PDF À ENVOYER EN PIÈCE JOINTE
    // ══════════════════════════════════════
    pdf_contrat: pdfBase64
  };

  return emailjs.send(
    'service_obp40rw',
    'template_a6juzbm',
    params
  );
}


// ══════════════════════════════════════════
// PDF GENERATION
// ══════════════════════════════════════════
function genererPDF() {

  var { jsPDF } = window.jspdf;

  var doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  var pw = 210;
  var ph = 297;

  var ml = 20;
  var mr = 20;
  var mt = 20;

  var cw = pw - ml - mr;
  var y = mt;


  // ══════════════════════════════════════
  // HEADER
  // ══════════════════════════════════════

  doc.setFillColor(10, 22, 40);
  doc.rect(0, 0, pw, 38, 'F');

  doc.setFillColor(232, 25, 44);
  doc.rect(0, 38, pw, 5, 'F');

  doc.setTextColor(255, 255, 255);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);

  doc.text(
    'EASY FLY BOOKING',
    ml,
    18
  );

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 200, 220);

  doc.text(
    'CONTRAT DE RESERVATION DE BILLET DE TRANSPORT',
    ml,
    26
  );

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);

  doc.text(
    'N° ' + contractNum,
    pw - mr,
    26,
    { align: 'right' }
  );

  doc.text(
    'Date : ' +
      formatDate(
        new Date().toISOString().split('T')[0]
      ),
    pw - mr,
    33,
    { align: 'right' }
  );


  y = 52;


  // ══════════════════════════════════════
  // INFORMATIONS CLIENT
  // ══════════════════════════════════════

  doc.setFillColor(244, 247, 255);

  doc.roundedRect(
    ml,
    y,
    cw,
    48,
    3,
    3,
    'F'
  );

  doc.setDrawColor(221, 228, 240);

  doc.roundedRect(
    ml,
    y,
    cw,
    48,
    3,
    3,
    'S'
  );


  var col1 = ml + 6;
  var col2 = ml + cw / 2 + 4;

  var iy = y + 10;


  var fields = [

    [
      'Client',
      document.getElementById('c-nom').value,
      'Transport',
      document.getElementById('c-transport').value
    ],

    [
      'Telephone',
      document.getElementById('c-tel').value,
      'Passagers',
      document.getElementById('c-passagers').value
    ],

    [
      'Depart',
      document.getElementById('c-depart').value,
      'Destination',
      document.getElementById('c-destination').value
    ],

    [
      'Date voyage',
      formatDate(
        document.getElementById('c-date').value
      ),
      'Email',
      document.getElementById('c-email').value || '—'
    ]

  ];


  fields.forEach(function(row) {

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(7);

    doc.setTextColor(
      107,
      122,
      153
    );

    doc.text(
      row[0].toUpperCase(),
      col1,
      iy
    );

    doc.text(
      row[2].toUpperCase(),
      col2,
      iy
    );


    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(9);

    doc.setTextColor(
      26,
      37,
      64
    );

    doc.text(
      row[1] || '—',
      col1,
      iy + 5
    );

    doc.text(
      row[3] || '—',
      col2,
      iy + 5
    );

    iy += 12;

  });


  y += 54;


  // ══════════════════════════════════════
  // NOTES
  // ══════════════════════════════════════

  var notes =
    document.getElementById('c-notes').value.trim();


  if (notes) {

    doc.setFontSize(7);

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setTextColor(
      107,
      122,
      153
    );

    doc.text(
      'REMARQUES',
      ml,
      y
    );

    y += 5;


    doc.setFontSize(8);

    doc.setFont(
      'helvetica',
      'normal'
    );

    doc.setTextColor(
      26,
      37,
      64
    );


    var noteLines =
      doc.splitTextToSize(
        notes,
        cw
      );


    doc.text(
      noteLines,
      ml,
      y
    );


    y +=
      noteLines.length * 4 + 6;

  }


  // ══════════════════════════════════════
  // SEPARATEUR
  // ══════════════════════════════════════

  doc.setDrawColor(
    221,
    228,
    240
  );

  doc.setLineWidth(0.5);

  doc.line(
    ml,
    y,
    pw - mr,
    y
  );

  y += 8;


  // ══════════════════════════════════════
  // CONDITIONS GENERALES
  // ══════════════════════════════════════

  doc.setFontSize(11);

  doc.setFont(
    'helvetica',
    'bold'
  );

  doc.setTextColor(
    0,
    87,
    184
  );

  doc.text(
    'CONDITIONS GENERALES DE RESERVATION',
    ml,
    y
  );

  y += 7;


  var articles = [

    [
      '1. OBJET DU CONTRAT',
      'Le present contrat a pour objet la reservation de billets de train, d\'avions ou de bateaux pour le Client par EASY FLY BOOKING.'
    ],

    [
      '2. SERVICES FOURNIS',
      'EASY FLY BOOKING s\'engage a : Reserver les billets de train, d\'avion ou de bateau selon les preferences du Client. Informer le Client des options disponibles. Gerer les remboursements de maniere simple et efficace.'
    ],

    [
      '3. REMUNERATION',
      'Le Client accepte de rembourser le montant des billets reserves, auquel s\'ajoute une majoration de 18,5% pour le service. Si le Client annule son depart alors que le billet a deja ete reserve, il s\'engage a rembourser la totalite du montant exact du billet sans rajout des frais.'
    ],

    [
      '4. ACCORD DU CLIENT',
      'Le Client donne son accord par telephone pour chaque reservation effectuee. Toute reservation confirmee par le Client est consideree comme acceptee.'
    ],

    [
      '5. RESILIATION',
      'Le Client peut resilier le present contrat a tout moment en informant EASY FLY BOOKING par ecrit.'
    ]

  ];


  articles.forEach(function(a) {

    if (y > ph - 60) {
      doc.addPage();
      y = 20;
    }


    doc.setFontSize(8);

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setTextColor(
      26,
      37,
      64
    );

    doc.text(
      a[0],
      ml,
      y
    );

    y += 4;


    doc.setFont(
      'helvetica',
      'normal'
    );

    doc.setTextColor(
      80,
      90,
      110
    );


    var articleLines =
      doc.splitTextToSize(
        a[1],
        cw
      );


    doc.text(
      articleLines,
      ml,
      y
    );


    y +=
      articleLines.length * 4 + 4;

  });


  y += 4;


  // ══════════════════════════════════════
  // SIGNATURE
  // ══════════════════════════════════════

  if (y > ph - 55) {
    doc.addPage();
    y = 20;
  }


  doc.setDrawColor(
    221,
    228,
    240
  );

  doc.line(
    ml,
    y,
    pw - mr,
    y
  );

  y += 8;


  doc.setFontSize(8);

  doc.setFont(
    'helvetica',
    'bold'
  );

  doc.setTextColor(
    107,
    122,
    153
  );

  doc.text(
    'SIGNATURE DU CLIENT',
    ml,
    y
  );

  y += 4;


  doc.setFontSize(7);

  doc.setFont(
    'helvetica',
    'normal'
  );

  doc.setTextColor(
    150,
    160,
    180
  );

  doc.text(
    'En signant, le client atteste avoir lu et accepte les conditions generales.',
    ml,
    y
  );

  y += 6;


  // ══════════════════════════════════════
  // IMAGE DE SIGNATURE
  // ══════════════════════════════════════

  if (signatureData) {

    doc.setFillColor(
      244,
      247,
      255
    );

    doc.roundedRect(
      ml,
      y,
      80,
      30,
      2,
      2,
      'F'
    );

    doc.setDrawColor(
      221,
      228,
      240
    );

    doc.roundedRect(
      ml,
      y,
      80,
      30,
      2,
      2,
      'S'
    );


    doc.addImage(
      signatureData,
      'JPEG',
      ml + 2,
      y + 1,
      76,
      28
    );


    y += 32;

  }


  doc.setFontSize(7);

  doc.setFont(
    'helvetica',
    'normal'
  );

  doc.setTextColor(
    107,
    122,
    153
  );


  doc.text(
    'Signe electroniquement le ' +
      formatDate(
        new Date().toISOString().split('T')[0]
      ),
    ml,
    y
  );


  doc.text(
    'Par : ' +
      document.getElementById('c-nom').value,
    ml,
    y + 4
  );


  // ══════════════════════════════════════
  // FOOTER
  // ══════════════════════════════════════

  doc.setFillColor(
    10,
    22,
    40
  );

  doc.rect(
    0,
    ph - 14,
    pw,
    14,
    'F'
  );


  doc.setTextColor(
    120,
    140,
    170
  );

  doc.setFontSize(7);


  doc.text(
    'Easy Fly Booking  |  Tel: +241 77 06 57 83  |  eflybooking@gmail.com',
    pw / 2,
    ph - 7,
    { align: 'center' }
  );


  // ══════════════════════════════════════
  // CREATION DU BLOB PDF
  // ══════════════════════════════════════

  var pdfBlob = doc.output('blob');

  // Data URI Base64 pour EmailJS
  var pdfDataUri = doc.output('datauristring');


  return {
    blob: pdfBlob,
    dataUri: pdfDataUri,
    doc: doc
  };
}


// ══════════════════════════════════════════
// TELECHARGEMENT DU PDF
// ══════════════════════════════════════════
function telechargerPDF(pdfBlob) {

  var blobUrl =
    URL.createObjectURL(pdfBlob);


  var dlLink =
    document.createElement('a');


  dlLink.href = blobUrl;

  dlLink.download =
    'Contrat-EasyFlyBooking-' +
    contractNum +
    '.pdf';


  dlLink.style.display = 'none';


  document.body.appendChild(
    dlLink
  );


  dlLink.click();


  setTimeout(function() {

    document.body.removeChild(
      dlLink
    );

    URL.revokeObjectURL(
      blobUrl
    );

  }, 2000);
}

/* =========================================================
   HELPERS
   ========================================================= */

function formatDate(d) {

  if (!d) {
    return '—';
  }

  var p = d.split('-');

  return p[2] + '/' + p[1] + '/' + p[0];
}
