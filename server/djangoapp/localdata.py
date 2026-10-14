"""Small local data adapter used by the capstone demo.

The original course project expects a Node/Mongo service.  Keeping the sample
dealers and reviews behind this adapter makes the Django application runnable
locally (and in a single deployment) while preserving the same API contract.
"""

from __future__ import annotations

import json
from pathlib import Path
from threading import Lock
from typing import Any


DATA_DIR = Path(__file__).resolve().parent.parent / "database" / "data"
REVIEWS_FILE = DATA_DIR / "reviews.json"
DEALERS_FILE = DATA_DIR / "dealerships.json"
_reviews_lock = Lock()


def _read_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _write_json(path: Path, payload: dict[str, Any]) -> None:
    temporary = path.with_suffix(".tmp")
    with temporary.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
    temporary.replace(path)


def dealers(state: str | None = None) -> list[dict[str, Any]]:
    rows = _read_json(DEALERS_FILE).get("dealerships", [])
    if not state or state.lower() in {"all", "all states"}:
        return rows
    return [row for row in rows if row.get("state", "").lower() == state.lower()]


def dealer(dealer_id: int) -> dict[str, Any] | None:
    return next((row for row in dealers() if int(row["id"]) == int(dealer_id)), None)


def _sentiment(text: str) -> str:
    positive = {"amazing", "excellent", "fantastic", "great", "helpful", "love", "perfect", "wonderful"}
    negative = {"awful", "bad", "broken", "poor", "terrible", "worst"}
    words = {word.strip(".,!?;:()").lower() for word in text.split()}
    score = len(words & positive) - len(words & negative)
    return "positive" if score > 0 else "negative" if score < 0 else "neutral"


def reviews(dealer_id: int | None = None) -> list[dict[str, Any]]:
    rows = _read_json(REVIEWS_FILE).get("reviews", [])
    if dealer_id is not None:
        rows = [row for row in rows if int(row.get("dealership", -1)) == int(dealer_id)]
    for row in rows:
        row["sentiment"] = _sentiment(row.get("review", ""))
    return rows


def add_review(payload: dict[str, Any]) -> dict[str, Any]:
    with _reviews_lock:
        document = _read_json(REVIEWS_FILE)
        rows = document.setdefault("reviews", [])
        next_id = max((int(row.get("id", 0)) for row in rows), default=0) + 1
        review = {
            "id": next_id,
            "name": payload.get("name", "Guest Reviewer"),
            "dealership": int(payload["dealership"]),
            "review": payload.get("review", "").strip(),
            "purchase": bool(payload.get("purchase", True)),
            "purchase_date": payload.get("purchase_date", ""),
            "car_make": payload.get("car_make", ""),
            "car_model": payload.get("car_model", ""),
            "car_year": int(payload.get("car_year", 2024)),
        }
        rows.insert(0, review)
        _write_json(REVIEWS_FILE, document)
        review["sentiment"] = _sentiment(review["review"])
        return review


def sentiment(text: str) -> dict[str, str]:
    return {"sentiment": _sentiment(text)}
