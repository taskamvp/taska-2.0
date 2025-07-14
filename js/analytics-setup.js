// js/analytics-setup.js - Simple Google Analytics setup for other pages

// Google Analytics 4 Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Set default consent to denied (GDPR compliant)
gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied'
});

gtag('config', 'G-ESJMBXMH7Q', {
    'anonymize_ip': true,
    'allow_google_signals': false,
    'allow_ad_personalization_signals': false
});

// Check and apply user consent
function applyAnalyticsConsent() {
    const consent = localStorage.getItem('cookieConsent');
    
    if (consent === 'accepted') {
        gtag('consent', 'update', { 
            'analytics_storage': 'granted',
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted'
        });
        
        // Track page view if consent is granted
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href,
            'page_path': window.location.pathname
        });
    }
}

// Apply consent on page load
document.addEventListener('DOMContentLoaded', applyAnalyticsConsent);

// Simple tracking function for other pages
function trackEvent(eventName, parameters = {}) {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted' && typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}

// Make tracking function globally available
window.trackEvent = trackEvent; 