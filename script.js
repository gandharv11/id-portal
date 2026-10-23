// Clean Portrait Placeholder Generator (Neutral silhouette for ID Card preview & Orange avatar for header pill)
function createDefaultAvatar(name, styleType = "silhouette") {
  if (styleType === "pill") {
    const svgPill = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="60" fill="#FDE6D5"/>
      <circle cx="60" cy="44" r="20" fill="#F36F21"/>
      <path d="M24 104c4-22 22-34 36-34s32 12 36 34" fill="#F36F21"/>
    </svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svgPill);
  }

  const svgSilhouette = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="200" viewBox="0 0 180 200">
    <rect width="180" height="200" fill="#E9EEF4"/>
    <circle cx="90" cy="76" r="28" fill="#334E68"/>
    <path d="M38 172c6-30 28-46 52-46s46 16 52 46" fill="#334E68"/>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svgSilhouette);
}

// 11 LPU & Campus ID Card Service FAQs
const campusFaqs = [
  {
    q: "1. Where do I collect my physical ID card once the status shows Ready for Pickup?",
    a: "Students can collect their printed identity card from the ID Card Service Cell at the Division of Student Administration (Block 30 Counter) by showing their Registration Number and Request ID."
  },
  {
    q: "2. What are the applicable fees for New, Correction, and Replacement ID cards?",
    a: "First-time New Admission ID cards carry no fee (Rs. 0). Details Correction requests require a processing fee of Rs. 100, and Lost or Damaged Replacement cards require a fee of Rs. 250."
  },
  {
    q: "3. Can a student manually change their processing status after submitting a request?",
    a: "No. Once an application is submitted, status progression is strictly read-only for students. Only an authenticated ID Cell Officer can update the stage after verifying university records."
  },
  {
    q: "4. What is the procedure if I lose my original campus ID card inside or outside the university?",
    a: "Submit a Replacement request on this portal, complete the Rs. 250 fee payment in the Fee Payment Ledger tab, and provide a signed undertaking at the campus security desk during card collection."
  },
  {
    q: "5. How do I update my residential status from Day Scholar to Hostel Resident or change my hostel block?",
    a: "Select the Details Correction category, select your updated residential status in the Blood Group & Residential Status field, and specify your new hostel block in the details box."
  },
  {
    q: "6. Will my replacement or corrected ID card work at the main gate and hostel turnstiles?",
    a: "Yes. When the ID Cell Officer marks your card as Ready for Pickup or Completed, the new barcode and RFID serial are synchronized with campus security turnstiles and library scanners."
  },
  {
    q: "7. What happens if a student visits the ID Cell desk physically without knowing how to apply online?",
    a: "The ID Cell Officer can log the application directly on the student's behalf using the Physical Walk-In Desk Entry tab, verify physical documents on the spot, and record counter fee collection."
  },
  {
    q: "8. What are the photo guidelines when uploading a portrait for the ID card?",
    a: "Upload a clear, front-facing passport-style portrait (JPG or PNG, maximum 2MB) in formal or collared campus attire against a plain background."
  },
  {
    q: "9. How long does the ID Cell take to verify and print a submitted card request?",
    a: "Standard verification takes 24 to 48 working hours. Students can monitor real-time progress across the four stages (Submitted, Under Verification, Ready for Pickup, and Completed)."
  },
  {
    q: "10. Can I use the Virtual Identity Card Preview for entry while my physical card is being processed?",
    a: "The virtual card preview verifies your layout and printed particulars. For physical gate entry prior to pickup, carry your provisional registration slip along with your active Request ID."
  },
  {
    q: "11. How do I contact the helpdesk if my UPI fee payment is deducted but not updated?",
    a: "Click the Contact Support Desk button in the top navigation bar to initiate a direct WhatsApp chat or voice call with the ID Cell support desk."
  }
];

