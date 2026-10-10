import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { sendContactMessage } from '../services/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _gotcha: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  function validateClientSide() {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 2) {
      errors.subject = 'Subject must be at least 2 characters';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }
    return errors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError(null);

    // Client-side validation check
    const errors = validateClientSide();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setStatus('submitting');

    try {
      await sendContactMessage(formData);
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        _gotcha: '',
      });
      setFieldErrors({});
    } catch (err) {
      setStatus('error');
      if (err.details && err.details.length > 0) {
        const mappedErrors = {};
        err.details.forEach((item) => {
          mappedErrors[item.field] = item.message;
        });
        setFieldErrors(mappedErrors);
      }
      setServerError(err.message || 'Failed to deliver message. Please try again or email directly.');
    }
  }

  function handleReset() {
    setStatus('idle');
    setServerError(null);
    setFieldErrors({});
  }

  if (status === 'success') {
    return (
      <div className="contact-panel form-panel-success" role="status" aria-live="polite">
        <div className="panel-top">
          <span className="panel-live"><span /> MESSAGE TRANSMITTED</span>
          <CheckCircle2 size={19} className="text-emerald-400" />
        </div>
        <div className="success-icon-box">
          <Sparkles size={32} />
        </div>
        <h3>Thank you!</h3>
        <p className="success-copy">
          Your message has been received. I review every note personally and will get back to you shortly.
        </p>
        <button
          type="button"
          className="button button-quiet panel-button"
          onClick={handleReset}
        >
          Send another message
        </button>
        <span className="panel-coordinate">STATUS: DELIVERED</span>
      </div>
    );
  }

  return (
    <div className="contact-panel">
      <div className="panel-top">
        <span className="panel-live"><span /> AVAILABLE FOR OPPORTUNITIES</span>
        <Send size={18} />
      </div>

      <div className="panel-header-copy">
        <h3>Send a message</h3>
        <p>Have an interesting project, question, or opportunity? Drop a note below.</p>
      </div>

      {serverError && (
        <div className="form-alert form-alert-error" role="alert">
          <AlertCircle size={16} />
          <span>{serverError}</span>
        </div>
      )}

      <form className="portfolio-contact-form" onSubmit={handleSubmit} noValidate>
        {/* Honeypot field (hidden from genuine users, catches bots) */}
        <input
          type="text"
          name="_gotcha"
          value={formData._gotcha}
          onChange={handleChange}
          tabIndex="-1"
          autoComplete="off"
          style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          aria-hidden="true"
        />

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact-name">
              Name <span className="req">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              disabled={status === 'submitting'}
              className={fieldErrors.name ? 'input-error' : ''}
              required
            />
            {fieldErrors.name && <span className="field-error-msg">{fieldErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contact-email">
              Email <span className="req">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@domain.com"
              disabled={status === 'submitting'}
              className={fieldErrors.email ? 'input-error' : ''}
              required
            />
            {fieldErrors.email && <span className="field-error-msg">{fieldErrors.email}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="contact-subject">
            Subject <span className="req">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Internship Inquiry / Full-Stack Project"
            disabled={status === 'submitting'}
            className={fieldErrors.subject ? 'input-error' : ''}
            required
          />
          {fieldErrors.subject && <span className="field-error-msg">{fieldErrors.subject}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contact-message">
            Message <span className="req">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            placeholder="What's on your mind? Tell me about the role, project, or idea..."
            disabled={status === 'submitting'}
            className={fieldErrors.message ? 'input-error' : ''}
            required
          />
          {fieldErrors.message && <span className="field-error-msg">{fieldErrors.message}</span>}
        </div>

        <button
          type="submit"
          className="button button-primary form-submit-btn"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Sending message...</span>
            </>
          ) : (
            <>
              <span>Send message</span>
              <Send size={15} />
            </>
          )}
        </button>
      </form>

      <span className="panel-coordinate">12.9716° N / 77.5946° E</span>
    </div>
  );
}

