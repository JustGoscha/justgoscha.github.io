---
layout: post
title:  "Troubled Times with Selenium Webdriver"
date:   2014-07-20 23:01:46
categories: programming
tags:
- testing
- javascript
- web-development
- mocha
- selenium
summary: "A beginner's guide to browser end-to-end testing with Selenium WebDriver and Mocha with Chai & Coffeescript. How to overcome the first hurdles and avoid pitfalls I ran into. Also a tale about the quest of finding a good documentation for the javascript version of Selenium Webdriver. And some snippets for often used, but hard to achieve test cases."
---

![Data Channel]({{site.url}}/img/posts/selenium/autotestingbot.jpg)

Testing is one of those subjects I underestimated or taken rather less seriously in the university. Later in my first job, after about 2 years working there and observing which things usually went wrong in a normal development cycle of our team, I realized that some problems probably were solvable with automated testing. Or at least some time could be saved, when we wouldn't do it manually all the time. Now, in my current job at [Oximity][ox], finally the time has come that I have to start actually doing it.

My testing system at work is comrpised of [Selenium][sel] WebDriver (JavaScript version), [Mocha][mocha] with [Chai][chai] and [Coffeescript][coffee]. What I'm doing with it is frontend end to end testing of our website. So basically I'm simulating a robot sitting in front of a browser, clicking as fast as possible on UI elements. When something breaks while he is doing it he either explodes in a burst of error messages or when I'm lucky, he tells me what went wrong.

This will not be a complete tutorial of Selenium Webdriver or Mocha or Chai, just a collection of things (resources, tutorials, bugs, techniques) that I want to remember and that will help me if I need to install and run it all over again. Maybe it will help also someone else out there.

#System and setup

My system is a Mac OS X Mavericks (10.9) so most of the setup will be Mac specific, some of it can be applied for Linux (the only difference actually, I guess, will be with the file paths and installation folders).

So the things I already assume to be installed:

- Node and npm
- Homebrew or Macports (only on Mac OS)

What you need to install:

- Chrome or Chromium ([download chromium][chromium])
- Selenium Webdriver
- Coffeescript
- Mocha
- Chai

Go to your favourite terminal and install them:

```
npm install selenium-webdriver
npm install -g coffee-script
npm install -g mocha
npm install chai
```

Ok, before I go into details with some of the technologies lets look how the setup our first tests and make sure everything runs smoothly. Let's make a file `test.coffee`.

```coffeescript
webdriver = require("selenium-webdriver")
should = require("chai").should()

# the website we want to test
host = "http://watch-next.herokuapp.com"

# chrome (Mac specific for Linux it's something like /bin/google-chrome)
chromePath="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"

describe "Test Suite", ->
  # executed once before the first test
  before (done) ->
    this.timeout = 150000

    # initialize browser
    capabilities = webdriver.Capabilities.chrome()
    capabilities.set "chromeOptions", {
      "binary": chromePath
    }

    # start browser
    global.driver = new webdriver.Builder()
    .withCapabilities(capabilities)
    .build()
    done()

  # executed after last test
  after (done)->
  	# closes the browser
    driver.quit().then done

  describe 'Title test', ->
    before (done) ->
      done()
    after (done) ->
      done()
    @timeout 10000
    it 'should display the desired page title', (done)->

      driver.get host
      driver.wait () ->
        driver.getTitle().then (title)->
          title.should.have.string "WatchNext"
          done()
      , 5000

```

Now we need to run it with Mocha.

```bash
mocha --compilers coffee:coffee-script/register test.coffee
```

If you've written it with JavaScript a simple `mocha test.coffee` will suffice.
After you've run it you should see something like: 

```
  ․

  1 passing (3s)
```

It shows every test as a dot, and when they fail you see which one failed. I prefer another output, so I see which test is currently running and to not type it every time I simply make a shell script for it, called `test.sh`

```bash
#!/bin/bash

mocha --compilers coffee:coffee-script/register -R spec test.coffee
```

This gives me the more descriptive output:

```
  Test Suite
    Title test
      ✓ should display the desired page title (2769ms)


  1 passing (3s)
```

#Selenium

So Selenium is this thing that gives you the possibility to automate a browser. At first I had difficulties to find a good documentation or introduction, especially for the JavaScript version. So here at first a link collection of good introductions and documentations. 

## Tutorials and documentations

A good point to start from [is this introduction on Google code.][sel-intro]