// Initial Sample Records
const initialRequests = [
  {
    id: "REQ-1001",
    studentName: "Aarav Sharma",
    regNo: "12304567",
    department: "B. Tech CSE",
    bloodHostel: "O+  |  Hostel Resident",
    mobile: "9876543210",
    requestType: "Correction",
    status: "Under Verification",
    feeAmount: 100,
    feeStatus: "Paid Online",
    source: "Student Online Portal",
    details: "Update residential allotment from BH-2 to BH-4 and verify blood group.",
    remarks: "Hostel allotment record cross-checked with warden register.",
    date: "2026-10-21",
    photo: createDefaultAvatar("Aarav Sharma")
  },
  {
    id: "REQ-1002",
    studentName: "Ananya Nair",
    regNo: "12301120",
    department: "BCA / MCA",
    bloodHostel: "B+  |  Hostel Resident",
    mobile: "9811223344",
    requestType: "Replacement",
    status: "Ready for Pickup",
    feeAmount: 250,
    feeStatus: "Pending",
    source: "Student Online Portal",
    details: "Lost original identity card near Central Library.",
    remarks: "Card printed. Clear Rs. 250 fee to collect from Counter 2.",
    date: "2026-10-20",
    photo: createDefaultAvatar("Ananya Nair")
  },
  {
    id: "REQ-1003",
    studentName: "Kabir Gill",
    regNo: "12405519",
    department: "BBA / MBA",
    bloodHostel: "A+  |  Day Scholar",
    mobile: "9988776655",
    requestType: "New ID Card",
    status: "Completed",
    feeAmount: 0,
    feeStatus: "No Fee Required",
    source: "Physical Walk-In Desk",
    details: "Student visited administrative desk physically for first-year ID card.",
    remarks: "Issued and handed over signed card to student.",
    date: "2026-10-18",
    photo: createDefaultAvatar("Kabir Gill")
  }
];

let requests = JSON.parse(localStorage.getItem("campusIdRecords_v3")) || initialRequests;
let currentUser = JSON.parse(localStorage.getItem("campusActiveUser_v3")) || null;

let selectedRole = "student";
let linkedGoogleEmail = "";
let generatedOtp = "";
let isOtpVerified = false;

let currentStudentPhotoData = "";
let currentWalkinPhotoData = "";

function saveRequests() {
  localStorage.setItem("campusIdRecords_v3", JSON.stringify(requests));
}

// Skeleton Loader Helper
function showSkeletonBriefly(callback) {
  const skel = document.getElementById("skeletonLoader");
  skel.classList.remove("hidden");
  setTimeout(() => {
    skel.classList.add("hidden");
    if (callback) callback();
  }, 160);
}

// Render 11 FAQs into both Student and Officer FAQ tabs
function renderFaqs() {
  const html = campusFaqs.map(item => `
    <div class="faq-item">
      <h4>${item.q}</h4>
      <p>${item.a}</p>
    </div>
  `).join("");
  document.getElementById("faqContainerStudent").innerHTML = html;
  document.getElementById("faqContainerOfficer").innerHTML = html;
}

// ==================== AUTHENTICATION & OTP LOGIC ====================
window.selectLoginRole = function (role) {
  selectedRole = role;
  document.getElementById("roleStudentBtn").classList.toggle("active", role === "student");
  document.getElementById("roleOfficerBtn").classList.toggle("active", role === "officer");
  document.getElementById("loginRegGroup").classList.toggle("hidden", role === "officer");
};

window.openGoogleModal = function () {
  document.getElementById("customGoogleEmail").value = "";
  document.getElementById("googleModal").classList.remove("hidden");
};

window.closeGoogleModal = function () {
  document.getElementById("googleModal").classList.add("hidden");
};

window.useCustomGoogleAccount = function () {
  const emailInput = document.getElementById("customGoogleEmail").value.trim();
  if (!emailInput || !emailInput.includes("@")) {
    alert("Please enter a valid Google email address.");
    return;
  }
  linkedGoogleEmail = emailInput;
  document.getElementById("googleBtnText").textContent = "Google Account Linked (Verified)";
  const badge = document.getElementById("linkedEmailText");
  badge.textContent = "Linked Google Account: " + emailInput;
  badge.classList.remove("hidden");
  closeGoogleModal();
};

