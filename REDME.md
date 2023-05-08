# List of content

- Circular Slider
- LinkedIn Reaction Button
- Example of redux toolkit with redux-persist, redux-thunk
- Sample Unit test configuration

In this repo I attached some custom modules and configuration of some features.

# Circular Slider

This module is a customised module of some examples. here are some dependencies like this:

- https://reactnativeelements.com/docs/4.0.0-beta.0/circularslider
- https://www.npmjs.com/package/react-native-circular-slider
- https://www.npmjs.com/package/react-native-circular-progress


I modified this module as per my requirement. This module is used for choose currency. here are some images:

# LinkedIn Reaction Button

This module is now common and necessary for many social media projects. Basically it is a button with some gesture controlls. This module is modified version of (https://medium.com/@duytq94/facebook-reactions-animation-with-react-native-8f750e136ff5) this blog. I do some changes as per my requirements to make it same like LinkedIn post reaction button.

There are some challanges with this module, like manage panHandlers with animated views. This module is fully customisable with animation and UI. here are some images of this module.


## Redux Configuration with redux-toolkit, redux-persits and redux-thunk

In this repo, I covered setup of redux with API usage. So, you can easily understand combine flow with redux and APIs. 
for this example i used image api to load data from api -> store into redux -> load from store and render to screen. For extra data I used load more functionality of Flatlist component to getting more images when user reach to end of List.

- Load image on intialize
- Get more image onEndReached props
- blacklist image data with persits

Also, we can easily add pagination with this flatlist to get more data on click events. here are some images:

# Unit Test

Setting up sample testcase with jest.
```intro.test.js```



# Run This Project

- Download this repo
- Open examples folder into terminal
- run "yarn" to install node_modules
- run "yarn start" to run project