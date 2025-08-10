// Application Data
let appData = {
  doctors: [
    {
      id: 1,
      name: "Dr. Sarah Smith",
      gender: "Female",
      specialization: "General Practice",
      availability: "Available",
      nextAvailable: "Now",
      location: "Room 101"
    },
    {
      id: 2,
      name: "Dr. Michael Johnson",
      gender: "Male",
      specialization: "Pediatrics",
      availability: "Busy",
      nextAvailable: "2:30 PM",
      location: "Room 102"
    },
    {
      id: 3,
      name: "Dr. Emily Lee",
      gender: "Female",
      specialization: "Cardiology",
      availability: "Available",
      nextAvailable: "Tomorrow 9:00 AM",
      location: "Room 201"
    },
    {
      id: 4,
      name: "Dr. David Patel",
      gender: "Male",
      specialization: "Dermatology",
      availability: "Available",
      nextAvailable: "Now",
      location: "Room 103"
    }
  ],
  queuePatients: [
    {
      id: 1,
      queueNumber: 1,
      name: "John Doe",
      phone: "(555) 123-4567",
      arrivalTime: "09:30 AM",
      status: "Waiting",
      priority: "Normal",
      estimatedWait: "15 min"
    },
    {
      id: 2,
      queueNumber: 2,
      name: "Jane Smith",
      phone: "(555) 234-5678",
      arrivalTime: "09:45 AM",
      status: "With Doctor",
      priority: "Normal",
      estimatedWait: "0 min"
    },
    {
      id: 3,
      queueNumber: 3,
      name: "Bob Johnson",
      phone: "(555) 345-6789",
      arrivalTime: "10:00 AM",
      status: "Waiting",
      priority: "Urgent",
      estimatedWait: "5 min"
    }
  ],
  appointments: [
    {
      id: 1,
      patientName: "Alice Brown",
      patientPhone: "(555) 456-7890",
      doctorId: 1,
      doctorName: "Dr. Sarah Smith",
      date: "2025-08-11",
      time: "10:00 AM",
      status: "Scheduled",
      type: "Check-up"
    },
    {
      id: 2,
      patientName: "Charlie Davis",
      patientPhone: "(555) 567-8901",
      doctorId: 2,
      doctorName: "Dr. Michael Johnson",
      date: "2025-08-11",
      time: "11:30 AM",
      status: "Confirmed",
      type: "Consultation"
    },
    {
      id: 3,
      patientName: "Eva White",
      patientPhone: "(555) 678-9012",
      doctorId: 3,
      doctorName: "Dr. Emily Lee",
      date: "2025-08-11",
      time: "2:00 PM",
      status: "Completed",
      type: "Follow-up"
    }
  ],
  systemStats: {
    totalPatientsToday: 15,
    activeDoctors: 4,
    pendingAppointments: 8,
    queueLength: 3
  },
  currentUser: null,
  nextPatientId: 4,
  nextAppointmentId: 4,
  nextDoctorId: 5
};

// Application State
let currentView = 'dashboard';
let queueFilter = 'all';
let appointmentFilter = { status: 'all', date: '2025-08-11', specialization: 'all', location: 'all' };
let doctorFilter = { specialization: 'all', location: 'all', availability: 'all' };
let editingDoctorId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  initializeApp();
  setupEventListeners();
  
  // Initialize Lucide icons
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
      console.log('Lucide icons initialized');
    }
  }, 100);
});

