---
layout: post
title:  "My Development Setup with Sublime Text"
date: 2014-09-16 22:19:41
categories: programming
tags: tools setup ide javascript typescript
---
**\*\* Updated 24th August sudo apt2015 \*\***

Here is the default setup for my favourite editor, [Sublime Text 3][sublime], for web and backend development with NodeJS and most other dynamic languages or shell scripts. I even bought it and haven't regretted this decision. You can also try it out for free for an unlimited amount of time. 

What sets it apart for me from a "real" IDE is

- **quick text manipulation**
	
	Multi-line editing, selecting next occurences of text etc, the features advertised on the homepage introduction videos alone are efficient time savers for me and are already such a big part of my mental repertoire that I often open up sublime text to do just about any text manipulation. 

- **the clutter free interface**

	In full screen mode you just see the code (side-by-side or in grid view), maybe a few tabs, and the sidebar (if you need it). There are no unnecessary buttons or windows to distract you, which is especially nice on a small 13" screen. But you can still search and access almost any command with `CMD+SHIFT+P`/`CTRL+SHIFT+P` even without knowing the shortcut for it. Which is still much quicker than using your mouse.

- **quick startup**

	Oh yes, this one feels really fresh coming from an IDE like Eclipse. No freezes, fast startup, no fuzz... yeah.

There are more pros, but this is not about convincing somebody, its more about my setup., so I can remember it when I have to re-install it.

# Plugins/Packages

- **[Sublime Package Control][package]:** *(install this first)*

	Makes installing other packages a breeze.
	

	After installed just type `CMD+SHIFT+P`/`CTRL+SHIFT+P` (Mac / Win-Linux) Install Package > ...type package name

	Install the rest that way.

- **[SidebarEnhancements][sidebar]:**

	Extends feature set of sidebar

	<div class="gallery">
		<figure class="full">
			<a href="{{site.url}}/img/posts/sublimesetup/sidebar.png"><img src="{{site.url}}/img/posts/sublimesetup/sidebar.png" alt="SidebarEnhancement screenshot"></a>
			<figcaption>Wow, so many options... almost too much for my taste</figcaption>
		</figure>
	</div>

- **Missing Palette Commands:**

	Enables features in the `CMD+SHIFT+P` command palette that are not enabled by default, like `Show Console`.

- **Emmet:**

	Makes editing of HTML easier, with useful autocompletes and shortcuts (was called ZenCoding in earlier versions)

- **[TernJS][ternjs]:**

	Best autocompletion tool for JavaScript I have encountered so far.
	[Here is a description how to set up projects after installing it via package control][ternsetup].

	<div class="gallery">
		<figure class="full">
			<a href="{{site.url}}/img/posts/sublimesetup/ternjs.png"><img src="{{site.url}}/img/posts/sublimesetup/ternjs.png" alt="JavaScript Autocompletion"></a>
			<figcaption>JavaScript Autocompletion, hell yeah!</figcaption>
		</figure>
	</div>

	Alternatives are: SublimeCodeIntel and tern\_for\_sublime

- **[ArcticTypescript][arctic]:**

	TypeScript support and autocompletion, build tools etc.
	`tss` and `tsc` need to be installed first.
	...sometimes extremely slow ( when referencing new files, but well it's still better than using Visual Studio, right? *just kidding* )

	<div class="gallery">
		<figure class="full">
			<a href="{{site.url}}/img/posts/sublimesetup/t3s.png"><img src="{{site.url}}/img/posts/sublimesetup/t3s.png" alt="TypeScript Autocompletion"></a>
			<figcaption>TypeScript Autocompletion</figcaption>
		</figure>
	</div>


- **Better Coffeescript:**

	CoffeeScript Syntax and other tools.


- **LESS:**

	CSS preprocessor syntax highlighting

- **Git Gutter:**

	Shows what you changed since last commit as little indicators beside the line numbers

- **[Predawn Theme][predawn]:**

	Prettier user interface, and this is the only theme I found that
	supports file icons in the sidebar. 

	I also use it with Monokai colors, because the default Predawn colors
	have a weird value range therefore they are harder to distinguish,
	at least for me when using JavaScript.

	<div class="gallery">
		<figure class="full">
			<a href="{{site.url}}/img/posts/sublimesetup/predawn.png"><img src="{{site.url}}/img/posts/sublimesetup/predawn.png" alt="Appearance with Predawn theme"></a>
			<figcaption>Appearance with Predawn theme</figcaption>
		</figure>
	</div>


# User Settings
```javascript
{
	"bold_folder_labels": true,
	"caret_style": "phase",
	"color_scheme": "Packages/Theme - Flatland/Flatland Monokai.tmTheme",
	"fade_fold_buttons": false,
	"findreplace_small": true,
	"font_size": 12.0,
	"highlight_line": true,
	"ignored_packages":
	[
		"Vintage"
	],
	"sidebar_small": true,
	"tab_size": 2,
	"tabs_small": true,
	"theme": "predawn-DEV.sublime-theme"
}
```

# Configuring Sublime for use with the Command Line

Often it is useful to start Sublime Text from the command line. Especially, if you are working and maintaining many different projects its a time saver to open a whole project in a folder with `subl .`. [This guide here shows you how to configure it for use with the command line (on OS X)][command-line].


[sublime]: http://www.sublimetext.com/
[package]: https://sublime.wbond.net/
[ternsetup]: http://emmet.io/blog/sublime-tern/ 
[predawn]: https://github.com/jamiewilson/predawn
[command-line]: https://www.sublimetext.com/docs/3/osx_command_line.html
[arctic]: https://github.com/Phaiax/ArcticTypescript
[ternjs]: https://github.com/emmetio/sublime-tern
[sidebar]: https://github.com/titoBouzout/SideBarEnhancements




