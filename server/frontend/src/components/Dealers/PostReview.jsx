import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [cars, setCars] = useState([]);
  const [review, setReview] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [car, setCar] = useState('');
  const [year, setYear] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/djangoapp/dealer/${id}`).then((response) => response.json()).then((data) => setDealer(data.dealer?.[0] || null));
    fetch('/djangoapp/get_cars').then((response) => response.json()).then((data) => setCars(data.CarModels || []));
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    const [make, model] = car.split('|');
    if (!review || !purchaseDate || !car || !year) { setMessage('Please complete every field before posting.'); return; }
    const response = await fetch('/djangoapp/add_review', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ dealership: id, review, purchase: true, purchase_date: purchaseDate, car_make: make, car_model: model, car_year: year }) });
    const data = await response.json();
    if (data.status === 200) window.location.href = `/dealer/${id}`;
    else setMessage(data.message || 'We could not post the review.');
  };

  return <div className="page_shell"><Header /><main className="content_wrap review_form_page">
    <a className="back_link" href={`/dealer/${id}`}>← Back to dealer</a>
    <section className="form_card">
      <p className="eyebrow">SHARE YOUR EXPERIENCE</p>
      <h1>Post a review{dealer ? ` for ${dealer.short_name}` : ''}</h1>
      <p className="form_intro">Your feedback helps other drivers choose with confidence.</p>
      <form onSubmit={submitReview}>
        <label>Review<textarea value={review} onChange={(event) => setReview(event.target.value)} placeholder="Tell us about the service you received…" rows="5" /></label>
        <div className="form_row"><label>Purchase date<input type="date" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} /></label><label>Car year<input type="number" min="1990" max="2026" value={year} onChange={(event) => setYear(event.target.value)} placeholder="2024" /></label></div>
        <label>Car make and model<select value={car} onChange={(event) => setCar(event.target.value)}><option value="">Choose your vehicle</option>{cars.map((item) => <option key={`${item.CarMake}-${item.CarModel}`} value={`${item.CarMake}|${item.CarModel}`}>{item.CarMake} {item.CarModel}</option>)}</select></label>
        {message && <p className="form_message">{message}</p>}
        <button className="primary_button" type="submit">Post review</button>
      </form>
    </section>
  </main></div>;
};

export default PostReview;