function initializeApp() {
  console.log('Initializing app...');
  // Show login screen by default
  showLoginScreen();
  // Populate filter options
  populateFilterOptions();
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    console.log('Login form event listener added');
  }
  
  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const tabName = e.currentTarget.dataset.tab;
      if (tabName) {
        switchTab(tabName);
      }
    });
  });
  
  // Queue management
  const addPatientBtn = document.getElementById('addPatientBtn');
  if (addPatientBtn) {
    addPatientBtn.addEventListener('click', () => openModal('addPatientModal'));
  }
  
  const addPatientForm = document.getElementById('addPatientForm');
  if (addPatientForm) {
    addPatientForm.addEventListener('submit', handleAddPatient);
  }
  
  // Queue filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => setQueueFilter(e.target.dataset.filter));
  });
  
  // Queue search
  const queueSearch = document.getElementById('queueSearch');
  if (queueSearch) {
    queueSearch.addEventListener('input', debounce(filterQueue, 300));
  }
  
  // Appointments
  const scheduleAppointmentBtn = document.getElementById('scheduleAppointmentBtn');
  if (scheduleAppointmentBtn) {
    scheduleAppointmentBtn.addEventListener('click', () => openModal('scheduleAppointmentModal'));
  }
  
  const scheduleAppointmentForm = document.getElementById('scheduleAppointmentForm');
  if (scheduleAppointmentForm) {
    scheduleAppointmentForm.addEventListener('submit', handleScheduleAppointment);
  }
  
  // Appointment filters
  const appointmentDate = document.getElementById('appointmentDate');
  if (appointmentDate) {
    appointmentDate.addEventListener('change', filterAppointments);
  }
  
  const appointmentStatus = document.getElementById('appointmentStatus');
  if (appointmentStatus) {
    appointmentStatus.addEventListener('change', filterAppointments);
  }
  
  const doctorSpecialization = document.getElementById('doctorSpecialization');
  if (doctorSpecialization) {
    doctorSpecialization.addEventListener('change', filterAppointments);
  }
  
  const doctorLocation = document.getElementById('doctorLocation');
  if (doctorLocation) {
    doctorLocation.addEventListener('change', filterAppointments);
  }
  
  const appointmentSearch = document.getElementById('appointmentSearch');
  if (appointmentSearch) {
    appointmentSearch.addEventListener('input', debounce(filterAppointments, 300));
  }
  
  // Doctor management
  const addDoctorBtn = document.getElementById('addDoctorBtn');
  if (addDoctorBtn) {
    addDoctorBtn.addEventListener('click', () => openDoctorModal());
  }
  
  const doctorForm = document.getElementById('doctorForm');
  if (doctorForm) {
    doctorForm.addEventListener('submit', handleDoctorSubmit);
  }
  
  // Doctor filters
  const doctorFilterSpecialization = document.getElementById('doctorFilterSpecialization');
  if (doctorFilterSpecialization) {
    doctorFilterSpecialization.addEventListener('change', filterDoctors);
  }
  
  const doctorFilterLocation = document.getElementById('doctorFilterLocation');
  if (doctorFilterLocation) {
    doctorFilterLocation.addEventListener('change', filterDoctors);
  }
  
  const doctorFilterAvailability = document.getElementById('doctorFilterAvailability');
  if (doctorFilterAvailability) {
    doctorFilterAvailability.addEventListener('change', filterDoctors);
  }
  
  const doctorSearch = document.getElementById('doctorSearch');
  if (doctorSearch) {
    doctorSearch.addEventListener('input', debounce(filterDoctors, 300));
  }
  
  // Delete confirmation
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
  }
  
  // Modal close buttons
  document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.dataset.modal;
      if (modalId) {
        closeModal(modalId);
      } else {
        const modal = btn.closest('.modal, [id$="Modal"]');
        if (modal) {
          closeModal(modal.id);
        }
      }
    });
  });
  
  // Close modals on backdrop click
  document.querySelectorAll('[id$="Modal"], #deleteModal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
  
  console.log('Event listeners setup complete');
}

// Authentication
function handleLogin(e) {
  console.log('Login form submitted');
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  
  console.log('Username:', username, 'Password length:', password.length);
  
  // Simple authentication simulation
  if (username && password) {
    appData.currentUser = username;
    
    // Clear form
    document.getElementById('loginForm').reset();
    
    // Show main app
    showMainApp();
    
    // Show success toast after a short delay to ensure UI has updated
    setTimeout(() => {
      showToast('Login successful!');
    }, 100);
  } else {
    showToast('Please enter valid credentials', 'error');
  }
}