window.sendOtp = function () {
  const mobile = document.getElementById("loginMobile").value.trim();
  if (!/^\d{10}$/.test(mobile)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }
  generatedOtp = String(Math.floor(1000 + Math.random() * 9000));
  isOtpVerified = false;

  document.getElementById("smsOtpCode").textContent = generatedOtp;
  document.getElementById("smsBanner").classList.remove("hidden");
  document.getElementById("otpInputGroup").classList.remove("hidden");
  document.getElementById("otpStatusText").textContent = "Verification code dispatched to +91 " + mobile;
};

window.autoFillOtp = function () {
  document.getElementById("loginOtp").value = generatedOtp;
  verifyOtp();
  document.getElementById("smsBanner").classList.add("hidden");
};

window.verifyOtp = function () {
  const entered = document.getElementById("loginOtp").value.trim();
  if (entered === generatedOtp && generatedOtp !== "") {
    isOtpVerified = true;
    document.getElementById("otpStatusText").textContent = "Status: Mobile Number Verified via OTP";
    document.getElementById("smsBanner").classList.add("hidden");
  } else {
    alert("Incorrect OTP code. Use the code displayed in the top notification bar: " + generatedOtp);
  }
};

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!linkedGoogleEmail) {
    alert("Please complete Step 1: Sign in with your Google Account.");
    return;
  }
  if (!isOtpVerified) {
    alert("Please click Send OTP and verify your mobile number.");
    return;
  }

  const name = document.getElementById("loginName").value.trim();
  const mobile = document.getElementById("loginMobile").value.trim();
  const regNo = selectedRole === "student"
    ? (document.getElementById("loginRegNo").value.trim() || "12621448")
    : "ID-CELL-OFFICER";

  currentUser = {
    name,
    email: linkedGoogleEmail,
    mobile,
    regNo,
    role: selectedRole,
    avatar: createDefaultAvatar(name, "pill")
  };

  localStorage.setItem("campusActiveUser_v3", JSON.stringify(currentUser));
  showSkeletonBriefly(launchPortalForUser);
});

// ==================== PORTAL INITIALIZATION & ROLE SWITCHING ====================
function launchPortalForUser() {
  if (!currentUser) {
    document.getElementById("authSection").classList.remove("hidden");
    document.getElementById("studentPortal").classList.add("hidden");
    document.getElementById("officerPortal").classList.add("hidden");
    document.getElementById("navProfilePill").classList.add("hidden");
    document.getElementById("quickSwitchBtn").classList.add("hidden");
    return;
  }

  document.getElementById("authSection").classList.add("hidden");
  document.getElementById("navProfilePill").classList.remove("hidden");
  document.getElementById("quickSwitchBtn").classList.remove("hidden");

  const pillAvatar = createDefaultAvatar(currentUser.name, "pill");
  document.getElementById("navAvatar").src = pillAvatar;
  document.getElementById("navUserName").textContent = currentUser.name;
  document.getElementById("navUserRole").textContent =
    currentUser.role === "officer" ? "ID Cell Officer" : "Student";

  const switchSpan = document.getElementById("quickSwitchText");
  if (switchSpan) {
    switchSpan.textContent =
      currentUser.role === "student" ? "Switch to Officer View" : "Switch to Student View";
  }

  document.getElementById("profModalAvatar").src = pillAvatar;
  document.getElementById("profModalName").textContent = currentUser.name;
  document.getElementById("profModalRole").textContent =
    currentUser.role === "officer" ? "ID CELL OFFICER" : "STUDENT";
  document.getElementById("profModalEmail").textContent = currentUser.email;
  document.getElementById("profModalMobile").textContent = "+91 " + currentUser.mobile;
  document.getElementById("profModalReg").textContent = currentUser.regNo;

  if (currentUser.role === "student") {
    document.getElementById("studentPortal").classList.remove("hidden");
    document.getElementById("officerPortal").classList.add("hidden");

    document.getElementById("stuName").value = currentUser.name;
    document.getElementById("stuRegNo").value = currentUser.regNo;
    document.getElementById("previewMobile").textContent = currentUser.mobile;
    updateLiveIdPreview();
    renderStudentRequests();
    renderStudentPayments();
  } else {
    document.getElementById("studentPortal").classList.add("hidden");
    document.getElementById("officerPortal").classList.remove("hidden");
    renderOfficerRequests();
  }
}