Another challenge was to find a good documentation for it. There was [this site, from Google Code][sel-doc-1], but I ran into several problems with it, there where numerous 503, 404 errors with it etc, so I found also a mirror of the doc [here][sel-doc-2], but it seems to be incomplete. The most helpful documentations are that of [webdriver.Webdriver][wdriver1], [webdriver.WebEelement][w-element] and [webdriver.By][By], which is a jquery-like element selector.


# Mocha/Chai

Mocha is the test framework I'm using with Chai as the assertion module. [Here is the documentation][should] for the <a href="#" class="tooltip" title="Behavior Driven Development">BDD</a> style chainable assertion construct, that is `expect` or `should`. With it you can chain assertions so they sound like real sentences. For example:

```coffeescript
people.should.be.ok()
```

# Frequent use cases

Here are some use cases which you might need frequently, but which maybe not that trivial to accomplish with Selenium. Also the problems you can run into.

**Execution of arbitrary JavaScript code inside a selenium test:**

```javascript
driver.executeScript('return document.location.pathname')
```

**Executing JavaScript and getting a value back:**

```coffeescript
yourAsyncScript = """
  var callback = arguments[arguments.length - 1];
  setTimeout(function(){
    callback("yourReturnValue")
  }, 5000);
"""
# timeout needs to be set or else it will fail
driver.manage().timeouts().setScriptTimeout(5000, 1) 
promise = driver.executeAsyncScript(yourAsyncScript);
promise.then (returnValue)->
  returnValue.should.equal("yourReturnValue")
```

**Waiting for a page to load:**

```coffeescript
# wait for page to be loaded
driver.wait((()-> driver.executeScript('return document.readyState')), 10000)
.then ()->
	# continue doing something
```

If you already know for which element you are waiting you can use:

```coffeescript
# wait until element appears on page
driver.wait (-> driver.isElementPresent webdriver.By("#myElement")), timeout
# wait for element to become visible (omit if not needed)
driver.findElement(webdriver.By("#myElement"))
.then (element) ->
  driver.wait -> element.isDisplayed()
  driver.findElement(webdriver.By("#myElement"))
.then (element) ->
	# do your thang
```

**Checking if element has a class:**

```coffeescript
driver.findElements(By.css('#myElement'))
.then (elements) ->
  elements[field].getAttribute('class')
  .then (classes_string)->
    classes = classes_string.split ' '
    classes.should.include 'bestClass'
```

**Error handling in Promises:**

In Selenium WebDriver (JS) you can not deal with errors like you are used to with try/catch, because most of the actions you perform return **promises** and they are asynchronous. You wait for there completion with the `then` function and assign it a callback function there to get the result. The second argument of the `then` function is an error callback, which gets called when an exception happened performing the action. 

```javascript
element.click()
.then(resultCallback, errorCallback)
```

The `errorCallback` gets a reference to the error, and the `resultCallback` gets the result.


**Dismiss alert when navigating away from a page:**

So this is one that caused me some headache, if an alert pops up it can kill all your subsequent test-cases so when you have to check a page, where occasionally an alert pops up, you need to deal with it.

In this scenario, I want to change the page and wait for an element to appear, but an alert usually pops up and interferes.

```coffeescript
handleAlert = (err) ->
  driver.switchTo().alert()
  .then (alert)->
    alert.accept()
  , (e)->
    console.log('No alert to handle')

getPageDismissAlert = (page) ->
  driver.get(page)
  .then(null, handleAlert)

  selector = By.css('.page-title')


  driver.wait((-> driver.isElementPresent selector), 5000)
  .then(null, handleAlert)
  driver.findElement(selector).then (element) ->
    driver.wait -> element.isDisplayed()
    .then null, handleAlert
    driver.findElements(selector).then null,handleAlert
  , handleAlert

  # we dealt with the alert... but haven't done what we wanted
```

Okay now we dealt with the alert. But we have not done we actually wanted. We could do it in the `handleAlert` method. 
Or we make us a function that creates the handleAlert functions for us:


```coffeescript
alertHandleCreator = (retry) ->
  handle = (err)->
    driver.switchTo().alert()
    .then (alert)->
      alert.accept() # or .dismiss()
      retry()
    , (e)->
      console.log('No alert to handle')
  return handle
```

This creates us a function that cancels the alert and does the function we give it in the `retry`. Now we can do something like this:

