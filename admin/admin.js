// Admin Panel JavaScript

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadZipList();
    setupFormHandlers();
});

// Tab Navigation
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const navBtns = document.querySelectorAll('.nav-btn');

    tabs.forEach(tab => tab.classList.remove('active'));
    navBtns.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'list') {
        loadZipList();
    }
}

// Form Handlers
function setupFormHandlers() {
    document.getElementById('addForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewZipCode();
    });
}

function addNewZipCode() {
    const zipCode = document.getElementById('zipCode').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim().toUpperCase();
    const county = document.getElementById('county').value.trim();
    const areaCode = document.getElementById('areaCode').value.trim();
    const timezone = document.getElementById('timezone').value;
    const messageDiv = document.getElementById('addMessage');

    // Validation
    if (!zipCode || !city || !state || !county || !areaCode || !timezone) {
        showMessage(messageDiv, 'Please fill all fields', 'error');
        return;
    }

    if (!/^\d{5,10}$/.test(zipCode)) {
        showMessage(messageDiv, 'Zip code must be 5-10 digits', 'error');
        return;
    }

    if (state.length !== 2) {
        showMessage(messageDiv, 'State must be 2 letters', 'error');
        return;
    }

    // Check if zip code already exists
    const allZips = JSON.parse(localStorage.getItem('zipCodes')) || {};
    if (allZips[zipCode]) {
        showMessage(messageDiv, 'This zip code already exists!', 'error');
        return;
    }

    // Save to localStorage
    const data = {
        city: city,
        state: state,
        county: county,
        areaCode: areaCode,
        timezone: timezone
    };

    allZips[zipCode] = data;
    localStorage.setItem('zipCodes', JSON.stringify(allZips));

    // Reset form
    document.getElementById('addForm').reset();
    showMessage(messageDiv, `✅ Zip code ${zipCode} added successfully!`, 'success');

    // Reload list
    setTimeout(() => {
        loadZipList();
        showTab('list');
    }, 1500);
}

// Load and Display Zip Codes
function loadZipList() {
    const allZips = JSON.parse(localStorage.getItem('zipCodes')) || {};
    const zipList = document.getElementById('zipList');

    if (Object.keys(allZips).length === 0) {
        zipList.innerHTML = '<p style="text-align: center; color: #999;">No zip codes found. Add one to get started!</p>';
        return;
    }

    zipList.innerHTML = '';

    Object.entries(allZips).forEach(([zip, data]) => {
        const zipItem = document.createElement('div');
        zipItem.className = 'zip-item';
        zipItem.innerHTML = `
            <div class="zip-item-info">
                <div class="zip-item-code">${zip}</div>
                <div class="zip-item-details">
                    <div class="zip-item-detail">
                        <span class="zip-item-detail-label">City:</span>
                        <span>${data.city}</span>
                    </div>
                    <div class="zip-item-detail">
                        <span class="zip-item-detail-label">State:</span>
                        <span>${data.state}</span>
                    </div>
                    <div class="zip-item-detail">
                        <span class="zip-item-detail-label">County:</span>
                        <span>${data.county}</span>
                    </div>
                    <div class="zip-item-detail">
                        <span class="zip-item-detail-label">Area Code:</span>
                        <span>${data.areaCode}</span>
                    </div>
                    <div class="zip-item-detail">
                        <span class="zip-item-detail-label">Timezone:</span>
                        <span>${data.timezone}</span>
                    </div>
                </div>
            </div>
            <div class="zip-item-actions">
                <button class="delete-btn" onclick="deleteZipFromAdmin('${zip}')">🗑️ Delete</button>
            </div>
        `;
        zipList.appendChild(zipItem);
    });
}

// Filter Zip Codes
function filterZipCodes() {
    const filterValue = document.getElementById('filterInput').value.toLowerCase();
    const zipItems = document.querySelectorAll('.zip-item');

    zipItems.forEach(item => {
        const zipCode = item.querySelector('.zip-item-code').textContent.toLowerCase();
        const city = item.textContent.toLowerCase();

        if (zipCode.includes(filterValue) || city.includes(filterValue)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Delete Zip Code
function deleteZipFromAdmin(zipCode) {
    if (confirm(`Are you sure you want to delete zip code ${zipCode}?`)) {
        const allZips = JSON.parse(localStorage.getItem('zipCodes')) || {};
        delete allZips[zipCode];
        localStorage.setItem('zipCodes', JSON.stringify(allZips));
        loadZipList();
    }
}

// Export Data
function exportAllData() {
    const allZips = JSON.parse(localStorage.getItem('zipCodes')) || {};
    const jsonString = JSON.stringify(allZips, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'zip-codes-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Import Data
function handleFileImport() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const messageDiv = document.getElementById('importMessage');

    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            const allZips = JSON.parse(localStorage.getItem('zipCodes')) || {};

            // Merge data
            Object.assign(allZips, importedData);
            localStorage.setItem('zipCodes', JSON.stringify(allZips));

            showMessage(messageDiv, `✅ Successfully imported ${Object.keys(importedData).length} zip codes!`, 'success');
            fileInput.value = '';

            setTimeout(() => {
                loadZipList();
            }, 1500);
        } catch (error) {
            showMessage(messageDiv, `❌ Error: Invalid JSON file - ${error.message}`, 'error');
            fileInput.value = '';
        }
    };

    reader.readAsText(file);
}

// Show Message Helper
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'message show ' + type;

    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}