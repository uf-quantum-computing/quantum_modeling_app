# Quantum Modeling App

Tunneling and Interference | Computational Nano Lab, UFL

> A Dynamic website design & architecture plan can be found in the _dynamic_website_arch.md_ file

## Getting Started

### Prerequsites 
* Node 👉 install [here](https://nodejs.org/en/download/package-manager)
* Miniconda3 👉 install [here](https://docs.anaconda.com/miniconda/miniconda-install/)

### Installation - Part 1

1. Clone the repository
    ```
    git clone https://github.com/uf-quantum-computing/quantum_modeling_app.git
    ```
2. Install NPM packages
    ``` 
    cd src
    npm install
    ```
3. Start the frontend development server
    ```
    npm start
    ```

### Installation - Part 2 

1. Create a conda enviornment for the project
    ```
    conda create --name my_env_name python=3.12
    ```
2. Activate conda enviornment
    ```
    conda activate my_env_name
    ``` 
    At this point you should see that conda is activated to the my_env_name and you should verify that the proper python version is being used. You can check this with the below command which should be python 3.12.
    ```
    python --version
    ```
3. Install dependencies 
    ```
    cd backend_functions
    pip install -r requirements.txt 
    ```

### Installation - Part 3 

1. Install Firebase CLI 
    ```
    npm install -g firebase-tools
    ```
2. Login to Google account 
    ```
    firebase login
    ```
3. Create firebase virtual enviornment 
    ```
    cd backend_functions
    python3 -m venv venv
    . "<insert_path_here>/quantum_modeling_app/backend_functions/venv/bin/activate" && python3 -m pip install -r requirements.txt'
    ```


## File Structure
- `/src/` - Contains the source code for the React website.
  - `/src/App.tsx` - The main entry point for the website. This is where the React Router is set up to route to the different pages.
  - `/src/pages` - Where each sub-page files are located
- `/backend_functions/` - Contains the backend code for handling requests and generating model gifs
  -  `/backend_functions/model_generators` - Contains the python code used to generate each model, ie `interference.py` or `tunneling.py`

## Tech Stack
### React

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

`npm start` Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

**Learn More**
* You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
* To learn React, check out the [React documentation](https://reactjs.org/).

### Google Firebase

The project models are hosted using on demand functions with Google's Cloud Functions for Firebase, allowing the project's model generation code to be run on use, sending responses back to the frontend for users to view. 

Learn more about Cloud Functions for Firebase [here](https://firebase.google.com/docs/functions).

### Sonar Cloud

Sonar Cloud is integrated with GitHub Actions to statically analyze code through the `.github/workflows/build.yml` and `sonar-project.properties` files.

You can learn more through [Getting Started with SonarCloud](https://docs.sonarcloud.io/getting-started/overview/)
