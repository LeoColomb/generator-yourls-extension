<%= extName %>
==============
[![Built for YOURLS](http://img.shields.io/badge/build%20for-YOURLS-1f669c.svg)](http://yourls.org)

<%= type %> for [YOURLS](http://yourls.org) `<%= yourlsMinVersion %>+`. 

Description
-----------
<%= extDesc %>
<% if (type == 'Theme') { %>
Preview
-------
![screenshot](screenshot.png)
<% } %>
Installation
------------
<% if (type == 'Translation') { %>1. In `/user/<%= extDesc %>`, create a new folder named `<%= extSlugName %>`.
<% } else { %>1. In `/user/<%= _.slugify(type) %>`, create a new folder named `<%= extSlugName %>`.
<% } %>2. Drop these files in that directory.
3. Go to the <%= type %> administration page (*eg* `http://sho.rt/admin/<%= _.slugify(type) %>`) and activate the <%= _.slugify(type) %>.
4. Have fun!

License
-------
Extension licensed under [<%= license %>](LICENSE)

One more thing
--------------
*Here*: any other content, as needed. An important information should be contact
information for bug reports or user questions, if you decide not to use Github
issues in your plugin repository.
