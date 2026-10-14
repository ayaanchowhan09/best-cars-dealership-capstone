import React, { useEffect, useState } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(new URLSearchParams(window.location.search).get('state') || 'All');
  const isLoggedIn = Boolean(sessionStorage.getItem("username"));

  const getDealers = async (state = 'All') => {
    const endpoint = state && state !== 'All'
      ? `/djangoapp/get_dealers/${encodeURIComponent(state)}`
      : '/djangoapp/get_dealers/';
    const response = await fetch(endpoint);
    const payload = await response.json();
    if (payload.status === 200) {
      setDealersList(payload.dealers || []);
      if (!states.length) setStates([...new Set((payload.dealers || []).map((item) => item.state))].sort());
    }
  };

  const filterDealers = (state) => {
    setSelectedState(state);
    window.history.replaceState({}, '', `/dealers?state=${encodeURIComponent(state)}`);
    getDealers(state);
  };

  // The state value is the only intentional trigger for this request.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { getDealers(selectedState); }, [selectedState]);

  return (
    <div className="page_shell">
      <Header />
      <main className="content_wrap">
        <div className="page_intro">
          <div>
            <p className="eyebrow">NATIONWIDE NETWORK</p>
            <h1>Find a dealership</h1>
            <p>Explore trusted local teams, compare locations, and read real customer reviews.</p>
          </div>
          <label className="state_filter">Filter by state
            <select value={selectedState} onChange={(event) => filterDealers(event.target.value)} aria-label="Filter dealers by state">
              <option value="All">All States</option>
              {states.map((state) => <option key={state} value={state}>{state}</option>)}
            </select>
          </label>
        </div>
        <div className="table_card">
          <table className="dealer_table">
            <thead><tr><th>ID</th><th>Dealer</th><th>City</th><th>Address</th><th>ZIP</th><th>State</th>{isLoggedIn && <th>Review Dealer</th>}</tr></thead>
            <tbody>
              {dealersList.map((dealer) => <tr key={dealer.id}>
                <td>{dealer.id}</td>
                <td><a className="dealer_link" href={`/dealer/${dealer.id}`}>{dealer.full_name}</a></td>
                <td>{dealer.city}</td><td>{dealer.address}</td><td>{dealer.zip}</td><td><span className="state_badge">{dealer.state}</span></td>
                {isLoggedIn && <td><a className="review_cta" href={`/postreview/${dealer.id}`}>Review Dealer <span>→</span></a></td>}
              </tr>)}
            </tbody>
          </table>
          {!dealersList.length && <p className="empty_state">No dealerships were found for this state.</p>}
        </div>
      </main>
    </div>
  );
};

export default Dealers;
