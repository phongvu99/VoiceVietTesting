# API Documentation
[VoiceViet API Documentation](https://documenter.getpostman.com/view/9733240/SzRxUphe "VoiceViet API Documentation")

# Introduction
Here’s your place to code all things VoiceViet! The VoiceViet API lets developers build their own VoiceViet-powered applications for the web, desktop, and mobile devices.


N.B. This API purpose is to serve only the VoiceViet web application. 
	
# Overview
The VoiceViet API v1.0 is a REST interface to VoiceViet data. You can access JSON-formatted information about Database objects such as Recordings and Users.

# Authentication
In order to access protected endpoints, you’ll need to register for a JWT (JSON Web Token) by using the __Sign In__ authentication endpoint.


Remember to include the token in the __Authorization__ Header in the following format:


```
Bearer 'token' (without the quote ' mark)
```

# JWT Endpoints
The JWT flow involves a simple POST request to the following endpoint:

```
POST {{URL}}signin
```

Once authenticated, you can test that everything’s working correctly by requesting the Identity resource.
 
```
POST {{URL}}auth/identity
```


N.B. The token expires after one hour.

# Pagination
Some resources represent collections of objects and may be paginated. By default, 50 items per page are shown.

To browse different pages, or change the number of items per page (up to 100), use the __page__ and __per_page__ query string parameters