```coffeescript
getPageDismissAlert = (page) ->
  selector = By.css('.page-title')

  # function that we want retried when alert is raised
  try = (alertHandle)->
    driver.get(page)
    .then(null, alertHandle)
    driver.wait((-> driver.isElementPresent selector), 5000)
    .then(null, alertHandle)
    driver.findElement(selector).then (element) ->
      driver.wait -> element.isDisplayed()
      .then null, alertHandle
      driver.findElements(selector).then null, alertHandle
    , alertHandle

  handleAlert = alertHandleCreator try
  try(handleAlert)
```

**Iterate through WebElements to get a value:**

```coffeescript
utils.waitVisible(driver,By.css('.info-tag'),10000)
.then (elements)->
  console.log 'Number of tags: '+elements.length
  tags = []
  tagPromiseList = elements.map (tagElement)->
    tagElement.getAttribute('textContent')
    .then (tag)->
      tags.push(tag)
  tags
.then (tags)->
  console.log 'tagList: ' + tags
  tags.should.include articleTag
  tags.should.include articleTagEdit
  done()
```

**or if you want to check with just a substring... of a value for example**

```coffeescript
.then (elements)->
  tags = 
    list: ""
  tagPromiseList = elements.map (tagElement)->
    tagElement.getAttribute('textContent')
    .then (tag)->
      tags.list = tags.list+", "+tag
  tags
.then (tags)->
  tags.list.should.have.string articleTagEdit
  tags.list.should.have.string articleTag
  done()
```

**Hover over element:**

```coffeescript
driver.findElement(By.css('.my-element-class'))
.then (tagElement)->
  new webdriver.ActionSequence(driver)
  .mouseMove(tagElement)
  .perform()

```

**Handling StaleElementReferenceError and NoSuchElementError:**

Reference: [http://stackoverflow.com/questions/16166261][stale-el]

With the function `waitVisible` I want to find an element on the page and then wait for it to get visible. But sometimes the errors occur there, so I handle them like here: 

```coffeescript
waitVisible = (parent, selector, timeout) ->
  timeoutOver = false
  setTimeout ()->
    timeoutOver = true
  , timeout

  startTime = new Date()
  handleError = (error)->
    #handle NoSuchElementErrors and StaleElementReferenceError
    if error.name == "NoSuchElementError" || error.name=="StaleElementReferenceError"
      if timeoutOver 
        console.log "Still no such element :("
        throw error
      else #retry
        waitForIt(timeout-(new Date()-startTime))

  waitForIt = (timeout)->
    driver.wait (-> parent.isElementPresent selector), timeout
    parent.findElement(selector).then (element) ->
      driver.wait -> element.isDisplayed()
      parent.findElements(selector)
    , handleError

  waitForIt(timeout)
```

Actually that's also not perfect. I have not found the best solution to handle StaleElementReferenceError and NoSuchElementError yet.

**Waiting for Angular to finish first digest loop:** 

Reference: [http://jiraaya.wordpress.com/2014/03/17/selenium-wait-for-digest-loop-to-complete/][angular-wait]

***Haven't tested this out yet!***

```coffeescript
driver.executeAsyncScript "angular.element([DOM element]).injector().get('$timeout')(arguments[arguments.length - 1]);"
, ""
```

If you have something to add or correct, please write it in the comments. I'm still fairly new to this area and am eager to learn new things.

[sel-doc-1]: http://selenium.googlecode.com/git/docs/api/javascript/index.html
[sel-doc-2]: http://appfigures.github.io/webdriver-js-api-reference/
[wdriver1]: http://appfigures.github.io/webdriver-js-api-reference/symbols/webdriver.WebDriver.html
[w-element]: http://appfigures.github.io/webdriver-js-api-reference/symbols/webdriver.WebElement.html
[By]: http://selenium.googlecode.com/git/docs/api/javascript/namespace_webdriver_By.html
[ox]: http://www.oximity.com/
[sel-intro]: https://code.google.com/p/selenium/wiki/WebDriverJs
[sel]: http://docs.seleniumhq.org/
[mocha]: http://visionmedia.github.io/mocha/
[chai]: http://chaijs.com/
[coffee]: http://coffeescript.org/
[should]: http://chaijs.com/api/bdd/ 
[chromium]: https://download-chromium.appspot.com/
[stale-el]: http://stackoverflow.com/questions/16166261/selenium-webdriver-stale-element-reference-exception 
[angular-wait]: http://jiraaya.wordpress.com/2014/03/17/selenium-wait-for-digest-loop-to-complete/