function handleLogout() {
  appData.currentUser = null;
  currentView = 'dashboard';
  editingDoctorId = null;
  
  // Reset to dashboard tab
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    item.classList.add('text-gray-500', 'hover:text-gray-700', 'border-transparent', 'hover:border-gray-300');
    item.classList.remove('text-blue-600', 'border-blue-600');
  });
  const dashboardTab = document.querySelector('[data-tab="dashboard"]');
  if (dashboardTab) {
    dashboardTab.classList.add('active');
    dashboardTab.classList.remove('text-gray-500', 'hover:text-gray-700', 'border-transparent', 'hover:border-gray-300');
    dashboardTab.classList.add('text-blue-600', 'border-blue-600');
  }
  
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
    content.classList.add('hidden');
  });
  const dashboardContent = document.getElementById('dashboard');
  if (dashboardContent) {
    dashboardContent.classList.add('active');
    dashboardContent.classList.remove('hidden');
  }
  
  showLoginScreen();
  showToast('Logged out successfully');
}

function showLoginScreen() {
  const loginScreen = document.getElementById('loginScreen');
  const mainApp = document.getElementById('mainApp');
  
  if (loginScreen) loginScreen.classList.remove('hidden');
  if (mainApp) mainApp.classList.add('hidden');
}

function showMainApp() {
  const loginScreen = document.getElementById("loginScreen");
  const mainApp = document.getElementById("mainApp");

  if (loginScreen) loginScreen.classList.add("hidden");
  if (mainApp) mainApp.classList.remove("hidden");

  // Set current user
  const currentUserEl = document.getElementById("currentUser");
  if (currentUserEl) {
    currentUserEl.textContent = appData.currentUser;
  }

  switchTab('dashboard');

  // Initialize dashboard and other components
  updateDashboard();
  renderQueue();
  renderAppointments();
  renderDoctors();
  populateDoctorSelect();
  populateFilterOptions();

  // Ensure icons are rendered
  setTimeout(() => {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }, 50);
}

// Tab Management
function switchTab(tabName) {
  // Update active tab
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    item.classList.add('text-gray-500', 'hover:text-gray-700', 'border-transparent', 'hover:border-gray-300');
    item.classList.remove('text-blue-600', 'border-blue-600');
  });
  const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
    activeTab.classList.remove('text-gray-500', 'hover:text-gray-700', 'border-transparent', 'hover:border-gray-300');
    activeTab.classList.add('text-blue-600', 'border-blue-600');
  }
  
  // Show/hide content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
    content.classList.add('hidden');
  });
  const activeContent = document.getElementById(tabName);
  if (activeContent) {
    activeContent.classList.add('active');
    activeContent.classList.remove('hidden');
  }
  
  currentView = tabName;
  
  // Refresh content based on active tab
  if (tabName === 'dashboard') {
    updateDashboard();
  } else if (tabName === 'queue') {
    renderQueue();
  } else if (tabName === 'appointments') {
    renderAppointments();
  } else if (tabName === 'doctors') {
    renderDoctors();
  }
  
  // Re-render icons after tab switch
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 50);
}

// Dashboard Functions
function updateDashboard() {
  // Update stats
  const totalPatientsEl = document.getElementById('totalPatients');
  const activeDoctorsEl = document.getElementById('activeDoctors');
  const pendingAppointmentsEl = document.getElementById('pendingAppointments');
  const queueLengthEl = document.getElementById('queueLength');
  
  if (totalPatientsEl) totalPatientsEl.textContent = appData.systemStats.totalPatientsToday;
  if (activeDoctorsEl) activeDoctorsEl.textContent = appData.doctors.filter(d => d.availability === 'Available').length;
  if (pendingAppointmentsEl) pendingAppointmentsEl.textContent = appData.appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled').length;
  if (queueLengthEl) queueLengthEl.textContent = appData.queuePatients.filter(p => p.status !== 'Completed').length;
  
  // Render queue preview
  renderQueuePreview();
  
  // Render doctors preview
  renderDoctorsPreview();
}

function renderQueuePreview() {
  const container = document.getElementById('dashboardQueue');
  if (!container) return;
  
  const waitingPatients = appData.queuePatients.filter(p => p.status === 'Waiting').slice(0, 3);
  
  if (waitingPatients.length === 0) {
    container.innerHTML = '<p class="text-gray-500 italic text-center">No patients in queue</p>';
    return;
  }
  
  container.innerHTML = waitingPatients.map(patient => `
    <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
      <div>
        <h6 class="font-medium text-gray-900">#${patient.queueNumber} - ${patient.name}</h6>
        <p class="text-sm text-gray-600">Arrived: ${patient.arrivalTime} • Wait: ${patient.estimatedWait}</p>
      </div>
      <span class="priority-${patient.priority.toLowerCase()} px-2 py-1 text-xs font-medium rounded-full">${patient.priority}</span>
    </div>
  `).join('');
}

