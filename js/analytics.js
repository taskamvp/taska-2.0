// js/analytics.js - Google Analytics utility functions

// Check if Google Analytics is available
function isAnalyticsAvailable() {
    return typeof gtag !== 'undefined' && typeof window !== 'undefined';
}

// Check if user has consented to analytics
function hasAnalyticsConsent() {
    return localStorage.getItem('cookieConsent') === 'accepted';
}

// Track page views
export function trackPageView(pageTitle = null, pagePath = null) {
    if (!isAnalyticsAvailable() || !hasAnalyticsConsent()) {
        return;
    }
    
    gtag('event', 'page_view', {
        'page_title': pageTitle || document.title,
        'page_location': window.location.href,
        'page_path': pagePath || window.location.pathname
    });
}

// Track custom events
export function trackEvent(eventName, parameters = {}) {
    if (!isAnalyticsAvailable() || !hasAnalyticsConsent()) {
        return;
    }
    
    gtag('event', eventName, parameters);
}

// Track user engagement events
export function trackEngagement(action, label = null, value = null) {
    trackEvent('engagement', {
        'event_category': 'user_interaction',
        'event_label': label || action,
        'value': value
    });
}

// Track conversion events
export function trackConversion(action, label = null, value = null) {
    trackEvent('conversion', {
        'event_category': 'conversion',
        'event_label': label || action,
        'value': value
    });
}

// Track form submissions
export function trackFormSubmission(formName, formData = {}) {
    trackEvent('form_submit', {
        'event_category': 'engagement',
        'event_label': formName,
        'form_data': JSON.stringify(formData)
    });
}

// Track button clicks
export function trackButtonClick(buttonText, buttonLocation = null) {
    trackEvent('button_click', {
        'event_category': 'engagement',
        'event_label': buttonText,
        'button_location': buttonLocation || 'unknown'
    });
}

// Track search events
export function trackSearch(searchTerm, searchType = 'general') {
    trackEvent('search', {
        'event_category': 'engagement',
        'event_label': searchType,
        'search_term': searchTerm
    });
}

// Track user registration
export function trackRegistration(userType) {
    trackEvent('sign_up', {
        'event_category': 'conversion',
        'event_label': userType,
        'method': 'email'
    });
}

// Track user login
export function trackLogin(userType) {
    trackEvent('login', {
        'event_category': 'engagement',
        'event_label': userType,
        'method': 'email'
    });
}

// Track task creation
export function trackTaskCreation(taskType) {
    trackEvent('task_creation', {
        'event_category': 'conversion',
        'event_label': taskType
    });
}

// Track task completion
export function trackTaskCompletion(taskType) {
    trackEvent('task_completion', {
        'event_category': 'conversion',
        'event_label': taskType
    });
}

// Track connection requests
export function trackConnectionRequest(userType) {
    trackEvent('connection_request', {
        'event_category': 'engagement',
        'event_label': userType
    });
}

// Track profile views
export function trackProfileView(profileType) {
    trackEvent('profile_view', {
        'event_category': 'engagement',
        'event_label': profileType
    });
}

// Track file uploads
export function trackFileUpload(fileType, fileSize = null) {
    trackEvent('file_upload', {
        'event_category': 'engagement',
        'event_label': fileType,
        'file_size': fileSize
    });
}

// Track error events
export function trackError(errorType, errorMessage = null) {
    trackEvent('error', {
        'event_category': 'error',
        'event_label': errorType,
        'error_message': errorMessage
    });
}

// Track performance metrics
export function trackPerformance(metricName, value) {
    trackEvent('performance', {
        'event_category': 'performance',
        'event_label': metricName,
        'value': value
    });
}

// Initialize analytics for a page
export function initAnalytics() {
    // Track initial page view
    trackPageView();
    
    // Track user type if available
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
        trackEvent('user_type', {
            'event_category': 'user',
            'event_label': userRole
        });
    }
}

// Setup common event listeners for analytics
export function setupCommonAnalytics() {
    // Track external link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.hostname !== window.location.hostname) {
            trackEvent('external_link_click', {
                'event_category': 'engagement',
                'event_label': link.hostname,
                'link_url': link.href
            });
        }
    });
    
    // Track form submissions
    document.addEventListener('submit', function(e) {
        const form = e.target;
        const formName = form.getAttribute('id') || form.getAttribute('class') || 'unknown_form';
        trackFormSubmission(formName);
    });
    
    // Track button clicks (general)
    document.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (button && !button.hasAttribute('data-analytics-tracked')) {
            const buttonText = button.textContent.trim();
            if (buttonText) {
                trackButtonClick(buttonText, button.closest('section')?.className || 'unknown');
                button.setAttribute('data-analytics-tracked', 'true');
            }
        }
    });
}

// Export default analytics object
export default {
    trackPageView,
    trackEvent,
    trackEngagement,
    trackConversion,
    trackFormSubmission,
    trackButtonClick,
    trackSearch,
    trackRegistration,
    trackLogin,
    trackTaskCreation,
    trackTaskCompletion,
    trackConnectionRequest,
    trackProfileView,
    trackFileUpload,
    trackError,
    trackPerformance,
    initAnalytics,
    setupCommonAnalytics
}; 