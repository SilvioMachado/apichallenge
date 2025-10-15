# Getting Started

This App uses the `https://dummyjson.com/docs/products` API to display a product list and product details. It handles filtering, sorting, adding reminders to the phone's Calendar and Deep Linking.

This project is using bare bones React Native CLI and a few libraries. The default getting started should help you setup everything you need.

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Requirements

- **Node.js**: v18 or newer is recommended.
- **npm**: Included with Node.js.
- **Java**: Java SE Development Kit (JDK) version 17.


## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

# Entrypoints

The app has two main entrypoints:

## 1. Opening the App

Just like you would expect.

## 2. Deep Linking

This app accepts:
1. A custom URL schema `apichallenge://`
2. A HTTPS schema with the host `https://apichallenge.com`

Sadly in order to open the HTTPS schema, we would need to host a file in our domain. So the Intent Filter is defined in the app manifest as an example of how we would handle that.

### Fire a deep link event

You may fire an even using `adb` in your terminal. Handling Push notifications or deep linking with `HTTPS` would work prettry much the same way (There's no push notifications implemented):

```
adb shell am start \
        -W -a android.intent.action.VIEW \
        -d "apichallenge://product/<YOUR PRODUCT ID HERE>" com.apichallenge
```

The only existing deep link Intent implemented in the App is the `OpenProductIntent`, that opens the app details from the custom URL.

# React Architecture

This project follows a Clean Architecture approach, separating concerns into three main layers: UI, Domain, and Infrastructure.

```
./root
├── ui/
│   ├── components/  # Shared, UI components
│   └── page/        # Application screens
│
├── domain/
│   ├── entities/     # Core business models and types
│   ├── exception/    # Application-specific exceptions 
│   ├── services/     # Application-specific business rules
│   └── repository/   # Abstract interfaces for data sources
│
└── infrastructure/
    ├── calendar/     # Handle firing Android/iOS Intents for Calendar
    ├── hook/         # Contain hooks related to deep linking
    └── repository/ # Concrete implementation of domain repositories
```

This separation helps to create a scalable and maintainable codebase where business logic is independent of UI and data sources.

Since we're only coding for Android for this demo project, we took some liberties like `AndroidCalendarProvider` being defined on infra layer, and being directly imported on the UI.

# App Pages

This app has only one page. I valued simplicity and instead of needing to add Routing and several other libraries, we open Product details as a modal on top of the home page.

The pages (in this App, only the Home page) should handle orchestrating UI components and instantiating domain services. 

# Error handling

We have 4 main possible sources of error:

1. Product List API
2. Product Detail API
3. Calendar API
4. Category API

For brevity, the Product List component displays how I'd handle errors given the asks for the challenge.

1. Infrastructure layer throws errors related to the API calls
2. Domain layer transforms into a domain error
3. The UI/Presentation layer is responsible for rendering any necessary information and letting the user re-do the last action they took.