function renderDoctorsPreview() {
  const container = document.getElementById('dashboardDoctors');
  if (!container) return;
  
  container.innerHTML = appData.doctors.map(doctor => `
    <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
      <div>
        <h6 class="font-medium text-gray-900">${doctor.name}</h6>
        <p class="text-sm text-gray-600">${doctor.specialization} • ${doctor.location}</p>
      </div>
      <span class="doctor-${doctor.availability.toLowerCase()} px-2 py-1 text-xs font-medium rounded-full">${doctor.availability}</span>
    </div>
  `).join('');
}

// Queue Management Functions
function renderQueue() {
  const container = document.getElementById('queueList');
  if (!container) return;
  
  const filteredPatients = getFilteredQueuePatients();
  
  if (filteredPatients.length === 0) {
    container.innerHTML = '<div class="text-center py-12 text-gray-500">No patients match the current filter</div>';
    return;
  }
  
  container.innerHTML = filteredPatients.map(patient => `
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow" data-patient-id="${patient.id}">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div class="flex items-center space-x-4">
          <div class="queue-number bg-blue-600 text-white rounded-full">${patient.queueNumber}</div>
          <div>
            <h5 class="font-semibold text-gray-900 mb-1">${patient.name}</h5>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              <span>${patient.phone}</span>
              <span>Arrived: ${patient.arrivalTime}</span>
              <span>Wait: ${patient.estimatedWait}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <span class="priority-${patient.priority.toLowerCase()} px-2 py-1 text-xs font-medium rounded-full">${patient.priority}</span>
          <div class="flex space-x-2">
            ${renderQueueStatusButtons(patient)}
          </div>
        </div>
      </div>
    </div>
  `).join('');
  
  // Add event listeners for status buttons
  container.querySelectorAll('.status-btn').forEach(btn => {
    btn.addEventListener('click', handleStatusChange);
  });
  
  // Re-render icons
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 50);
}

function renderQueueStatusButtons(patient) {
  if (patient.status === 'Waiting') {
    return `
      <button class="status-btn px-4 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg text-sm font-medium transition-colors" data-action="with-doctor" data-patient-id="${patient.id}">
        Call Patient
      </button>
    `;
  } else if (patient.status === 'With Doctor') {
    return `
      <button class="status-btn px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors" data-action="completed" data-patient-id="${patient.id}">
        Complete
      </button>
    `;
  } else {
    return `<span class="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">Completed</span>`;
  }
}

function getFilteredQueuePatients() {
  let filtered = appData.queuePatients;
  
  // Apply status filter
  if (queueFilter !== 'all') {
    const statusMap = {
      'waiting': 'Waiting',
      'with-doctor': 'With Doctor',
      'completed': 'Completed'
    };
    filtered = filtered.filter(patient => patient.status === statusMap[queueFilter]);
  }
  
  // Apply search filter
  const searchInput = document.getElementById('queueSearch');
  if (searchInput) {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.phone.includes(searchTerm)
      );
    }
  }
  
  return filtered;
}

function setQueueFilter(filter) {
  queueFilter = filter;
  
  // Update filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
    btn.classList.remove('bg-blue-600', 'text-white');
  });
  const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
    activeBtn.classList.add('bg-blue-600', 'text-white');
  }
  
  renderQueue();
}

function filterQueue() {
  renderQueue();
}

function handleStatusChange(e) {
  const patientId = parseInt(e.target.dataset.patientId);
  const action = e.target.dataset.action;
  
  const patient = appData.queuePatients.find(p => p.id === patientId);
  if (!patient) return;
  
  if (action === 'with-doctor') {
    patient.status = 'With Doctor';
    patient.estimatedWait = '0 min';
    showToast(`${patient.name} called to see doctor`);
  } else if (action === 'completed') {
    patient.status = 'Completed';
    showToast(`${patient.name}'s visit completed`);
  }
  
  renderQueue();
  updateDashboard();
}

