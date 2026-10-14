# Best Cars Dealership Application

**Repository name:** `best-cars-dealership-capstone`
**Project name:** Best Cars Dealership Application

This repository contains the completed Coursera/IBM Full Stack Cloud Development
capstone application: a Django and React dealership browser with authentication,
dealer filtering, reviews, sentiment labels, admin support, and CI verification.

For local verification, run `cd server`, install `requirements.txt`, run
`python manage.py migrate`, then start `python manage.py runserver`. The included
sample data is self-contained so the required API and UI flows can be exercised
without a separate database service.

![best car dealearship](https://github.com/user-attachments/assets/2e3c4c73-0659-423b-ae6c-7f82f21c0427)

## Table of Contents
- [Introduction](#introduction)
- [Architectural Overview](#architectural-overview)
- [Technologies](#technologies)
- [Installation](#installation)
- [Node.js Mongo DB Dockerized Server](#nodejs-mongo-db-dockerized-server)
- [Run Client-side (REACT for Dynamic pages)](#run-client-side-react-for-dynamic-pages)
- [Create Django Proxy Services of Backend APIs](#create-django-proxy-services-of-backend-apis)
- [Deploy sentiment analysis on Code Engine as a microservice](#deploy-sentiment-analysis-on-code-engine-as-a-microservice)

<br>

## Introduction

A national car dealership with local branches spread across the United States recently conducted a market survey. One of the suggestions that emerged from the survey was that customers would find it beneficial if they could access a central database of dealership reviews across the country.

You are a new hire at the company. You are assigned the task of building a website that allows new and existing customers to look up different branches by state and look at customer reviews of the various branches. Customers should be able to create an account and add their review for any of the branches. The management hopes this will bring transparency to the system and also increase the trust customers have in the dealership.

After thorough research and brainstorming, the team developed use cases for anonymous, authorized, and admin users.

### Use cases for anonymous users:
1. View the Contact Us page.
2. View the About Us page.
3. View the list of dealerships.
4. Filter the list of dealerships by state:
   1. Select Show all or a specific state from the State dropdown on the dealership page.
   2. View all states if nothing is selected in the dropdown.
   3. View a table of dealerships for the selected state when the form is submitted.
5. Click on a dealership to view the reviews for that dealership on the details page with each review displayed on a bootstrap card.
6. Log in using their credentials.

### Use cases for authorized users:
In addition to the above, authorized users should be able to write a review for any dealership on the dealership's page. In order to enable authorized users to write their reviews:

1. A Review button should be provided against each dealer listed in the dealership table.
2. Clicking on the Review button should take the user to the review page.
3. Filling the form on the review page and submitting it should add the review.

```json
{
    "user_id": 1, => from Django
    "name": "Berkly Shepley", => from Django
    "dealership": 15, => from the form
    "review": "Total grid-enabled service-desk", => form textbox
    "time": "", => current time
    "purchase": true, => form checkbox
    "purchase_date": "07/11/2020", => form calendar (bootstrap)
    "car_make": "Audi", => from django dropdown
    "car_model": "A6", => from django dropdown
    "car_year": 2010 => form django dropdown
}
```

4. On submission, the user should be taken back to the dealership detail page with the submitted review featured at the top of the reviews list, sorted on time.

### Use cases for admin users:
1. Log in to the admin site with a predefined username and password.
2. Add new make, model, and other attributes.

<br>

## Architectural Overview
1. Django Application:
   - Add user management using the Django user authentication system.
   - Create Django models and views to manage car model and car make.
   - Create Django proxy services and views to integrate dealers and reviews together.

2. React Frontend:
   - Implement user management using the Django user authentication system.
   - Create a React frontend for the application.

3. Backend Services:
   - Create a Node.js server to manage dealers and reviews using MongoDB.
   - Dockerize the Node.js server.
   - Deploy the sentiment analyzer on Code Engine.

4. Sentiment Analyzer:
   - Deploy and integrate the sentiment analyzer as a backend service.
  
![Architecture](https://github.com/user-attachments/assets/58c88812-2b7d-4181-b7a2-ef66c549baa7)

### Detailed Services
The user interacts with the "Dealerships Website", a Django website, through a web browser.

#### Django Application
The Django application provides the following microservices for the end user:

- `get_cars/` - To get the list of cars.
- `get_dealers/` - To get the list of dealers.
- `get_dealers/:state` - To get dealers by state.
- `dealer/:id` - To get dealer by id.
- `review/dealer/:id` - To get reviews specific to a dealer.
- `add_review/` - To post review about a dealer.

The Django application uses an SQLite database to store the Car Make and the Car Model data.

#### Dealerships and Reviews Service
The "Dealerships and Reviews Service" is an Express Mongo service running in a Docker container. It provides the following services:

- `/fetchDealers` - To fetch the dealers.
- `/fetchDealer/:id` - To fetch the dealer by id.
- `/fetchReviews` - To fetch all the reviews.
- `/fetchReview/dealer/:id` - To fetch reviews for a dealer by id.
- `/insertReview` - To insert a review.

"Dealerships Website" interacts with the "Dealership and Reviews Service" through the "Django Proxy Service" contained within the Django Application.

#### Sentiment Analyzer Service
The "Sentiment Analyzer Service" is deployed on IBM Cloud Code Engine and provides the following service:

- `/analyze/:text` - To analyze the sentiment of the text passed. It returns positive, negative, or neutral.

The "Dealerships Website" consumes the "Sentiment Analyzer Service" to analyze the sentiments of the reviews through the Django Proxy contained within the Django application.

<br>

## Technologies

| Frontend | Backend | Services | Other |
| :--------: | :-------: | :--------: | :-----: |
| React | Django | Docker (for containerization) | Python (for the Django application) |
| Bootstrap (for form and UI components) | Node.js | Code Engine (for deploying the sentiment analyzer) | JavaScript (for the Node.js server and React frontend) |
|  | MongoDB |  |  |

<br>

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/KSaiPrashanth/Car_Dealership_Full_Stack_App
cd Car_Dealership_Full_Stack_App/server
```

### 2. Set up virtual environment for your Django application to run
```bash
pip install virtualenv
virtualenv djangoenv
source djangoenv/bin/activate
```

### 3. Install necessary Python packages in your virtual environment
```bash
python3 -m pip install -U -r requirements.txt
```

### 4. Perform migrations to create necessary tables
```bash
python3 manage.py makemigrations
python3 manage.py migrate --run-syncdb
```

### 5. Start the local development server
```bash
python3 manage.py runserver
```

![best car dealearship landing page](https://github.com/user-attachments/assets/2e3c4c73-0659-423b-ae6c-7f82f21c0427)

<br>

## Node.js Mongo DB Dockerized Server

### 1. Open a new terminal, Change to the directory with the data files.
```bash
cd Car_Dealership_Full_Stack_App/server/database
```

### 2. Run the following command to build the Docker app.
```bash
docker build . -t nodeapp
```

### 3. The docker-compose.yml has been created to run two containers, one for Mongo and the other for the Node app. Run the following command to run the server:
```bash
docker-compose up
```

## Run Client-side (REACT for Dynamic pages) 

### Open a new terminal and build your client by running the following commands:
```bash
cd Car_Dealership_Full_Stack_App/server/frontend
npm install
npm run build
```

<br>

## Create Django Proxy Services of Backend APIs

### 1. Start code engine by creating a project.

![Code Engine](https://github.com/user-attachments/assets/d991c652-93f8-4167-a5d8-2a21d31f7b00)


### 2. Once the code engine set up is complete, you can see that it is active. Click on Code Engine CLI to begin the pre-configured CLI in the terminal below.

![Active Code Engine](https://github.com/user-attachments/assets/794aa2c1-4fca-4263-8423-571a093ac5c5)

<br>

## Deploy sentiment analysis on Code Engine as a microservice

### 1. In the code engine CLI, change to server/djangoapp/microservices directory.
```bash
cd Car_Dealership_Full_Stack_App/server/djangoapp/microservices
```

### 2. Run the following command to docker build the sentiment analyzer app
```bash
docker build . -t us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer
```

### 3. Push the docker image by running the following command.
```bash
docker push us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer
```

### 4. Deploy the senti_analyzer application on code engine.
```bash
ibmcloud ce application create --name sentianalyzer --image us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer --registry-secret icr-secret --port 5000
```

### 5. Open djangoapp/.env and replace your code engine deployment url with the deployment URL you obtained above.
### It is essintial to include / at the end of the URL. Please ensurethat it is copied
```bash
sentiment_analyzer_url=your code engine deployment url
```

### Sentiment analyzer on a review from client

![Dealer review](https://github.com/user-attachments/assets/e54527c0-24ca-4fb8-aa04-70e690fbc2c1)

