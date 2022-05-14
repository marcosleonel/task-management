# TODO

## FOLDER STRUCTURE

db
components
  |_user
  |_subscription
  |_task
config
logger
server

## COMPONENT STRUCTURE

* **Index**: the place to import the component dependencies to inject and export the component.
* **componentEntity**: validate the component fields (business logic) (domain).
* **componentUseCases**: a class with all the component's use cases.
* **componentControllers**: handles the component`s routes.
* **componentRepository**: interface to persist the component data.
* **componentModel**: a database model that will be injected in the repository.
* **componentsRoutes**: the routes that will be exported to the router.
* **component.unit.spec**: one unit test for each file.
* **component.integration.spec**: integration test for the route.

## ENTITIES

[ ] User Account

* Should have a valid `email`, an error should be returned
* Should have a valid `password`, an error should be returned
* `email` should be unique, an error should be returned

[ ] Subscription

* **BEFORE** Create a Product and Prime in Stripe Dashboard or CLI
* Should have a product ID
* The price ID of the subscription the customer is signing up for (Task Management App)
* Your success_url, a page on your website that Checkout returns your customer to after they complete the payment

[ ] Task

* Should have a `text` field, an error should be returned
* Should have a security validation for the text, an error should be returned
* Should validate if the text is not longer than 250 characters, an error should be returned.

## USE CASES

USER ACCOUNT:

[ ] Register New User
[ ] Authenticate User
[ ] Authorize User
[ ] Update User Account Info
[ ] Delete User Account
[ ] List Users

SUBSCRIPTION:

[ ] Get Subscription
[ ] Make Subscription
[ ] Cancel Subscription
[ ] Update Subscription

TASK:

[ ] Create Task
[ ] Update Task
[ ] Delete Task
[ ] List Task
[ ] Get Task by ID

## DATA ACCESS

USER ACCOUNT:

[ ] Create User
[ ] Get User by ID
[ ] Update User
[ ] Delete User
[ ] List Users

SUBSCRIPTION:

[ ] Create Subscription
[ ] Get Subscription by ID
[ ] Update Subscription
[ ] Delete Subscription
[ ] List Subscription

TASK:

[ ] Create Task
[ ] Get Task by ID
[ ] Update Task
[ ] Delete Task
[ ] List Task

## ROUTES

USER:

[ ] `GET /users`
[ ] `GET /users/{id}`
[ ] `POST /users`
[ ] `PUT /users/{id}`
[ ] `DELETE /users/{id}`

SUBSCRIPTION:

[ ] `GET /webhooks/stripe`
[ ] `GET /subscriptions/{id}`
[ ] `POST /subscriptions/{id}`
[ ] `PUT /subscriptions/{id}`
[ ] `DELETE /subscription/{id}`

TASK:

[ ] `GET /users/{id}/tasks`
[ ] `GET /users/{id}/tasks/{id}`
[ ] `POST /users/{id}/tasks`
[ ] `PUT /users/{id}/tasks/{id}`
[ ] `DELETE /users/{id}/tasks/{id}`