function handleAddPatient(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const newPatient = {
    id: appData.nextPatientId++,
    queueNumber: Math.max(...appData.queuePatients.map(p => p.queueNumber), 0) + 1,
    name: formData.get('name'),
    phone: formData.get('phone'),
    arrivalTime: new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    }),
    status: 'Waiting',
    priority: formData.get('priority'),
    estimatedWait: '20 min'
  };
  
  appData.queuePatients.push(newPatient);
  appData.systemStats.queueLength++;
  
  closeModal('addPatientModal');
  e.target.reset();
  renderQueue();
  updateDashboard();
  showToast(`${newPatient.name} added to queue`);
}

// Appointment Management Functions
function renderAppointments() {
  const container = document.getElementById('appointmentsList');
  if (!container) return;
  
  const filteredAppointments = getFilteredAppointments();
  
  if (filteredAppointments.length === 0) {
    container.innerHTML = '<div class="text-center py-12 text-gray-500">No appointments match the current filter</div>';
    return;
  }
  
  container.innerHTML = filteredAppointments.map(appointment => `
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow" data-appointment-id="${appointment.id}">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div class="flex items-center space-x-4">
          <div class="appointment-time px-3 py-2 rounded-lg font-medium text-sm">${appointment.time}</div>
          <div>
            <h5 class="font-semibold text-gray-900 mb-1">${appointment.patientName}</h5>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              <span>${appointment.doctorName}</span>
              <span>${appointment.type}</span>
              <span>${appointment.patientPhone}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <span class="status-${appointment.status.toLowerCase()} px-3 py-1 text-xs font-medium rounded-full">${appointment.status}</span>
          <div class="flex space-x-2">
            ${renderAppointmentActions(appointment)}
          </div>
        </div>
      </div>
    </div>
  `).join('');
  
  // Add event listeners for appointment actions
  container.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', handleAppointmentAction);
  });
  
  // Re-render icons
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 50);
}

function renderAppointmentActions(appointment) {
  if (appointment.status === 'Scheduled') {
    return `
      <button class="action-btn flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors" data-action="confirm" data-appointment-id="${appointment.id}">
        <i data-lucide="check" class="w-4 h-4"></i>
        <span>Confirm</span>
      </button>
      <button class="action-btn flex items-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg text-sm font-medium transition-colors" data-action="reschedule" data-appointment-id="${appointment.id}">
        <i data-lucide="calendar" class="w-4 h-4"></i>
        <span>Reschedule</span>
      </button>
      <button class="action-btn flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors" data-action="cancel" data-appointment-id="${appointment.id}">
        <i data-lucide="x" class="w-4 h-4"></i>
        <span>Cancel</span>
      </button>
    `;
  } else if (appointment.status === 'Confirmed') {
    return `
      <button class="action-btn flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors" data-action="complete" data-appointment-id="${appointment.id}">
        <i data-lucide="check-circle" class="w-4 h-4"></i>
        <span>Complete</span>
      </button>
      <button class="action-btn flex items-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg text-sm font-medium transition-colors" data-action="reschedule" data-appointment-id="${appointment.id}">
        <i data-lucide="calendar" class="w-4 h-4"></i>
        <span>Reschedule</span>
      </button>
    `;
  }
  return '';
}

function getFilteredAppointments() {
  let filtered = appData.appointments;
  
  // Apply date filter
  const dateInput = document.getElementById('appointmentDate');
  if (dateInput) {
    const selectedDate = dateInput.value;
    if (selectedDate) {
      filtered = filtered.filter(appointment => appointment.date === selectedDate);
    }
  }
  
  // Apply status filter
  const statusSelect = document.getElementById('appointmentStatus');
  if (statusSelect) {
    const selectedStatus = statusSelect.value;
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(appointment => 
        appointment.status.toLowerCase() === selectedStatus
      );
    }
  }
  
  // Apply specialization filter
  const specializationSelect = document.getElementById('doctorSpecialization');
  if (specializationSelect) {
    const selectedSpecialization = specializationSelect.value;
    if (selectedSpecialization !== 'all') {
      filtered = filtered.filter(appointment => {
        const doctor = appData.doctors.find(d => d.id === appointment.doctorId);
        return doctor && doctor.specialization === selectedSpecialization;
      });
    }
  }
  
  // Apply location filter
  const locationSelect = document.getElementById('doctorLocation');
  if (locationSelect) {
    const selectedLocation = locationSelect.value;
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(appointment => {
        const doctor = appData.doctors.find(d => d.id === appointment.doctorId);
        return doctor && doctor.location === selectedLocation;
      });
    }
  }
  
  // Apply search filter
  const searchInput = document.getElementById('appointmentSearch');
  if (searchInput) {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(appointment => 
        appointment.doctorName.toLowerCase().includes(searchTerm)
      );
    }
  }
  
  return filtered.sort((a, b) => {
    const timeA = convertTimeToMinutes(a.time);
    const timeB = convertTimeToMinutes(b.time);
    return timeA - timeB;
  });
}

