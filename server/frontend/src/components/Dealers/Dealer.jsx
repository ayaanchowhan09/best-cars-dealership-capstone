import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const sentimentClass = (value) => value === 'positive' ? 'positive' : value === 'negative' ? 'negative' : 'neutral';

const Dealer = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`/djangoapp/dealer/${id}`).then((response) => response.json()),
      fetch(`/djangoapp/reviews/dealer/${id}`).then((response) => response.json()),
    ]).then(([dealerPayload, reviewPayload]) => {
      setDealer(dealerPayload.dealer?.[0] || null);
      setReviews(reviewPayload.reviews || []);
    });
  }, [id]);

  if (!dealer) return <><Header /><main className="content_wrap"><p>Loading dealership…</p></main></>;
  return (
    <div className="page_shell">
      <Header />
      <main className="content_wrap">
        <a className="back_link" href="/dealers">← Back to dealerships</a>
        <section className="dealer_hero">
          <div><p className="eyebrow">DEALER DETAILS</p><h1>{dealer.full_name}</h1><p>{dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}</p></div>
          {sessionStorage.getItem('username') && <a className="primary_button" href={`/postreview/${id}`}>Post a review</a>}
        </section>
        <section className="reviews_section">
          <div className="section_heading"><div><p className="eyebrow">CUSTOMER VOICE</p><h2>Reviews for {dealer.short_name}</h2></div><span className="review_count">{reviews.length} reviews</span></div>
          <div className="review_grid">
            {reviews.map((review) => <article className="review_card" key={review.id}>
              <div className={`sentiment_dot ${sentimentClass(review.sentiment)}`} title={`${review.sentiment} sentiment`}></div>
              <p className="review_text">“{review.review}”</p>
              <p className="review_meta">{review.name} · {review.car_make} {review.car_model} · {review.car_year}</p>
              <p className="review_date">Purchased {review.purchase_date}</p>
            </article>)}
            {!reviews.length && <p className="empty_state">No reviews yet. Be the first to share your experience.</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dealer;
