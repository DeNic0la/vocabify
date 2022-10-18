# Setup

To setup this project simply follow this guide. I Highly recommend doing this on a Linux machine.

## Step 1
Clone The Project and open it in your IDE(A).
```shell
git clone https://github.com/DeNic0la/vocabify.git && cd vocabify
```

## Step 2
There is a script for the setup if you are using Linux. For the setup with linux read the [Script Tutorial](linux.md). Else follow those steps.

## Step 3
Go to the [firebase console](https://console.firebase.google.com/) and select the project you just created.
Add a new Application to the Project. Take a look at the [environment.prod.ts](../src/environments/environment.prod.ts) file and copy the values from the Firebaseconfig into said file.
![Firebase Config](img/Image_1.png)

## Step 4
Make yourself an [Open-Ai-Api-Key](https://openai.com/api/) and add it as a firebase secret. (Make sure you are using the right project).

```shell
$your_key=dummy value
firebase functions:secrets:set OPENAI_API_KEY $your_key
```
## Step 5
Deploy the Functions and add use the url here:TODO

## Step 6
Deploy the Frontend

