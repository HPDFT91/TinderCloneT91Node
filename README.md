# MatchMe

This is a clone of the popular dating app Tinder, which allows users to find, like or dislike other users and chat if both parties like
each other.

This clone project features both the Tinder interfaces, i.e. Mobile and Web and is built using React-Native and ReactJS respectively
with Nodejs as backend.

This app clones the basic functionality of the official app as listed below:

* Users can signup using username password type of registration, using “Username” provider.
* Users can login and view their profile.
* They can update their profile photo, city and gender in the profile screen.
* Users can view cards of other users based on their preference of city and gender.
* Users can swipe the cards indicating like or dislike.
* If two users like each other, they will notified.
* Follow along below to learn about how this quickstart works.

## Extended Idea
* As part of the extended idea, we have added a feature to allow users to upload pictures from the Profile Screen.
* When a user's card is seen by another user, he/she can tap on the card to view the user's images.

## Get Started
To get started with any of the availabe interfaces, you’ll need to clone this repo to your local machine.
Follow the respective steps below.

Note : Make sure that the backend server is not sleeping, if it is make any request to it (or go to https://app.bleed71.hasura-app.io).
It usually takes about 1-2 minutes to wake up.

Note: The Below App description works only for the Hasura 'bleed71' cluster used by us.If you want to run the backend for your self on your own cluster refer https://docs.hasura.io/0.15/manual/cluster/index.html .Replace 'bleed71' in the React Native code with 'your_cluster_name'.

To deploy this Backend changes to your cluster, you just have to commit the changes to git and perform a git push to the `hasura` remote after creating the cluster.

```sh
$ # Git add, commit & push to deploy to your cluster
$ git add .
$ git commit -m 'Added a new route'
$ git push hasura master
```

## React Native ( Mobile Front-end )
Simply download and install the .apk on your Android device from the following link:https://drive.google.com/folderviewid=1w7gifAKbGlzRM9YYVCSdkemwzO4yQpYN

(OR)
* Open Git Bash
* After cloning the repository successfully, cd into the TinderClone folder.
* Run the following commands:
```sh
npm install
react-native run-android
```
Note : You’ll need to have an Android emulator (or real device connected to the computer via USB cable) or an iPhone emulator running to use the App.


## Hasura Feature Checklist
The following Hasura features were used to develop this app.
* Hasura Auth
* Hasura Data
* Hasura Microservice
* Hasura Filestore


