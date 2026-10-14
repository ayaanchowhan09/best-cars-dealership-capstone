# Uncomment the imports before you add the code
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = "djangoapp"
urlpatterns = [
    # IBM capstone-compatible endpoint names.
    path(route="fetchReviews/dealer/<int:dealer_id>", view=views.get_dealer_reviews, name="fetch_reviews"),
    path(route="fetchDealer/<int:dealer_id>", view=views.get_dealer_details, name="fetch_dealer"),
    path(route="fetchDealers", view=views.get_dealerships, name="fetch_dealers"),
    path(route="fetchDealers/", view=views.get_dealerships, name="fetch_dealers_slash"),
    path(route="fetchDealers/<str:state>", view=views.get_dealerships, name="fetch_dealers_by_state"),
    # path for registration
    path(route="register", view=views.registration, name="register"),
    # path for login
    path(route="login", view=views.login_user, name="login"),
    # path for logout
    path(route="logout", view=views.logout_request, name="logout"),
    # path for getting all cars
    path(route="get_cars", view=views.get_cars, name="getcars"),
    # path for getting all dealers
    path(route="get_dealers/", view=views.get_dealerships, name="get_dealers"),
    # path for getting all dealers by state
    path(
        route="get_dealers/<str:state>",
        view=views.get_dealerships,
        name="get_dealers_by_state",
    ),
    # path for getting a dealer by id
    path(
        route="dealer/<int:dealer_id>",
        view=views.get_dealer_details,
        name="dealer_details",
    ),
    # path for dealer reviews view
    path(
        route="reviews/dealer/<int:dealer_id>",
        view=views.get_dealer_reviews,
        name="dealer_details",
    ),
    # path for add a review view
    path(route="add_review", view=views.add_review_view, name="add_review"),
    # path to get car's inventory
    path(route='get_inventory/<int:dealer_id>',
         view=views.get_inventory, name='get_inventory'),
    path(route='analyze/<path:text>', view=views.analyze, name='analyze'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
