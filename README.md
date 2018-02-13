# Build an Interactive Form

An example of the third project of the FSJS Treehouse program is presented in the repository. 
All scripts are in the file *src/app.js* (to support more browsers I use Babel, however, as far as I try to use as few experimental technologies as possible, 
the transcoded version of the scripts is easy to read and is in file *dist/app.js*).

There is nothing special in the project. I use jQuery, connected on CDN. 
In the script interactivity is added to the blocks of information in the form. In the end before calling submit 
validations are added. Validation is rendered in a separate place in the file for the reason that in a real
 project you probably do not want to invent a wheel and might use something like *jquery.validation*. For more details pls see the comments.


##### I'm sure that my layout is slightly different from the proposed by the masters from Treehouse and I express a deep hope for an adequate review.

To run the project  one can start index.html file in its browser
or 
use the following commands:
```shell
    npm install
    npm start
```

### I hope you will enjoy it. Max Eremin
