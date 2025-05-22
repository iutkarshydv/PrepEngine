/**
 * PrepEngine Header Initialization
 * This file handles the header functionality including authentication state and side panel
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing header...');
    initializeHeader();
});

/**
 * Initialize the header functionality
 */
function initializeHeader() {
    console.log('Header initialization started');
    
    // Check if user is logged in via token
    const token = localStorage.getItem('token');
    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) {
        console.error('Error parsing currentUser from localStorage:', e);
        // If there's an error parsing the user, try to fetch the user data again
        if (token) {
            console.log('Token exists but user data is invalid, fetching user data again');
            fetchCurrentUser();
            return; // Exit and let the fetch callback handle initialization
        }
    }
    
    console.log('Auth state:', { token: !!token, currentUser: !!currentUser });
    if (currentUser) console.log('User name:', currentUser.name);
    
    updateUIBasedOnAuthState(token, currentUser);
}

/**
 * Fetch current user data from the API
 */
function fetchCurrentUser() {
    if (!API || !API.auth || !API.auth.getCurrentUser) {
        console.error('API not available for getCurrentUser');
        return;
    }
    
    console.log('Fetching current user data from API');
    API.auth.getCurrentUser()
        .then(userData => {
            console.log('User data fetched successfully:', userData);
            updateUIBasedOnAuthState(localStorage.getItem('token'), userData);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            // Clear invalid token
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            updateUIBasedOnAuthState(null, null);
        });
}

/**
 * Update UI elements based on authentication state
 */
function updateUIBasedOnAuthState(token, currentUser) {
    if (token && currentUser) {
        console.log('User is authenticated, updating UI');
        // Hide auth links and show user menu
        const authLinks = document.getElementById('auth-links');
        const userMenu = document.getElementById('user-menu');
        const userName = document.querySelector('#user-name span');
        
        console.log('UI elements:', { 
            authLinks: !!authLinks, 
            userMenu: !!userMenu, 
            userName: !!userName 
        });
        
        if (authLinks) authLinks.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userName) userName.textContent = currentUser.name || 'User';
        
        // Update side panel
        const sidePanelAuthLinks = document.getElementById('side-panel-auth-links');
        const sidePanelUserLinks = document.getElementById('side-panel-user-links');
        
        console.log('Side panel elements:', { 
            sidePanelAuthLinks: !!sidePanelAuthLinks, 
            sidePanelUserLinks: !!sidePanelUserLinks 
        });
        
        if (sidePanelAuthLinks) sidePanelAuthLinks.style.display = 'none';
        if (sidePanelUserLinks) sidePanelUserLinks.style.display = 'block';
        
        // Handle logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
        
        // Side panel logout functionality
        const sidePanelLogout = document.getElementById('side-panel-logout');
        if (sidePanelLogout) {
            sidePanelLogout.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    } else {
        // User is not logged in, show auth links and hide user menu
        console.log('User is not authenticated, updating UI');
        const authLinks = document.getElementById('auth-links');
        const userMenu = document.getElementById('user-menu');
        
        if (authLinks) authLinks.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
        
        // Update side panel
        const sidePanelAuthLinks = document.getElementById('side-panel-auth-links');
        const sidePanelUserLinks = document.getElementById('side-panel-user-links');
        
        if (sidePanelAuthLinks) sidePanelAuthLinks.style.display = 'block';
        if (sidePanelUserLinks) sidePanelUserLinks.style.display = 'none';
    }
    
    setupHamburgerMenu();
}

/**
 * Setup the hamburger menu functionality
 */
function setupHamburgerMenu() {
    console.log('Setting up hamburger menu');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidePanel = document.getElementById('side-panel');
    const closeBtn = document.getElementById('close-panel-btn');
    const overlay = document.getElementById('overlay');
    
    console.log('Hamburger elements:', { 
        hamburgerBtn: !!hamburgerBtn, 
        sidePanel: !!sidePanel, 
        closeBtn: !!closeBtn, 
        overlay: !!overlay 
    });
    
    if (hamburgerBtn && sidePanel && overlay) {
        console.log('Adding hamburger click event listener');
        // Open side panel
        hamburgerBtn.addEventListener('click', function() {
            console.log('Hamburger button clicked');
            sidePanel.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
        
        // Close side panel function
        const closePanel = function() {
            console.log('Closing side panel');
            sidePanel.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = ''; // Re-enable scrolling
        };
        
        // Add close event listeners
        if (closeBtn) closeBtn.addEventListener('click', closePanel);
        overlay.addEventListener('click', closePanel);
    } else {
        console.error('Missing required elements for hamburger menu');
    }
}

/**
 * Handle user logout
 */
function logout() {
    console.log('Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

/**
 * Load the header include file
 */
function loadHeader() {
    console.log('Loading header HTML...');
    fetch('includes/header.html')
        .then(response => response.text())
        .then(data => {
            console.log('Header HTML loaded, inserting into DOM');
            document.getElementById('header-container').innerHTML = data;
            
            // Make sure API is loaded before initializing header
            if (typeof API === 'undefined') {
                console.log('API not loaded yet, loading API.js');
                // Create script element for API.js if it doesn't exist
                if (!document.querySelector('script[src="js/api.js"]')) {
                    const script = document.createElement('script');
                    script.src = 'js/api.js';
                    script.onload = function() {
                        console.log('API.js loaded, initializing header');
                        setTimeout(initializeHeader, 100);
                    };
                    document.head.appendChild(script);
                } else {
                    // API script exists but might not be loaded yet
                    setTimeout(function() {
                        console.log('Waiting for API to be available');
                        if (typeof API !== 'undefined') {
                            initializeHeader();
                        } else {
                            console.error('API still not available after waiting');
                        }
                    }, 200);
                }
            } else {
                // API is already loaded, initialize header
                console.log('API already loaded, initializing header');
                setTimeout(initializeHeader, 100);
            }
        })
        .catch(error => console.error('Error loading header:', error));
}
