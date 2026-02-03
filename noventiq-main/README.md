# Getting Started with Noventiq Assignment

This project was created for [Noventiq](https://github.com/).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Components

### Login Component

The `Login` component handles user login functionalities with state management and basic form validation. Here are the main features:

1. **State Management**:
    - Manages states for email, password, rememberMe, language, showPassword, and emailError using React's `useState` hook.

2. **Language Detection**:
    - Detects and sets the user's browser language preference (`'en'`, `'hi'`, `'bn'`). Defaults to English if the browser language is unsupported.

3. **Remember Me Functionality**:
    - Checks for a `rememberMe` cookie on component mount to pre-fill the email and set the rememberMe checkbox.

4. **Event Handlers**:
    - `handleEmailChange`: Updates email state and clears email error.
    - `handlePasswordChange`: Updates password state.
    - `togglePasswordVisibility`: Toggles password visibility between text and password.
    - `handleLanguageChange`: Updates language state.
    - `handleRememberMeChange`: Manages the rememberMe state and corresponding cookie.
    - `handleFormSubmit`: Prevents default form submission, validates the email, and logs the form data.

5. **Validation**:
    - `validateEmail`: Validates the email format and ensures it's from a valid corporate domain (`noventiq.com`).
    - `validatePassword`: Validates the password, it shouldn't be blank.

6. **Cookie Management**:
    - `setCookie`: Sets a cookie with a specified name, value, and expiration period.
    - `getCookie`: Retrieves a cookie by its name.
    - `deleteCookie`: Deletes a cookie by setting its expiration date to a past date.

7. **JSX Structure**:
    - Includes input fields for email and password, a language dropdown, and a remember-me checkbox.
    - Displays email validation error messages.
    - Provides a password visibility toggle feature.
    - A submit button to trigger form validation and log the form data.

### Header Component

The `Header` component is responsible for displaying logo of the application. Here are the main features:

1. **JSX Structure**:
    -  Includes the application logo.

### Footer Component

The `Footer` component displays the bottom section of the application. Here are the main features:

1. **Static Content**:
    - Displays the following text: "Copyright 2024 Noventiq | Powered by Noventiq".

2. **JSX Structure**:
    - Includes the static content mentioned above.


### ForgotPassword Component

The `ForgotPassword` component displays the input of the application.

## How to Use

1. Clone the repository.
2. Navigate to the project directory.
3. Run `npm install` to install dependencies.
4. Run `npm start` to start the development server.
5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

- `src`: Contains the styles for the application.
  - `index.js`: Entry point for the React application.

- `src/components`: Contains the source code for the application.
  - `Login.js`: Contains the `Login` component.
  - `Header.js`: Contains the `Header` component.
  - `Footer.js`: Contains the `Footer` component.

- `src/css`: Contains the styles for the application.
  - `Header.css`: Contains the styles for the `Header` component.
  - `Footer.css`: Contains the styles for the `Footer` component.
  - `Login.css`: Contains the styles for the `Login` component.

- `src/translation`: Contains the translation json file for the application.
  - `en.js`: Contains the english labels.
  - `hi.js`: Contains the hindi labels.
  - `bn.js`: Contains the bengla labels.

## Internationalization (i18n)

The application uses i18next and react-i18next for internationalization. The default language is English (en), with support for Hindi (hi) and Bengali (bn). The language is automatically detected based on the user's browser settings.

## To switch languages:

Use the language dropdown in the Login component to select between English, Hindi, and Bengali. The application's content will dynamically update based on the selected language.

## Contributing

If you have suggestions or improvements, feel free to create a pull request or open an issue.

