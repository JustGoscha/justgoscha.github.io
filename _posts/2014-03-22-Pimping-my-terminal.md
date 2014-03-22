---
layout: post
title:  "Pimping my Terminal #1 - Bash Prompt"
date:   2014-03-22 23:20:00
categories: programming
tags:
- terminal
- shell
- bash
- dev-environment
summary: "Customizing thy bash-prompt and terminal with a little bash scripting and copy-pasting from more experienced developers, to aid productivity and please your eyes..."
---

I learned today that my shell is ugly and has no cool functions, thanks [Paul Irish][paul]. 
Okay, there is actually one cool feature I already have in my `~/.inputrc` (in my home folder `~`):

```bash
"\e[A": history-search-backward
"\e[B": history-search-forward
```

This allows me to jump through the relevant history beginning with the thing I type. So if I type `sudo`and press **UP** it will only show up commands that started with `sudo`. The other one is:

```bash
set show-all-if-ambiguous on
set completion-ignore-case on
```

This one is pretty much self explanatory. The first shows all ambiguous commands or folders immediately on pressing **TAB**, the second one ignores the case for autocompletion.

These hints I took from [one of the most popular coderwall tips][coderwall].

# Customizing the bash-prompt

For further orientation I used the [dotfiles by Mathias Bynens on Github][dotfiles-mat] and Paul Irish. 

What I first did is transforming my prompt from this:

<a href="{{site.url}}/img/posts/bashpimping/before_prompt.png"><img src="{{site.url}}/img/posts/bashpimping/before_prompt.png" alt="Before prompt"></a>

into this:

<a href="{{site.url}}/img/posts/bashpimping/after_prompt.png"><img src="{{site.url}}/img/posts/bashpimping/after_prompt.png" alt="After prompt"></a>

Beside the **username**, **machine** and **location**, you can also see the current **git branch** you are on, and if it is dirty, e.g. if you have uncommited changes in there. And, all of it, with some colors, to bring some joy to your dreary daily routine.

What you need to do for that is put this in your `~/.bash_prompt` and import it in the `~/.bash_profile` (or just put it directly in there):


```bash
if [[ $COLORTERM = gnome-* && $TERM = xterm ]] && infocmp gnome-256color >/dev/null 2>&1; then
	export TERM=gnome-256color
elif infocmp xterm-256color >/dev/null 2>&1; then
	export TERM=xterm-256color
fi

if tput setaf 1 &> /dev/null; then
	tput sgr0
	if [[ $(tput colors) -ge 256 ]] 2>/dev/null; then
		MAGENTA=$(tput setaf 9)
		ORANGE=$(tput setaf 172)
		GREEN=$(tput setaf 190)
		PURPLE=$(tput setaf 141)
		WHITE=$(tput setaf 3)
	else
		MAGENTA=$(tput setaf 5)
		ORANGE=$(tput setaf 4)
		GREEN=$(tput setaf 2)
		PURPLE=$(tput setaf 1)
		WHITE=$(tput setaf 7)
	fi
	BOLD=$(tput bold)
	RESET=$(tput sgr0)
else
	MAGENTA="\033[1;31m"
	ORANGE="\033[1;33m"
	GREEN="\033[1;32m"
	PURPLE="\033[1;35m"
	WHITE="\033[1;37m"
	BOLD=""
	RESET="\033[m"
fi

export MAGENTA
export ORANGE
export GREEN
export PURPLE
export WHITE
export BOLD
export RESET

function parse_git_dirty() {
	[[ $(git status 2> /dev/null | tail -n1) != *"working directory clean"* ]] && echo "*"
}

function parse_git_branch() {
	git branch --no-color 2> /dev/null | sed -e '/^[^*]/d' -e "s/* \(.*\)/\1$(parse_git_dirty)/"
}

export PS1="\[${BOLD}${MAGENTA}\]\u \[$WHITE\]at \[$ORANGE\]\h \[$WHITE\]in \[$GREEN\]\w\[$WHITE\]\$([[ -n \$(git branch 2> /dev/null) ]] && echo \" on \")\[$PURPLE\]\$(parse_git_branch)\[$WHITE\]\n\$ \[$RESET\]"
export PS2="\[$ORANGE\]→ \[$RESET\]"
```

So now I the shell looks good, at least on the first glance. In the following posts I will be adding to its functionality.

[paul]: https://www.youtube.com/watch?v=vDbbz-BdyYc
[coderwall]: https://coderwall.com/p/oqtj8w

[dotfiles-mat]: https://github.com/mathiasbynens/dotfiles