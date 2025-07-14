# Google Analytics Implementation Guide

This document explains how Google Analytics 4 (GA4) has been implemented in the Taska project with GDPR-compliant consent management.

## Overview

The project uses Google Analytics 4 with the measurement ID `G-ESJMBXMH7Q`. Analytics tracking is disabled by default and only enabled when users provide explicit consent through the cookie consent popup.

## Files Structure

```
├── index.html                    # Main page with full analytics implementation
├── js/
│   ├── analytics.js             # Comprehensive analytics utility functions
│   └── analytics-setup.js       # Simple analytics setup for other pages
└── ANALYTICS_README.md          # This documentation file
```

## Implementation Details

### 1. Main Page (index.html)

The main page includes:
- Google Analytics 4 script loading
- Firebase Analytics integration
- GDPR-compliant consent management
- Custom event tracking for user interactions
- Cookie consent popup with accept/decline functionality

### 2. Analytics Utility (js/analytics.js)

Provides comprehensive tracking functions:
- `trackPageView()` - Track page views
- `trackEvent()` - Track custom events
- `trackEngagement()` - Track user engagement
- `trackConversion()` - Track conversion events
- `trackFormSubmission()` - Track form submissions
- `trackButtonClick()` - Track button clicks
- `trackSearch()` - Track search events
- `trackRegistration()` - Track user registrations
- `trackLogin()` - Track user logins
- `trackTaskCreation()` - Track task creation
- `trackTaskCompletion()` - Track task completion
- `trackConnectionRequest()` - Track connection requests
- `trackProfileView()` - Track profile views
- `trackFileUpload()` - Track file uploads
- `trackError()` - Track error events
- `trackPerformance()` - Track performance metrics

### 3. Simple Setup (js/analytics-setup.js)

For other pages that need basic analytics:
- Basic GA4 configuration
- Consent management
- Simple `trackEvent()` function

## Usage Examples

### Adding Analytics to a New Page

1. **For pages with basic tracking needs:**
```html
<!-- Add to <head> section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ESJMBXMH7Q"></script>
<script src="js/analytics-setup.js"></script>

<!-- Track events in your JavaScript -->
<script>
document.getElementById('myButton').addEventListener('click', function() {
    trackEvent('button_click', {
        'event_category': 'engagement',
        'event_label': 'my_button'
    });
});
</script>
```

2. **For pages with comprehensive tracking:**
```html
<!-- Add to <head> section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ESJMBXMH7Q"></script>
<script type="module">
import { initAnalytics, trackButtonClick, trackFormSubmission } from './js/analytics.js';

// Initialize analytics
initAnalytics();

// Track specific events
document.getElementById('myButton').addEventListener('click', function() {
    trackButtonClick('My Button', 'main_section');
});

document.getElementById('myForm').addEventListener('submit', function() {
    trackFormSubmission('contact_form');
});
</script>
```

### Tracking Common Events

```javascript
// Track page view
trackPageView('Custom Page Title', '/custom-path');

// Track button click
trackButtonClick('Sign Up', 'hero_section');

// Track form submission
trackFormSubmission('contact_form', { form_type: 'contact' });

// Track search
trackSearch('web development', 'ai_search');

// Track user registration
trackRegistration('student');

// Track task creation
trackTaskCreation('web_development');

// Track error
trackError('form_validation', 'Email is required');
```

## Consent Management

The analytics implementation includes GDPR-compliant consent management:

### Cookie Consent States
- **Default**: Analytics disabled
- **Accepted**: Analytics enabled, all tracking active
- **Declined**: Analytics disabled, tracking cookies cleared

### Consent Functions
```javascript
// Check current consent
const consent = localStorage.getItem('cookieConsent');

// Enable analytics (called when user accepts)
function enableAnalytics() {
    gtag('consent', 'update', { 
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
    });
}

// Disable analytics (called when user declines)
function disableAnalytics() {
    gtag('consent', 'update', { 
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
    });
}
```

## Privacy Features

1. **IP Anonymization**: Enabled by default
2. **Google Signals**: Disabled by default
3. **Ad Personalization**: Disabled by default
4. **Consent Required**: Analytics only works with explicit user consent
5. **Cookie Clearing**: Tracking cookies are cleared when consent is declined

## Event Categories

The analytics implementation uses consistent event categories:

- **engagement**: User interactions (clicks, form submissions, etc.)
- **conversion**: Business goals (signups, purchases, task completions)
- **error**: Error events
- **performance**: Performance metrics
- **user**: User-related events (login, registration, etc.)

## Testing Analytics

1. **Check Consent**: Ensure `localStorage.getItem('cookieConsent') === 'accepted'`
2. **Browser DevTools**: Use Network tab to see GA4 requests
3. **Google Analytics**: Check Real-Time reports in GA4 dashboard
4. **Console Logs**: Analytics functions log to console when consent is granted

## Troubleshooting

### Analytics Not Working
1. Check if user has consented to cookies
2. Verify GA4 measurement ID is correct (`G-ESJMBXMH7Q`)
3. Check browser console for errors
4. Ensure gtag function is available

### Consent Issues
1. Clear localStorage and test consent flow
2. Check cookie consent popup functionality
3. Verify consent functions are called correctly

### Event Tracking Issues
1. Check if `trackEvent` function is available
2. Verify event parameters are correct
3. Check browser console for errors

## Best Practices

1. **Always check consent** before tracking events
2. **Use consistent event names** and categories
3. **Include relevant parameters** for better insights
4. **Test analytics** in development environment
5. **Respect user privacy** and GDPR requirements
6. **Document custom events** for team reference

## GA4 Dashboard Setup

In your Google Analytics 4 dashboard, you can create custom reports for:

1. **User Engagement**: Track button clicks, form submissions, page views
2. **Conversions**: Monitor signups, task creations, completions
3. **User Journey**: Analyze user flow through the application
4. **Error Tracking**: Monitor and fix user-facing errors
5. **Performance**: Track page load times and user experience

## Support

For questions about the analytics implementation:
1. Check this documentation
2. Review the code comments
3. Test with browser dev tools
4. Check Google Analytics 4 documentation 