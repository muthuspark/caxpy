# Caxpy
#### A Simple Data Visualization Software
![Image of Caxpy](http://caxpy.com/images/caxpy/bubble-report.png)

##Prerequisites
Check if you have tomcat, Ant and Java installed in your system. 
Required version:
Javas 1.7+
Tomcat 7+
Ant 1.9+

##Quick Installation

Download the latest code and go to the root directory.
Run
```shell
ant war
```

This would create caxpy.war inside the dist directory, copy the war file and paste it inside webapps folder of tomcat. Caxpy embeds HSQLDB and doesn’t need any external database system.

Point to http://localhost:8080/caxpy (change the port and domain as per your server settings.

Login into the application using max/password

##Notes for Linux / Unix users

Everything will work unchanged as long as Java has been installed correctly i.e. java is in the PATH and it is the expected 1.7 or greater version. You may need to do things like apply executable permissions to the webapps folder on Linux, e.g. “chmod +x *.sh”. And also – unless you have “root” permissions, you may face problems starting services on port 8080 etc.


####Documentation can be found here : http://caxpy.com/documentation
####Follow me [@krimuthu](https://twitter.com/krimuthu)
