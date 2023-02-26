<!-- Output copied to clipboard! -->

<!-----

----->
theme: minimal


# 

<p align="center">
   <img src="https://drive.google.com/uc?export=view&id=1TeYkzMwXDSVYZ8gyqNrv5f1U0UJJtntm" />
</p>


## Dynamic social media between your likes


# Team



* Mateo Bonino
* Mateo Gallo
* Matias Rossi


# Technologies



* Node@18.12.1
* Node Express@4.18.2
* Node React@18.2.0
    * At the beginning we wanted to create a project in Flask + Django logic but we chose React when we saw all the things that you can create with it, also it is very used in industry. Then we changed Flask to Express because Express is from Node and is faster than Flask.
* Nodemon@2.0.20
* MySQL@2.18.1
* Yarn@1.22.19
* Google Cloud API
* Socket.io
* Axios@1.2.2
* Bcryptjs@2.4.3
* Pandas
* Scikit-learn
* HTML
* CSS
* JavaScript
* Python@3.10.9


# Challenge


This project is going to be a social media network. Posts, votes (yes, no),  chat and create a system recommendation with AI using cosine similarity.


# Risks


The principal risks are uploading a virus when making a post and SQL Injections.


# Infrastructure


We made an API that communicates with the MySQL Database using the Axios method for every request. When the User is registered the password is Hashed with Salt from Bcryptjs. Every time a User Logins a var called “AuthContext” (made with a mix between hooks useContext and useState) is going to help to locate the current User with his data (posts, friends, etc).


# Existing Solutions



* Twitter
* Reddit
