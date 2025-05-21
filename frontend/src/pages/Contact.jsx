import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    nume: '',
    email: '',
    mesaj: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Se trimite mesajul...' });

    try {
      const response = await axios.post('http://localhost:8080/api/contact/send', formData, {
        withCredentials: true
      });

      if (response.status === 200) {
        setStatus({ type: 'success', message: 'Mesaj trimis cu succes!' });
        setFormData({ nume: '', email: '', mesaj: '' });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data || 'A apărut o eroare la trimiterea mesajului. Vă rugăm să încercați din nou.' 
      });
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">Contact us</h2>

      <div className="row">
        {/* Formularul */}
        <div className="col-md-7">
          <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
            {status.message && (
              <div className={`alert alert-${status.type === 'error' ? 'danger' : status.type === 'success' ? 'success' : 'info'} mb-3`}>
                {status.message}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="nume" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="nume"
                name="nume"
                value={formData.nume}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="mesaj" className="form-label">Message</label>
              <textarea
                className="form-control"
                id="mesaj"
                name="mesaj"
                rows="4"
                value={formData.mesaj}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={status.type === 'loading'}
            >
              {status.type === 'loading' ? 'Se trimite...' : 'Send'}
            </button>
          </form>
        </div>

        {/* Datele de contact */}
        <div className="col-md-5 mt-4 mt-md-0">
          <div className="p-4 border rounded shadow bg-light h-100">
            <h5>Contact</h5>
            <p><strong>Name:</strong> Andrei Diana-Andreea</p>
            <p><strong>Email:</strong> andrei.diana370@gmail.com</p>
            <p><strong>Phone:</strong> +40 725 091 366</p>
            <p><strong>Address:</strong> ATM, Bucharest, Romania</p>
            
            <hr />
            <p><strong>Program:</strong><br />Monday – Friday: 09:00 – 17:00<br />Saturday – Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
