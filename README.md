<!-- Output copied to clipboard! -->

<!-----

----->


<p style="color: red; font-weight: bold">>>>>>  gd2md-html alert:  ERRORs: 0; WARNINGs: 1; ALERTS: 1.</p>
<ul style="color: red; font-weight: bold"><li>See top comment block for details on ERRORs and WARNINGs. <li>In the converted Markdown or HTML, search for inline alerts that start with >>>>>  gd2md-html alert:  for specific instances that need correction.</ul>

<p style="color: red; font-weight: bold">Links to alert messages:</p><a href="#gdcalert1">alert1</a>

<p style="color: red; font-weight: bold">>>>>> PLEASE check and correct alert issues and delete this message and the inline alerts.<hr></p>



# 


![image](https://drive.google.com/uc?export=view&id=1TeYkzMwXDSVYZ8gyqNrv5f1U0UJJtntm)



## Dynamic social media between your likes


# Team



* Mateo Bonino
* Mateo Gallo
* Matias Rossi
* Ricardo Danta


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
