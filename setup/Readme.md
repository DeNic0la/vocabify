# Setup

To setup this project simply follow this guide. I Highly recommend doing this on a Linux machine.

## Step 1
Clone The Project and open it in your IDE(A).
```shell
git clone https://github.com/DeNic0la/vocabify.git && cd vocabify 
```

## Step 2
There is a script for the setup if you are using Linux. For the setup with linux read the [Script Tutorial](linux.md). Else follow those steps.

### Step 2.1
make sure you have npm, firebase-tools and angular-cli installed.

### Step 2.2
Run those commands
```shell
firebase login
firebase projects:create
```

## Step 3
Go to the [firebase console](https://console.firebase.google.com/) and select the project you just created.
Add a new Application to the Project. Take a look at the [environment.prod.ts](../src/environments/environment.prod.ts) file and copy the values from the Firebaseconfig into said file.
![Firebase Config](img/Image_1.png)

## Step 4
Make yourself an [Open-Ai-Api-Key](https://openai.com/api/) and add it as a firebase secret. (Make sure you are using the right project `firebase use {your project}`).

```shell
your_key=12345
firebase functions:secrets:set OPENAI_API_KEY $your_key
```
## Step 5
Deploy the Functions:
```shell
cd functions
firebase deploy --only functions
cd ..
```
## Step 6
Build the Frontend
```shell
ng build
```

Deploy the Frontend
```shell
firebase deploy --only hosting
```
## Step 7
Congratulations your app is deployed, go to firebase to check the url you deployed the app to.
https://console.firebase.google.com/project/[YOUR_PROJECT]/hosting/sites