function convertTimeToMinutes(timeString) {
  const [time, period] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
}

function filterAppointments() {
  renderAppointments();
}

function handleAppointmentAction(e) {
  const appointmentId = parseInt(e.target.closest('[data-appointment-id]').dataset.appointmentId);
  const action = e.target.closest('[data-action]').dataset.action;
  
  const appointment = appData.appointments.find(a => a.id === appointmentId);
  if (!appointment) return;
  
  switch (action) {
    case 'confirm':
      appointment.status = 'Confirmed';
      showToast(`Appointment for ${appointment.patientName} confirmed`);
      break;
    case 'cancel':
      appointment.status = 'Cancelled';
      showToast(`Appointment for ${appointment.patientName} cancelled`);
      break;
    case 'complete':
      appointment.status = 'Completed';
      showToast(`Appointment for ${appointment.patientName} completed`);
      break;
    case 'reschedule':
      // Simple reschedule simulation - in real app would open a reschedule modal
      const newTime = prompt('Enter new time (e.g., 3:00 PM):');
      const newDate = prompt('Enter new date (YYYY-MM-DD):');
      if (newTime && newDate) {
        appointment.time = newTime;
        appointment.date = newDate;
        showToast(`Appointment for ${appointment.patientName} rescheduled`);
      }
      break;
  }
  
  renderAppointments();
  updateDashboard();
}

function populateDoctorSelect() {
  const select = document.querySelector('#scheduleAppointmentForm select[name="doctorId"]');
  if (!select) return;
  
  const options = appData.doctors.map(doctor => 
    `<option value="${doctor.id}">${doctor.name} - ${doctor.specialization}</option>`
  ).join('');
  
  select.innerHTML = '<option value="">Select Doctor</option>' + options;
}

function handleScheduleAppointment(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const doctorId = parseInt(formData.get('doctorId'));
  const doctor = appData.doctors.find(d => d.id === doctorId);
  
  if (!doctor) {
    showToast('Please select a doctor', 'error');
    return;
  }
  
  const newAppointment = {
    id: appData.nextAppointmentId++,
    patientName: formData.get('patientName'),
    patientPhone: formData.get('patientPhone'),
    doctorId: doctorId,
    doctorName: doctor.name,
    date: formData.get('date'),
    time: formatTime(formData.get('time')),
    status: 'Scheduled',
    type: formData.get('type')
  };
  
  appData.appointments.push(newAppointment);
  appData.systemStats.pendingAppointments++;
  
  closeModal('scheduleAppointmentModal');
  e.target.reset();
  renderAppointments();
  updateDashboard();
  showToast(`Appointment scheduled for ${newAppointment.patientName}`);
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  
  return `${displayHour}:${minutes} ${period}`;
}