window.quickSwitchRole = function () {
  if (!currentUser) return;
  currentUser.role = currentUser.role === "student" ? "officer" : "student";
  localStorage.setItem("campusActiveUser_v3", JSON.stringify(currentUser));
  showSkeletonBriefly(launchPortalForUser);
};

window.logoutUser = function () {
  localStorage.removeItem("campusActiveUser_v3");
  currentUser = null;
  linkedGoogleEmail = "";
  isOtpVerified = false;
  document.getElementById("loginForm").reset();
  document.getElementById("linkedEmailText").classList.add("hidden");
  document.getElementById("otpInputGroup").classList.add("hidden");
  document.getElementById("googleBtnText").textContent = "Sign in with Google Account";
  document.getElementById("profileModal").classList.add("hidden");
  launchPortalForUser();
};

// ==================== PHOTO UPLOAD, VALIDATION & VIRTUAL ID CARD ====================
window.handlePhotoUpload = function (event, mode) {
  const file = event.target.files[0];
  const helper = document.getElementById("fileErrorText");
  const fileNameSpan = document.getElementById("fileNameDisplay");

  if (!file) return;

  // Validate 2MB Max File Size
  const maxBytes = 2 * 1024 * 1024;
  if (file.size > maxBytes) {
    if (mode === "student" && helper) {
      helper.textContent = "File exceeds 2MB limit. Please select a smaller JPG or PNG image.";
      helper.classList.add("error");
    } else {
      alert("File exceeds 2MB limit. Please choose a JPG or PNG under 2MB.");
    }
    event.target.value = "";
    return;
  }

  if (mode === "student" && helper) {
    helper.textContent = "JPG, PNG (Max 2MB)";
    helper.classList.remove("error");
    if (fileNameSpan) fileNameSpan.textContent = file.name;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    if (mode === "student") {
      currentStudentPhotoData = e.target.result;
      updateLiveIdPreview();
    } else {
      currentWalkinPhotoData = e.target.result;
    }
  };
  reader.readAsDataURL(file);
};

window.clearStudentPhoto = function () {
  const fileInput = document.getElementById("stuPhotoInput");
  const fileNameSpan = document.getElementById("fileNameDisplay");
  const helper = document.getElementById("fileErrorText");

  if (fileInput) fileInput.value = "";
  currentStudentPhotoData = "";
  if (fileNameSpan) fileNameSpan.textContent = "No file chosen";
  if (helper) {
    helper.textContent = "JPG, PNG (Max 2MB)";
    helper.classList.remove("error");
  }
  updateLiveIdPreview();
};

window.resetStudentApplicationForm = function () {
  const form = document.getElementById("studentRequestForm");
  if (form) form.reset();

  if (currentUser && currentUser.role === "student") {
    document.getElementById("stuName").value = currentUser.name;
    document.getElementById("stuRegNo").value = currentUser.regNo;
  }
  clearStudentPhoto();
  updateFeeHint();
  updateLiveIdPreview();
};

window.updateLiveIdPreview = function () {
  const name = document.getElementById("stuName").value.trim() || "Student Name";
  const regNo = document.getElementById("stuRegNo").value.trim() || "12621448";
  const course = document.getElementById("stuCourse").value;
  const blood = document.getElementById("stuBlood").value.trim() || "O+  |  Hostel Resident";

  document.getElementById("previewName").textContent = name;
  document.getElementById("previewReg").textContent = regNo;
  document.getElementById("previewCourse").textContent = course;
  document.getElementById("previewBlood").textContent = blood;
  document.getElementById("previewPhoto").src =
    currentStudentPhotoData || createDefaultAvatar(name, "silhouette");
};

window.updateFeeHint = function () {
  const type = document.getElementById("stuReqType").value;
  const box = document.getElementById("feeNoticeBox");
  if (type === "New ID Card") {
    box.textContent = "Applicable Fee: Rs. 0 (Standard First-Issue Student Identity Card)";
  } else if (type === "Correction") {
    box.textContent = "Applicable Fee: Rs. 100 (Payable in Fee Payment Ledger after submission)";
  } else {
    box.textContent = "Applicable Fee: Rs. 250 (Lost or Damaged Card Replacement Charge)";
  }
};

