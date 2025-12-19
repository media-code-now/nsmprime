/**
 * Contact Popup System
 * Shows a contact popup after 10 seconds with a persistent teaser
 */

class ContactPopup {
    constructor() {
        this.popup = null;
        this.teaser = null;
        this.formModal = null;
        this.isPopupShown = false;
        this.isTeaserShown = false;
        this.isFormModalShown = false;
        this.showDelay = 10000; // 10 seconds
        this.init();
    }

    init() {
        this.createPopup();
        this.createTeaser();
        this.createFormModal();
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
                            <span>App Development</span>
                        </div>
                        <div class="feature-item">
                            <i class="fa fa-check-circle"></i>
                            <span>E-commerce Development</span>
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

    createFormModal() {
        const formModal = document.createElement('div');
        formModal.className = 'contact-form-overlay';
        formModal.innerHTML = `
            <div class="contact-form-modal">
                <button class="contact-form-close" aria-label="Close form">
                    <i class="fa fa-times"></i>
                </button>
                <div class="contact-form-header">
                    <div class="contact-form-icon">
                        <i class="fa fa-handshake"></i>
                    </div>
                    <h3>Get Your Free Consultation</h3>
                    <p>Tell us about your project and we'll get back to you within 24 hours!</p>
                </div>
                <div class="contact-form-body">
                    <form class="contact-form" id="contact-lead-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contact-name">Full Name *</label>
                                <input type="text" id="contact-name" name="name" required placeholder="Enter your full name">
                            </div>
                            <div class="form-group">
                                <label for="contact-email">Email Address *</label>
                                <input type="email" id="contact-email" name="email" required placeholder="Enter your email">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contact-phone">Phone Number</label>
                                <input type="tel" id="contact-phone" name="phone" placeholder="Enter your phone number">
                            </div>
                            <div class="form-group">
                                <label for="contact-service">Service Interested In</label>
                                <select id="contact-service" name="service">
                                    <option value="">Select a service</option>
                                    <option value="web-development">Web Development</option>
                                    <option value="seo">SEO Services</option>
                                    <option value="digital-marketing">Digital Marketing</option>
                                    <option value="app-development">App Development</option>
                                    <option value="graphic-design">Graphic Design</option>
                                    <option value="ecommerce-development">E-commerce Development</option>
                                    <option value="video-production">Video Production</option>
                                    <option value="ppc-ads">PPC Advertising</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="contact-subject">Project Details *</label>
                            <textarea id="contact-subject" name="subject" required rows="4" placeholder="Tell us about your project, goals, and budget..."></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="contact-form-submit">
                                <i class="fa fa-paper-plane"></i>
                                Send My Request
                            </button>
                        </div>
                        <div class="form-guarantee">
                            <i class="fa fa-lock"></i>
                            <span>Your information is secure and will never be shared</span>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(formModal);
        this.formModal = formModal;
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

        // Click teaser to open contact form
        this.teaser.querySelector('.contact-teaser-content').addEventListener('click', (e) => {
            if (!e.target.classList.contains('contact-teaser-close') && !e.target.parentElement.classList.contains('contact-teaser-close')) {
                this.openContactForm();
                this.trackEvent('contact_teaser_clicked');
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

        // Track email clicks for analytics - now opens form instead
        this.popup.querySelector('a[href$="contacts.html"]').addEventListener('click', (e) => {
            e.preventDefault();
            this.openContactForm();
            this.trackEvent('contact_popup_form_opened');
        });

        // Form modal event listeners
        this.formModal.querySelector('.contact-form-close').addEventListener('click', () => {
            this.closeContactForm();
        });

        // Close form when clicking overlay
        this.formModal.addEventListener('click', (e) => {
            if (e.target === this.formModal) {
                this.closeContactForm();
            }
        });

        // Handle form submission
        this.formModal.querySelector('#contact-lead-form').addEventListener('submit', (e) => {
            this.handleFormSubmission(e);
        });

        // Close form with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFormModalShown) {
                this.closeContactForm();
            }
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

    openContactForm() {
        this.formModal.style.display = 'flex';
        setTimeout(() => {
            this.formModal.classList.add('active');
        }, 10);
        this.isFormModalShown = true;
        
        // Close the main popup if it's open
        if (this.isPopupShown) {
            this.popup.classList.remove('active');
            setTimeout(() => {
                this.popup.style.display = 'none';
            }, 300);
            this.isPopupShown = false;
        }
        
        // Prevent body scroll
        document.body.classList.add('popup-open');
        this.trackEvent('contact_form_opened');
    }

    closeContactForm() {
        if (this.isFormModalShown) {
            this.formModal.classList.remove('active');
            setTimeout(() => {
                this.formModal.style.display = 'none';
            }, 300);
            this.isFormModalShown = false;
            
            // Re-enable body scroll
            document.body.classList.remove('popup-open');
            
            // Show teaser after form is closed
            this.showTeaser();
            
            this.trackEvent('contact_form_closed');
        }
    }

    handleFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('.contact-form-submit');
        const formData = new FormData(form);
        
        // Validate required fields
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        
        if (!name || !email || !subject) {
            this.showFormError('Please fill in all required fields.');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showFormError('Please enter a valid email address.');
            return;
        }
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa fa-spinner"></i> Sending...';
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            this.showFormSuccess();
            this.trackEvent('contact_form_submitted');
        }, 2000);
    }

    showFormError(message) {
        // You can enhance this with better error display
        alert(message);
    }

    showFormSuccess() {
        const formBody = this.formModal.querySelector('.contact-form-body');
        formBody.innerHTML = `
            <div class="form-success">
                <i class="fa fa-check-circle"></i>
                <h3>Thank You!</h3>
                <p>Your request has been sent successfully. We'll get back to you within 24 hours!</p>
                <button class="contact-popup-btn contact-popup-btn-primary" onclick="location.reload()">
                    <i class="fa fa-home"></i>
                    Continue Browsing
                </button>
            </div>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only show on main pages, not on contact page
    if (!window.location.pathname.includes('contacts.html')) {
        new ContactPopup();
    }
});