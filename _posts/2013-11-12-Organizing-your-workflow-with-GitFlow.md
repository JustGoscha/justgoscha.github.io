---
layout: post
title:  "Organizing my workflow with GitFlow"
date:   2013-11-12 19:58:31
categories: programming
tags:
- programming
- vcs
- git
---

For my [WatchNext][watchnext] site I wanted to use a more professional and organized approach to implementing features and don't always want to mess with my master branch, when trying out new things and implementing new features.
So I stumbled upon GitFlow and used these two posts as an introduction:

[A Successful Git Branching Model][git-flow1]

[Why aren't you using Git Flow?][git-flow2]


Installing Gitflow:

Since I have Homebrew for MacOS installed it's easy - just type in (with MacPorts it's just as easy, just type `port` instead of `brew`):

{% highlight bash %}
brew install git-flow
{% endhighlight %}

Then I cloned my repository locally to ensure that I didn't break something. 

    git clone --local file:///path/to/repository

Then it can start with gitflow:

    git flow init

It then asks you how different branches should be named. I just let their names.
Ok, so now my work starts in the develop branch, where all major development happens. The master branch is the production branch.

So now I want to work on a small feature for the next release, the feature that you always see what's sorted at the moment and in which direction it is sorted. Therefore I create a new feature branch. Like this:

	git flow feature start sort-indicator

Every change you make now will be made in the `feature/sort-indicator branch. Then if you've finished working on the feature you can merge it back into the developer branch with:

	git flow feature finish sort-indicator

For creating new releases:

	git flow release start v1.0

And to merge it back into the master branch just finish the release
	
	git flow release finish v1.0

This approach should also greatly help when working in teams on different features, to keep always a running version in the master branch, that everybody can check out and start working right away.


[watchnext]: http://watch-next.herokuapp.com
[git-flow1]: http://nvie.com/posts/a-successful-git-branching-model
[git-flow2]: http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/




