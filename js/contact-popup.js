/**
 * Contact Popup System
 * Shows a contact popup after 10 seconds with a persistent teaser
 */

class ContactPopup {
    constructor() {
        this.popup = null;
        this.teaser = null;
        this.isPopupShown = false;
        this.isTeaserShown = false;
        this.showDelay = 10000; // 10 seconds
        this.init();
    }

    init() {
        this.createPopup();
        this.createTeaser();
        this.setupEventListeners();
        
        // Show popup after delay
        setTimeout(() => {
            this.showPopup();
        }, this.showDelay);
    }

    createPopup() {
        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.className = 'contact-popup-overlay';
        overlay.innerHTML = `
            <div class="contact-popup">
                <button class="contact-popup-close" aria-label="Close popup">
                    <i class="fa fa-times"></i>
                </button>
                <div class="contact-popup-header">
                    <div class="contact-popup-icon">
                        <i class="fa fa-rocket"></i>
                    </div>
                    <h3>Ready to Grow Your Business?</h3>
                    <p>Get a FREE consultation with our digital marketing experts!</p>
                </div>
                <div class="contact-popup-body">
                    <div class="contact-popup-features">
                        <div class="feature-item">
                            <i class="fa fa-check-circle"></i>
                            <span>Custom Web Design & Development</span>
                        </div>
                        <div class="feature-item">
                            <i class="fa fa-check-circle"></i>
                            <span>SEO & Digital Marketing</span>
                        </div>
                        <div class="feature-item">
                            <i class="fa fa-check-circle"></i>
                            <span>Social Media Management</span>
                        </div>
                        <div class="feature-item">
                            <i class="fa fa-check-circle"></i>
                            <span>Professional Photography</span>
                        </div>
                    </div>
                    <div class="contact-popup-cta">
                        <a href="tel:(917) 972-7298" class="contact-popup-btn contact-popup-btn-primary">
                            <i class="fa fa-phone"></i>
                            Call Now: (917) 972-7298
                        </a>
                        <a href="contacts.html" class="contact-popup-btn contact-popup-btn-secondary">
                            <i class="fa fa-envelope"></i>
                            Get Free Quote
                        </a>
                    </div>
                    <div class="contact-popup-guarantee">
                        <i class="fa fa-shield-alt"></i>
                        <span>100% Free Consultation • No Obligation</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.popup = overlay;
    }

    createTeaser() {
        const teaser = document.createElement('div');
        teaser.className = 'contact-teaser';
        teaser.innerHTML = `
            <div class="contact-teaser-content">
                <div class="contact-teaser-icon">
                    <i class="fa fa-comments"></i>
                </div>
                <div class="contact-teaser-text">
                    <div class="contact-teaser-title">Need Help?</div>
                    <div class="contact-teaser-subtitle">Free Consultation</div>
                </div>
                <button class="contact-teaser-close" aria-label="Close teaser">
                    <i class="fa fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(teaser);
        this.teaser = teaser;
    }

    setupEventListeners() {
        // Close popup button
        this.popup.querySelector('.contact-popup-close').addEventListener('click', () => {
            this.closePopup();
        });

        // Close popup when clicking overlay
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.closePopup();
            }
        });

        // Close teaser button
        this.teaser.querySelector('.contact-teaser-close').addEventListener('click', () => {
            this.closeTeaser();
        });

        // Click teaser to reopen popup
        this.teaser.querySelector('.contact-teaser-content').addEventListener('click', (e) => {
            if (!e.target.classList.contains('contact-teaser-close') && !e.target.parentElement.classList.contains('contact-teaser-close')) {
                this.showPopup();
            }
        });

        // Close popup with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPopupShown) {
                this.closePopup();
            }
        });

        // Track phone clicks for analytics
        this.popup.querySelector('a[href^="tel:"]').addEventListener('click', () => {
            this.trackEvent('contact_popup_phone_click');
        });

        // Track email clicks for analytics
        this.popup.querySelector('a[href$="contacts.html"]').addEventListener('click', () => {
            this.trackEvent('contact_popup_email_click');
        });
    }

    showPopup() {
        if (!this.isPopupShown) {
            this.popup.style.display = 'flex';
            // Trigger animation
            setTimeout(() => {
                this.popup.classList.add('active');
            }, 10);
            this.isPopupShown = true;
            this.trackEvent('contact_popup_shown');
            
            // Prevent body scroll
            document.body.classList.add('popup-open');
        }
    }

    closePopup() {
        if (this.isPopupShown) {
            this.popup.classList.remove('active');
            setTimeout(() => {
                this.popup.style.display = 'none';
            }, 300);
            this.isPopupShown = false;
            
            // Show teaser after popup is closed
            this.showTeaser();
            
            // Re-enable body scroll
            document.body.classList.remove('popup-open');
            
            this.trackEvent('contact_popup_closed');
        }
    }

    showTeaser() {
        if (!this.isTeaserShown) {
            setTimeout(() => {
                this.teaser.classList.add('active');
                this.isTeaserShown = true;
                this.trackEvent('contact_teaser_shown');
            }, 500); // Small delay after popup closes
        }
    }

    closeTeaser() {
        if (this.isTeaserShown) {
            this.teaser.classList.remove('active');
            this.isTeaserShown = false;
            this.trackEvent('contact_teaser_closed');
        }
    }

    trackEvent(eventName) {
        // Google Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': 'contact_popup',
                'event_label': 'user_interaction'
            });
        }
        
        // Console log for debugging
        console.log('Contact Popup Event:', eventName);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only show on main pages, not on contact page
    if (!window.location.pathname.includes('contacts.html')) {
        new ContactPopup();
    }
});