// Doctor Management Functions
function renderDoctors() {
  const container = document.getElementById('doctorsList');
  if (!container) return;
  
  const filteredDoctors = getFilteredDoctors();
  
  if (filteredDoctors.length === 0) {
    container.innerHTML = '<div class="text-center py-12 text-gray-500">No doctors match the current filter</div>';
    return;
  }
  
  container.innerHTML = filteredDoctors.map(doctor => `
    <div class="doctor-card bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all" data-doctor-id="${doctor.id}">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <i data-lucide="user-md" class="w-8 h-8 text-blue-600"></i>
          </div>
          <div>
            <h5 class="font-semibold text-gray-900 mb-1">${doctor.name}</h5>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
              <span>${doctor.specialization}</span>
              <span>${doctor.location}</span>
              <span>Next: ${doctor.nextAvailable}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="gender-${doctor.gender.toLowerCase()} px-2 py-1 text-xs font-medium rounded-full">${doctor.gender}</span>
              <span class="doctor-${doctor.availability.toLowerCase()} px-2 py-1 text-xs font-medium rounded-full">${doctor.availability}</span>
            </div>
          </div>
        </div>
        <div class="flex space-x-2">
          <button class="edit-doctor-btn flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors" data-doctor-id="${doctor.id}">
            <i data-lucide="edit" class="w-4 h-4"></i>
            <span>Edit</span>
          </button>
          <button class="delete-doctor-btn flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors" data-doctor-id="${doctor.id}">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  // Add event listeners for doctor actions
  container.querySelectorAll('.edit-doctor-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const doctorId = parseInt(e.target.closest('[data-doctor-id]').dataset.doctorId);
      openDoctorModal(doctorId);
    });
  });
  
  container.querySelectorAll('.delete-doctor-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const doctorId = parseInt(e.target.closest('[data-doctor-id]').dataset.doctorId);
      const doctor = appData.doctors.find(d => d.id === doctorId);
      if (doctor) {
        openDeleteModal(`Are you sure you want to delete ${doctor.name}?`, () => deleteDoctor(doctorId));
      }
    });
  });
  
  // Re-render icons
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 50);
}

function getFilteredDoctors() {
  let filtered = appData.doctors;
  
  // Apply specialization filter
  const specializationSelect = document.getElementById('doctorFilterSpecialization');
  if (specializationSelect) {
    const selectedSpecialization = specializationSelect.value;
    if (selectedSpecialization !== 'all') {
      filtered = filtered.filter(doctor => doctor.specialization === selectedSpecialization);
    }
  }
  
  // Apply location filter
  const locationSelect = document.getElementById('doctorFilterLocation');
  if (locationSelect) {
    const selectedLocation = locationSelect.value;
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(doctor => doctor.location === selectedLocation);
    }
  }
  
  // Apply availability filter
  const availabilitySelect = document.getElementById('doctorFilterAvailability');
  if (availabilitySelect) {
    const selectedAvailability = availabilitySelect.value;
    if (selectedAvailability !== 'all') {
      filtered = filtered.filter(doctor => doctor.availability.toLowerCase() === selectedAvailability);
    }
  }
  
  // Apply search filter
  const searchInput = document.getElementById('doctorSearch');
  if (searchInput) {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialization.toLowerCase().includes(searchTerm) ||
        doctor.location.toLowerCase().includes(searchTerm)
      );
    }
  }
  
  return filtered;
}

function filterDoctors() {
  renderDoctors();
}

function openDoctorModal(doctorId = null) {
  editingDoctorId = doctorId;
  const modal = document.getElementById('doctorModal');
  const title = document.getElementById('doctorModalTitle');
  const submitBtn = document.getElementById('doctorSubmitBtn');
  const form = document.getElementById('doctorForm');
  
  if (doctorId) {
    const doctor = appData.doctors.find(d => d.id === doctorId);
    if (doctor) {
      title.textContent = 'Edit Doctor';
      submitBtn.textContent = 'Update Doctor';
      
      // Populate form with doctor data
      form.name.value = doctor.name;
      form.gender.value = doctor.gender;
      form.specialization.value = doctor.specialization;
      form.location.value = doctor.location;
      form.availability.value = doctor.availability;
      form.nextAvailable.value = doctor.nextAvailable;
    }
  } else {
    title.textContent = 'Add Doctor';
    submitBtn.textContent = 'Add Doctor';
    form.reset();
  }
  
  openModal('doctorModal');
}

function handleDoctorSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const doctorData = {
    name: formData.get('name'),
    gender: formData.get('gender'),
    specialization: formData.get('specialization'),
    location: formData.get('location'),
    availability: formData.get('availability'),
    nextAvailable: formData.get('nextAvailable')
  };
  
  if (editingDoctorId) {
    // Update existing doctor
    const doctor = appData.doctors.find(d => d.id === editingDoctorId);
    if (doctor) {
      Object.assign(doctor, doctorData);
      showToast(`${doctor.name} updated successfully`);
      
      // Update related appointments
      appData.appointments.forEach(appointment => {
        if (appointment.doctorId === editingDoctorId) {
          appointment.doctorName = doctor.name;
        }
      });
    }
  } else {
    // Add new doctor
    const newDoctor = {
      id: appData.nextDoctorId++,
      ...doctorData
    };
    appData.doctors.push(newDoctor);
    showToast(`${newDoctor.name} added successfully`);
  }
  
  editingDoctorId = null;
  closeModal('doctorModal');
  e.target.reset();
  renderDoctors();
  populateDoctorSelect();
  populateFilterOptions();
  updateDashboard();
}

function deleteDoctor(doctorId) {
  const doctorIndex = appData.doctors.findIndex(d => d.id === doctorId);
  if (doctorIndex === -1) return;
  
  const doctor = appData.doctors[doctorIndex];
  
  // Remove doctor
  appData.doctors.splice(doctorIndex, 1);
  
  // Update related appointments to cancelled status
  appData.appointments.forEach(appointment => {
    if (appointment.doctorId === doctorId) {
      appointment.status = 'Cancelled';
    }
  });
  
  showToast(`${doctor.name} deleted successfully`);
  renderDoctors();
  populateDoctorSelect();
  populateFilterOptions();
  updateDashboard();
}

// Utility Functions
function populateFilterOptions() {
  // Populate specialization filters
  const specializations = [...new Set(appData.doctors.map(d => d.specialization))];
  const locations = [...new Set(appData.doctors.map(d => d.location))];
  
  // Appointment specialization filter
  const appointmentSpecializationSelect = document.getElementById('doctorSpecialization');
  if (appointmentSpecializationSelect) {
    appointmentSpecializationSelect.innerHTML = '<option value="all">All Specializations</option>' +
      specializations.map(spec => `<option value="${spec}">${spec}</option>`).join('');
  }
  
  // Appointment location filter
  const appointmentLocationSelect = document.getElementById('doctorLocation');
  if (appointmentLocationSelect) {
    appointmentLocationSelect.innerHTML = '<option value="all">All Locations</option>' +
      locations.map(loc => `<option value="${loc}">${loc}</option>`).join('');
  }
  
  // Doctor specialization filter
  const doctorSpecializationSelect = document.getElementById('doctorFilterSpecialization');
  if (doctorSpecializationSelect) {
    doctorSpecializationSelect.innerHTML = '<option value="all">All Specializations</option>' +
      specializations.map(spec => `<option value="${spec}">${spec}</option>`).join('');
  }
  
  // Doctor location filter
  const doctorLocationSelect = document.getElementById('doctorFilterLocation');
  if (doctorLocationSelect) {
    doctorLocationSelect.innerHTML = '<option value="all">All Locations</option>' +
      locations.map(loc => `<option value="${loc}">${loc}</option>`).join('');
  }
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  modal.classList.remove('hidden');
  
  // Focus first input
  const firstInput = modal.querySelector('input, select');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
  
  // Re-render icons for modal content
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 100);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
  
  // Reset editing state when closing doctor modal
  if (modalId === 'doctorModal') {
    editingDoctorId = null;
  }
}

function openDeleteModal(message, onConfirm) {
  const modal = document.getElementById('deleteModal');
  const messageEl = document.getElementById('deleteMessage');
  const confirmBtn = document.getElementById('confirmDeleteBtn');
  
  if (messageEl) messageEl.textContent = message;
  
  // Remove existing listeners and add new one
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  
  newConfirmBtn.addEventListener('click', () => {
    onConfirm();
    closeModal('deleteModal');
  });
  
  openModal('deleteModal');
}

function handleConfirmDelete() {
  // This will be overridden by openDeleteModal
}

// Toast Notifications
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  if (!toast || !toastMessage) return;
  
  toastMessage.textContent = message;
  
  // Update toast color based on type
  toast.className = `fixed top-6 right-6 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 z-50 transform transition-transform duration-300 ${
    type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
  }`;
  
  // Show toast
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 300);
  }, 3000);
  
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 50);
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}