// ==================== STUDENT PORTAL ACTIONS ====================
window.switchStudentTab = function (tab) {
  document.getElementById("studentApplyTab").classList.toggle("hidden", tab !== "apply");
  document.getElementById("studentTrackTab").classList.toggle("hidden", tab !== "track");
  document.getElementById("studentPaymentsTab").classList.toggle("hidden", tab !== "payments");
  document.getElementById("studentFaqTab").classList.toggle("hidden", tab !== "faq");

  const buttons = document.querySelectorAll("#studentPortal .tab-btn");
  buttons[0].classList.toggle("active", tab === "apply");
  buttons[1].classList.toggle("active", tab === "track");
  buttons[2].classList.toggle("active", tab === "payments");
  buttons[3].classList.toggle("active", tab === "faq");

  if (tab === "track") renderStudentRequests();
  if (tab === "payments") renderStudentPayments();
};

document.getElementById("studentRequestForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const studentName = document.getElementById("stuName").value.trim();
  const regNo = document.getElementById("stuRegNo").value.trim();
  const department = document.getElementById("stuCourse").value;
  const bloodHostel = document.getElementById("stuBlood").value.trim();
  const requestType = document.getElementById("stuReqType").value;
  const details = document.getElementById("stuDetails").value.trim();

  const feeAmount = requestType === "New ID Card" ? 0 : requestType === "Correction" ? 100 : 250;

  const newReq = {
    id: "REQ-" + Math.floor(1000 + Math.random() * 9000),
    studentName,
    regNo,
    department,
    bloodHostel,
    mobile: currentUser ? currentUser.mobile : "9876543210",
    requestType,
    status: "Submitted",
    feeAmount,
    feeStatus: feeAmount === 0 ? "No Fee Required" : "Pending",
    source: "Student Online Portal",
    details,
    remarks: "Application logged. Awaiting ID Cell Officer verification.",
    date: new Date().toISOString().split("T")[0],
    photo: currentStudentPhotoData || createDefaultAvatar(studentName, "silhouette")
  };

  requests.unshift(newReq);
  saveRequests();
  document.getElementById("stuDetails").value = "";
  alert("Application " + newReq.id + " submitted. Status is managed by the ID Cell Officer.");
  switchStudentTab("track");
});

function getProgressMetrics(status) {
  if (status === "Submitted") return { pct: "25%", color: "#F36F21" };
  if (status === "Under Verification") return { pct: "50%", color: "#102A43" };
  if (status === "Ready for Pickup") return { pct: "75%", color: "#0284C7" };
  return { pct: "100%", color: "#15803D" };
}

