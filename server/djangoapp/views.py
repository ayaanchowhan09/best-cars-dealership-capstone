"""Django views for the Best Cars dealership capstone application."""

from __future__ import annotations

import json
import logging

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET

from .localdata import add_review, dealer, dealers, reviews, sentiment
from .models import CarMake, CarModel
from .populate import initiate

logger = logging.getLogger(__name__)


def _json_body(request) -> dict:
    try:
        return json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return {}


@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"status": "Method Not Allowed"}, status=405)
    data = _json_body(request)
    username = data.get("userName", "").strip()
    password = data.get("password", "")
    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"userName": username, "status": "Unauthenticated"}, status=401)
    login(request, user)
    return JsonResponse({
        "userName": user.username,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "status": "Authenticated",
    })


@require_GET
def logout_request(request):
    logout(request)
    return JsonResponse({"userName": "", "status": "Logged out"})


@csrf_exempt
def registration(request):
    if request.method != "POST":
        return JsonResponse({"status": "Method Not Allowed"}, status=405)
    data = _json_body(request)
    username = data.get("userName", "").strip()
    password = data.get("password", "")
    first_name = data.get("firstName", "").strip()
    last_name = data.get("lastName", "").strip()
    email = data.get("email", "").strip()
    if not all([username, password, first_name, last_name, email]):
        return JsonResponse({"error": "All fields are required"}, status=400)
    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Already Registered"}, status=409)
    user = User.objects.create_user(
        username=username,
        first_name=first_name,
        last_name=last_name,
        password=password,
        email=email,
    )
    login(request, user)
    return JsonResponse({
        "userName": user.username,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "status": "Authenticated",
    }, status=201)


def get_cars(request):
    if not CarMake.objects.exists():
        initiate()
    rows = [
        {"CarModel": model.name, "CarMake": model.car_make.name, "Year": model.year}
        for model in CarModel.objects.select_related("car_make").order_by("car_make__name", "name")
    ]
    return JsonResponse({"CarModels": rows})


def get_dealerships(request, state="All"):
    state = request.GET.get("state", state)
    return JsonResponse({"status": 200, "dealers": dealers(state)})


def get_dealer_details(request, dealer_id):
    row = dealer(dealer_id)
    if row is None:
        return JsonResponse({"status": 404, "message": "Dealer not found"}, status=404)
    return JsonResponse({"status": 200, "dealer": [row]})


def get_dealer_reviews(request, dealer_id):
    if dealer(dealer_id) is None:
        return JsonResponse({"status": 404, "message": "Dealer not found"}, status=404)
    return JsonResponse({"status": 200, "reviews": reviews(dealer_id)})


@csrf_exempt
def add_review_view(request):
    if request.method != "POST":
        return JsonResponse({"status": 405, "message": "POST required"}, status=405)
    if not request.user.is_authenticated:
        return JsonResponse({"status": 403, "message": "Unauthorized"}, status=403)
    data = _json_body(request)
    required = ["dealership", "review", "purchase_date", "car_make", "car_model", "car_year"]
    if any(not data.get(key) for key in required):
        return JsonResponse({"status": 400, "message": "All review details are required"}, status=400)
    data["name"] = f"{request.user.first_name} {request.user.last_name}".strip() or request.user.username
    created = add_review(data)
    return JsonResponse({"status": 200, "message": created})


def get_inventory(request, dealer_id):
    return JsonResponse({"status": 200, "cars": []})


@require_GET
def analyze(request, text):
    return JsonResponse(sentiment(text.replace("+", " ")))
