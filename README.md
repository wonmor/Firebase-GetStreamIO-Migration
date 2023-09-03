# Firebase-GetStreamIO-Migration
Syncs Firebase Authentication with GetStreamIO Chat Messaging.

---

# Documentation

## Overview

This server application is built using Express.js and is designed to integrate Firebase users with the GetStream chat service. The application receives requests, processes the data, and responds accordingly. This document provides a guide for using the application, specifically focusing on the /chat/addAllFirebaseUsersToStream endpoint.

### API Endpoints

### `GET /`

Returns a simple text response indicating that the server is running.

### `POST /chat/addAllFirebaseUsersToStream`

Adds all Firebase users to the GetStream chat service. It filters out the users that already exist in Stream and only adds the new users.

---

## Example

### Sample Request

```
POST /chat/addAllFirebaseUsersToStream
Content-Type: application/json

{
  "serviceAccount": <your_firebase_service_account_json_object>,
  "streamApiKey": "<your_getstream_api_key>",
  "streamApiSecret": "<your_getstream_api_secret>"
}
```
### Sample Response

```
200 OK
Content-Type: application/json

{
  "message": "Users added successfully"
}
```

**Or, in case of an error:**

```
500 Internal Server Error
Content-Type: application/json

{
  "message": "Internal Server Error",
  "error": "<error_message>"
}
```