function renderStudentRequests() {
  const container = document.getElementById("studentRequestsList");
  container.innerHTML = requests.map(req => {
    const prog = getProgressMetrics(req.status);
    const isCompleted = req.status === "Completed";

    return `
      <div class="request-card">
        <div class="req-header">
          <div class="req-user-info">
            <img src="${req.photo}" alt="ID Photo" class="req-thumb" />
            <div>
              <strong>${req.studentName} (${req.regNo})</strong>
              <div style="font-size:0.8rem; color:#64748B;">
                Request ID: ${req.id} | Program: ${req.department} | Info: ${req.bloodHostel || "N/A"} | Date: ${req.date}
              </div>
            </div>
          </div>
          <div>
            <span class="badge ${isCompleted ? 'badge-completed' : 'badge-incomplete'}">
              Status: ${req.status}
            </span>
          </div>
        </div>

        <p style="margin:12px 0; font-size:0.86rem; background-color:#F5F6F7; padding:10px 12px; border:1px solid #E2E8F0; border-radius:6px;">
          <strong>Category:</strong> ${req.requestType} |
          <strong>Details:</strong> ${req.details}
        </p>

        <div>
          <div style="display:flex; justify-content:space-between; font-size:0.78rem; font-weight:500;">
            <span>Processing Stage (Updated by ID Cell Officer): ${req.status}</span>
            <span>${prog.pct}</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width:${prog.pct}; background-color:${prog.color};"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:#64748B;">
            <span>1. Submitted</span>
            <span>2. Under Verification</span>
            <span>3. Ready for Pickup</span>
            <span>4. Completed</span>
          </div>
        </div>

        <div style="margin-top:12px; font-size:0.82rem; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
          <span><strong>Officer Remark:</strong> ${req.remarks || "Pending review"}</span>
          <span><strong>Fee Status:</strong> ${req.feeStatus} ${req.feeAmount > 0 ? '(Rs. ' + req.feeAmount + ')' : ''}</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderStudentPayments() {
  const container = document.getElementById("studentPaymentsList");
  const payable = requests.filter(r => r.feeAmount > 0);

  if (payable.length === 0) {
    container.innerHTML = `<p class="subtext">No chargeable requests found in your ledger.</p>`;
    return;
  }

  container.innerHTML = payable.map(req => `
    <div class="request-card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <strong>${req.id} : ${req.requestType} (${req.studentName})</strong>
        <div style="font-size:0.82rem; color:#64748B;">Fee Amount: Rs. ${req.feeAmount} | Current Status: <strong>${req.feeStatus}</strong></div>
      </div>
      ${
        req.feeStatus === "Pending"
          ? `<button type="button" class="btn-primary" onclick="payFeeOnline('${req.id}')">Pay Rs. ${req.feeAmount} Online</button>`
          : `<span class="badge badge-completed">Settled (${req.feeStatus})</span>`
      }
    </div>
  `).join("");
}

window.payFeeOnline = function (id) {
  const req = requests.find(r => r.id === id);
  if (!req) return;
  req.feeStatus = "Paid Online (UPI Verified)";
  saveRequests();
  alert("Payment of Rs. " + req.feeAmount + " recorded for " + req.id + ".");
  renderStudentPayments();
  renderStudentRequests();
};

// ==================== ID CELL OFFICER PORTAL ACTIONS ====================
window.switchOfficerTab = function (tab) {
  document.getElementById("officerManageTab").classList.toggle("hidden", tab !== "manage");
  document.getElementById("officerWalkinTab").classList.toggle("hidden", tab !== "walkin");
  document.getElementById("officerFaqTab").classList.toggle("hidden", tab !== "faq");

  const buttons = document.querySelectorAll("#officerPortal .tab-btn");
  buttons[0].classList.toggle("active", tab === "manage");
  buttons[1].classList.toggle("active", tab === "walkin");
  buttons[2].classList.toggle("active", tab === "faq");
};

window.triggerFilteredRender = function () {
  showSkeletonBriefly(renderOfficerRequests);
};

function updateOfficerSummary() {
  document.getElementById("oTotalCount").textContent = requests.length;
  document.getElementById("oIncompleteCount").textContent = requests.filter(r => r.status !== "Completed").length;
  document.getElementById("oReadyCount").textContent = requests.filter(r => r.status === "Ready for Pickup").length;
  document.getElementById("oCompletedCount").textContent = requests.filter(r => r.status === "Completed").length;
}

window.renderOfficerRequests = function () {
  updateOfficerSummary();

  const query = document.getElementById("officerSearch").value.toLowerCase().trim();
  const recordFilter = document.getElementById("officerRecordFilter").value;
  const catFilter = document.getElementById("officerCategoryFilter").value;

  const filtered = requests.filter(req => {
    const matchesSearch =
      req.studentName.toLowerCase().includes(query) ||
      req.regNo.toLowerCase().includes(query) ||
      req.id.toLowerCase().includes(query);

    const matchesCat = catFilter === "All" || req.requestType === catFilter;

    let matchesStatus = true;
    if (recordFilter === "Incomplete") matchesStatus = req.status !== "Completed";
    else if (recordFilter === "Completed") matchesStatus = req.status === "Completed";
    else if (recordFilter !== "All") matchesStatus = req.status === recordFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const container = document.getElementById("officerRequestsList");
  if (filtered.length === 0) {
    container.innerHTML = `<p class="subtext">No student records match the selected filter criteria.</p>`;
    return;
  }

  container.innerHTML = filtered.map(req => {
    const prog = getProgressMetrics(req.status);
    const isCompleted = req.status === "Completed";

    return `
      <div class="request-card">
        <div class="req-header">
          <div class="req-user-info">
            <img src="${req.photo}" alt="Student" class="req-thumb" />
            <div>
              <strong>${req.studentName}</strong> <span>(${req.regNo})</span>
              <div style="font-size:0.8rem; color:#64748B;">
                <strong>${req.id}</strong> | ${req.department} | Mobile: ${req.mobile || "N/A"} | Channel: ${req.source}
              </div>
            </div>
          </div>

          <div>
            <span class="badge ${isCompleted ? 'badge-completed' : 'badge-incomplete'}">
              ${isCompleted ? 'Record: Completed' : 'Record: Incomplete (' + req.status + ')'}
            </span>
          </div>
        </div>

        <p style="margin:12px 0; font-size:0.85rem; background-color:#F5F6F7; padding:10px 12px; border:1px solid #E2E8F0; border-radius:6px;">
          <strong>Category:</strong> ${req.requestType} |
          <strong>Fee Status:</strong> ${req.feeStatus} |
          <strong>Particulars:</strong> ${req.details}
        </p>

        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width:${prog.pct}; background-color:${prog.color};"></div>
        </div>

        <div class="officer-controls">
          <div style="flex:1; min-width:190px;">
            <label>UPDATE PROCESSING STAGE</label>
            <select onchange="officerChangeStatus('${req.id}', this.value)">
              <option value="Submitted" ${req.status === "Submitted" ? "selected" : ""}>Submitted</option>
              <option value="Under Verification" ${req.status === "Under Verification" ? "selected" : ""}>Under Verification</option>
              <option value="Ready for Pickup" ${req.status === "Ready for Pickup" ? "selected" : ""}>Ready for Pickup</option>
              <option value="Completed" ${req.status === "Completed" ? "selected" : ""}>Completed (Issued)</option>
            </select>
          </div>

          <div style="flex:2; min-width:220px;">
            <label>OFFICER VERIFICATION REMARK</label>
            <div class="input-with-btn">
              <input type="text" id="remark-${req.id}" value="${req.remarks || ""}" placeholder="Enter verification note..." />
              <button type="button" class="btn-secondary" onclick="officerSaveRemark('${req.id}')">Save Note</button>
            </div>
          </div>

          <div style="display:flex; gap:8px;">
            <button type="button" class="btn-secondary" onclick="officerEditRecord('${req.id}')">Edit</button>
            <button type="button" class="btn-danger" onclick="officerDeleteRecord('${req.id}')">Delete</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
};

window.officerChangeStatus = function (id, newStatus) {
  const req = requests.find(r => r.id === id);
  if (req) {
    req.status = newStatus;
    saveRequests();
    renderOfficerRequests();
  }
};

window.officerSaveRemark = function (id) {
  const req = requests.find(r => r.id === id);
  const input = document.getElementById("remark-" + id);
  if (req && input) {
    req.remarks = input.value.trim();
    saveRequests();
    alert("Verification note saved for " + id + ".");
  }
};

window.officerDeleteRecord = function (id) {
  requests = requests.filter(r => r.id !== id);
  saveRequests();
  renderOfficerRequests();
};

document.getElementById("officerWalkinForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const editId = document.getElementById("editRecordId").value;
  const studentName = document.getElementById("wName").value.trim();
  const regNo = document.getElementById("wRegNo").value.trim();
  const department = document.getElementById("wCourse").value;
  const mobile = document.getElementById("wMobile").value.trim();
  const requestType = document.getElementById("wReqType").value;
  const status = document.getElementById("wStatus").value;
  const feeStatus = document.getElementById("wFeeStatus").value;
  const details = document.getElementById("wDetails").value.trim();
  const feeAmount = requestType === "New ID Card" ? 0 : requestType === "Correction" ? 100 : 250;

  if (editId) {
    const idx = requests.findIndex(r => r.id === editId);
    if (idx !== -1) {
      requests[idx] = {
        ...requests[idx],
        studentName,
        regNo,
        department,
        mobile,
        requestType,
        status,
        feeStatus,
        details,
        photo: currentWalkinPhotoData || requests[idx].photo
      };
    }
    cancelOfficerEdit();
  } else {
    const walkinReq = {
      id: "REQ-" + Math.floor(1000 + Math.random() * 9000),
      studentName,
      regNo,
      department,
      bloodHostel: "O+  |  Verified at Counter",
      mobile,
      requestType,
      status,
      feeAmount,
      feeStatus,
      source: "Physical Walk-In Desk (Officer Logged)",
      details,
      remarks: "Logged directly by ID Cell Officer during physical desk visit.",
      date: new Date().toISOString().split("T")[0],
      photo: currentWalkinPhotoData || createDefaultAvatar(studentName, "silhouette")
    };
    requests.unshift(walkinReq);
  }

  currentWalkinPhotoData = "";
  saveRequests();
  document.getElementById("officerWalkinForm").reset();
  switchOfficerTab("manage");
  renderOfficerRequests();
});

window.officerEditRecord = function (id) {
  const req = requests.find(r => r.id === id);
  if (!req) return;

  switchOfficerTab("walkin");
  document.getElementById("walkinFormTitle").textContent = "Edit Student Request Record (" + req.id + ")";
  document.getElementById("editRecordId").value = req.id;
  document.getElementById("wName").value = req.studentName;
  document.getElementById("wRegNo").value = req.regNo;
  document.getElementById("wCourse").value = req.department;
  document.getElementById("wMobile").value = req.mobile || "";
  document.getElementById("wReqType").value = req.requestType;
  document.getElementById("wStatus").value = req.status;
  document.getElementById("wDetails").value = req.details;

  document.getElementById("walkinSubmitBtn").textContent = "Save Updated Record";
  document.getElementById("walkinCancelBtn").classList.remove("hidden");
};

window.cancelOfficerEdit = function () {
  document.getElementById("editRecordId").value = "";
  document.getElementById("walkinFormTitle").textContent = "Physical Walk-In Student Request Entry";
  document.getElementById("walkinSubmitBtn").textContent = "Record Walk-In Application";
  document.getElementById("walkinCancelBtn").classList.add("hidden");
  document.getElementById("officerWalkinForm").reset();
};

// ==================== CONTACT, PROFILE & LEGAL MODALS ====================
window.openContactModal = function () {
  document.getElementById("contactModal").classList.remove("hidden");
};

window.closeContactModal = function () {
  document.getElementById("contactModal").classList.add("hidden");
};

window.toggleProfileModal = function () {
  document.getElementById("profileModal").classList.toggle("hidden");
};

window.openLegalModal = function (type) {
  const title = document.getElementById("legalModalTitle");
  const body = document.getElementById("legalModalBody");

  if (type === "tos") {
    title.textContent = "Terms of Service";
    body.innerHTML = `
      <p><strong>1. Official Identity Usage:</strong> This portal is designated for registered university students and authorized ID Cell Officers to process New, Replacement, and Correction identity card applications.</p>
      <p><strong>2. Accuracy of Particulars:</strong> Students must submit accurate registration numbers, residential details, and formal portrait photographs. Submitting falsified records is subject to disciplinary action.</p>
      <p><strong>3. Status Authority:</strong> Application processing stages are controlled exclusively by the ID Cell verification desk.</p>
    `;
  } else {
    title.textContent = "Privacy Policy";
    body.innerHTML = `
      <p><strong>1. Data Collection:</strong> We collect student name, registration number, program, mobile number, Google email address, and portrait photograph solely for generating and verifying university identity cards.</p>
      <p><strong>2. Access Control:</strong> Submitted records are restricted to the applicant and authorized ID Cell Officers.</p>
      <p><strong>3. Storage:</strong> For demonstration and evaluation purposes, records are persisted in browser storage and are not transmitted to third-party marketing services.</p>
    `;
  }
  document.getElementById("legalModal").classList.remove("hidden");
};

window.closeLegalModal = function () {
  document.getElementById("legalModal").classList.add("hidden");
};

// Initialize FAQs and Portal State
renderFaqs();
launchPortalForUser();