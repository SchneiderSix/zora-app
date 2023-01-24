<!-- Output copied to clipboard! -->

<!-----

You have some errors, warnings, or alerts. If you are using reckless mode, turn it off to see inline alerts.
* ERRORs: 0
* WARNINGs: 0
* ALERTS: 1

Conversion time: 0.478 seconds.


Using this Markdown file:

1. Paste this output into your source file.
2. See the notes and action items below regarding this conversion run.
3. Check the rendered output (headings, lists, code blocks, tables) for proper
   formatting and use a linkchecker before you publish this page.

Conversion notes:

* Docs to Markdown version 1.0β34
* Tue Jan 24 2023 11:52:57 GMT-0800 (PST)
* Source doc: Zora
* This document has images: check for >>>>>  gd2md-html alert:  inline image link in generated source and store images to your server. NOTE: Images in exported zip file from Google Docs may not appear in  the same order as they do in your doc. Please check the images!


WARNING:
You have 6 H1 headings. You may want to use the "H1 -> H2" option to demote all headings by one level.

----->


<p style="color: red; font-weight: bold">>>>>>  gd2md-html alert:  ERRORs: 0; WARNINGs: 1; ALERTS: 1.</p>
<ul style="color: red; font-weight: bold"><li>See top comment block for details on ERRORs and WARNINGs. <li>In the converted Markdown or HTML, search for inline alerts that start with >>>>>  gd2md-html alert:  for specific instances that need correction.</ul>

<p style="color: red; font-weight: bold">Links to alert messages:</p><a href="#gdcalert1">alert1</a>

<p style="color: red; font-weight: bold">>>>>> PLEASE check and correct alert issues and delete this message and the inline alerts.<hr></p>



# 

<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image1.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image1.png "image_tooltip")



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
