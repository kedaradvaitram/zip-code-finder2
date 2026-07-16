// Tab Switching Functions
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const btns = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    btns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

function switchIfscTab(tabName) {
    const tabs = document.querySelectorAll('.subtab-content');
    const btns = document.querySelectorAll('.subtab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    btns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// ZIP CODE SEARCH FUNCTION
function searchZipCode() {
    const village = document.getElementById('village').value.trim();
    const mandal = document.getElementById('mandal').value.trim();
    const state = document.getElementById('state').value;
    const errorDiv = document.getElementById('zipError');
    const resultDiv = document.getElementById('zipResult');
    
    errorDiv.style.display = 'none';
    resultDiv.style.display = 'none';
    
    if (!village || !mandal || !state) {
        showError(errorDiv, '⚠️ Please fill all fields');
        return;
    }
    
    // Search in database
    const key = `${village.toUpperCase()}_${state}`;
    const result = Object.values(zipCodeDatabase).find(item => 
        item.village.toUpperCase() === village.toUpperCase() &&
        item.mandal.toUpperCase() === mandal.toUpperCase() &&
        item.state === state
    );
    
    if (result) {
        displayZipResult(result);
        resultDiv.style.display = 'block';
    } else {
        showError(errorDiv, '❌ Location not found in database. Please try different values.');
    }
}

function displayZipResult(data) {
    document.getElementById('resVillage').textContent = data.village;
    document.getElementById('resMandal').textContent = data.mandal;
    document.getElementById('resState').textContent = data.state;
    document.getElementById('resZipCode').textContent = data.zipCode;
    document.getElementById('resPincode').textContent = data.pincode;
    document.getElementById('resDistrict').textContent = data.district;
}

// IFSC CODE SEARCH BY CODE
function searchByIFSC() {
    const ifscCode = document.getElementById('ifscCode').value.trim().toUpperCase();
    const errorDiv = document.getElementById('ifscError');
    const resultDiv = document.getElementById('ifscResult');
    
    errorDiv.style.display = 'none';
    resultDiv.style.display = 'none';
    
    if (!ifscCode) {
        showError(errorDiv, '⚠️ Please enter IFSC code');
        return;
    }
    
    const result = ifscCodeDatabase[ifscCode];
    
    if (result) {
        displayIfscResult(result);
        resultDiv.style.display = 'block';
    } else {
        showError(errorDiv, '❌ IFSC code not found in database.');
    }
}

function displayIfscResult(data) {
    document.getElementById('resIfscCode').textContent = data.ifscCode;
    document.getElementById('resBankName').textContent = data.bankName;
    document.getElementById('resBranchName').textContent = data.branchName;
    document.getElementById('resBranchCode').textContent = data.branchCode;
    document.getElementById('resLocationCity').textContent = data.location;
    document.getElementById('resIfscState').textContent = data.state;
    document.getElementById('resIfscMandal').textContent = data.mandal;
    document.getElementById('resIfscDistrict').textContent = data.district;
}

// SEARCH BY BANK DETAILS
function searchByBankDetails() {
    const bankCode = document.getElementById('bankName').value;
    const branchName = document.getElementById('branchSearchName').value.trim();
    const city = document.getElementById('citySearch').value.trim();
    const state = document.getElementById('stateSearch').value;
    const errorDiv = document.getElementById('bankError');
    const resultDiv = document.getElementById('bankResult');
    
    errorDiv.style.display = 'none';
    resultDiv.style.display = 'none';
    
    if (!bankCode) {
        showError(errorDiv, '⚠️ Please select a bank');
        return;
    }
    
    // Filter results
    const results = Object.values(ifscCodeDatabase).filter(item => {
        const bankMatch = item.ifscCode.startsWith(bankCode);
        const branchMatch = !branchName || item.branchName.toUpperCase().includes(branchName.toUpperCase());
        const cityMatch = !city || item.city.toUpperCase().includes(city.toUpperCase());
        const stateMatch = !state || item.state === state;
        
        return bankMatch && branchMatch && cityMatch && stateMatch;
    });
    
    if (results.length > 0) {
        displayBankResults(results);
        resultDiv.style.display = 'block';
    } else {
        showError(errorDiv, '❌ No branches found with those criteria.');
    }
}

function displayBankResults(results) {
    const listDiv = document.getElementById('bankResultList');
    listDiv.innerHTML = '';
    
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'bank-result-item';
        resultItem.innerHTML = `
            <div class="result-item">
                <label>IFSC Code:</label>
                <span class="highlight">${result.ifscCode}</span>
            </div>
            <div class="result-item">
                <label>Branch Name:</label>
                <span>${result.branchName}</span>
            </div>
            <div class="result-item">
                <label>Location:</label>
                <span>${result.location}, ${result.state}</span>
            </div>
            <hr>
        `;
        listDiv.appendChild(resultItem);
    });
}

// Helper function to show errors
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

// Keyboard support
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('village').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchZipCode();
    });
    
    document.getElementById('ifscCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchByIFSC();
    });
});
