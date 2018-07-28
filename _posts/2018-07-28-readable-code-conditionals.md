---
layout: post
title:  "Readable Code: Writing readable conditional statements"
date: 2018-07-28 18:00:00
categories: programming
tags:
- readable-code
- maintainability
- code-reviews
---

Welcome to this series of articles concerned with the topic "Readable Code". Here articles will be shared desscribing patterns discovered over the years that help to write readable and maintainable code. The code examples will be written mostly in JavaScript but they can be easily applied to most languages. 

In this article I want to present how conditional statements can be written in a comprehensible way. 

## What's so complicated about conditionals?

That question might be the first thing on your mind. In principle, conditionals are an easy to grasp concept, and in their simplest form easy to read.

```js
const kate = {
  age: 15
}

function driveCar(person) {
  if (person.age >= 18 ) {
    console.log("They see me rollin...")
  } else {
    console.log("This person is not allowed to drive!")
  }
}
```

In the above example. No problem at all. Code is still readable. But usually that's not how code in real world applications looks like. It gets messy quite fast and before you know it, you have a bunch of conditions in one statement, that you cannot decipher one month later. 

### More complex example

Let's say we are in a car rental, and in the checkout process we want automatically to check if a person is allowed to rent a certain car.

```js
function checkout(person, vehicle) {
  // ... some code here...

  // check if person is allowed to drive
  // the car by checking her legal age
  // legal gender (because some countries
  // prohibit certain genders to drive)
  // and license types
  if (!(
    person.age >= vehicle.countryOfRegistration.legalAge &&
    vehicle.countryOfRegistration.legalGenders.includes(person.gender) &&
    person.license.types.includes(vehicle.license.type) && 
    moment(person.license.expiryDate).after(vehicle.startOfRentalDate)
  )) throw Error('Person not allowed to rent this car')

  // ... continue checkout process ...
}
```

### Problems

1. **We have more than 3 conditions.**

    Our short term memory is limited and by the time one comprehends the last condition one might have already forgotten the first.

2. **Deeply nested fields**

    Accessing deeply nested fields make code usually hard to read, especially when the data model you are using is badly designed for the domain you currently need it for.

3. **Comments**

    We have a comment in the top describing what it's doing. But it's incomplete and some people consider **inline commments [in code to be a](https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/) [code](https://softwareengineering.stackexchange.com/questions/1/comments-are-a-code-smell/13) [smell](http://www.strongopinionsweaklytyped.com/blog/2014/08/27/beware-the-siren-song-of-comments/)**.

> “Code never lies, comments sometimes do.” 
— Ron Jeffries

## Cleaning the code

Okay so let's roll up our sleeves and fix the problems one by one.

### Step 1: Abstraction - Hide the complexity

To not have 3 conditions in there let's move all conditions into its own function.


```js
function checkout(person, vehicle) {
  // ... some code here...

  if (!(isAllowedToRentCar(person, vehicle))
    throw Error('Person not allowed to rent this car')

  // ... continue checkout process ...
}


function isAllowedToRentCar(person, vehicle) {
  // check if person is allowed to drive
  // the car by checking her legal age
  // legal gender (because some countries
  // prohibit certain genders to drive)
  // and license types
  return (
    person.age >= vehicle.countryOfRegistration.legalAge &&
    vehicle.countryOfRegistration.legalGenders.includes(person.gender) &&
    person.license.types.includes(vehicle.license.type) && 
    moment(person.license.expiryDate).after(vehicle.startOfRentalDate) &&
    moment(person.license.expiryDate).after(vehicle.endOfRentalDate)
  )
}
```

Great, now we moved all this ugliness into it's own function with a descriptive name. When reading the main checkout function, we don't have to concern ourselves directly with the whole check process, but we still know that it is done. If we want to know more, we can still look into the function.

### Step 2: Naming of conditionals

Now that we isolated the problem, let's fix the conditional itself. One thing we could do to get rid of the comment describing what it does, is introduce variables and name them accordingly. Like this:

```js
function isAllowedToRentCar(person, vehicle) {
  const personIsOfLegalAgeInCountry = person.age >= vehicle.countryOfRegistration.legalAge

  const personIsOfLegalGenderInCountry = vehicle.countryOfRegistration.legalGenders.includes(person.gender)

  const personHasCorrectLicenseType = person.license.types.includes(vehicle.license.type)

  const personsLicenseWillNotExpire = moment(person.license.expiryDate).after(vehicle.endOfRentalDate)

  return (
    personIsOfLegalAgeInCountry &&
    personIsOfLegalGenderInCountry &&
    personHasCorrectLicenseType && 
    personsLicenseWillNotExpire
  )
}
```

Now we removed the comments and instead the variable naming acts as our comment. The advantage is that a lot of times if people change code, they forget to change the comment. But with variable names people are usually more careful.

You can argue that we could have again put every check into it's own function and it might even make sense, but sometimes if it's a one of check, I prefer to go with comprehensive variable naming.

### Step 3 - More abstraction

But let's do one last change, we can at least seperate the license checking from the country restrictions checking:

```js
function checkout(person, vehicle) {
  // ... some code here...

  if (!(isAllowedToRentCar(person, vehicle))
    throw Error('Person not allowed to rent this car')

  // ... continue checkout process ...
}

function isAllowedToRentCar(person, vehicle) {
  return (
    doesPersonMeetCountryRestrictions(person, vehicle.countryOfRegistration) &&
    isLicenseValidForRental(license, vehicle)
  )
}

function doesPersonMeetCountryRestrictions(person, country) {
  const personIsOfLegalAgeInCountry = person.age >= country.legalAge
  const personIsOfLegalGenderInCountry = country.legalGenders.includes(person.gender)

  return (
    personIsOfLegalAgeInCountry &&
    personIsOfLegalGenderInCountry
  )
}

function isLicenseValidForRental(license, vehicle) {
  const isCorrectLicenseType = license.types.includes(vehicle.license.type)
  const licenseWillNotExpire = moment(person.license.expiryDate).after(vehicle.endOfRentalDate)
  return (
    isCorrectLicenseType &&
    licenseWillNotExpire
  )
}
```

### Let's recap

We had everything crammed into one large conditional `if`-statement. We had incomplete comments describing what the if statement was doing and everything was in the main checkout function. 

What we achieved:
- We made the code self-documenting by using appropriately named functions and variables, removing the necessity for comments. 
- We broke the conditional apart into logical bits that can be unit tested independently. 
- We abstracted away conditional logic out of the main function by moving it into it's own function.

As you see the lines of code have actually increased since we introduced all these changes. But the readability and maintainability increases. (And since some of the logic is now in its own function it can be even moved outside the file.) The readability advantages will always pay off in the long run, when multiple people will have to read, debug or extend the code. The less they have to stop and think about your intent, the more mental capacity they have left to concentrate on their task.

## Thanks for reading!

I hope those tips help you to write better conditionals in your codebases!

I would also really appreciate to hear your feedback on this. What are your tips to avoid complex conditionals? Do you agree with the proposed solutions?

Write it in the comments :)