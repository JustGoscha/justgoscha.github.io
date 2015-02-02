---
layout: post
title:  "Format USB stick to Install an Operating System"
date:   2015-02-02 16:17:28
categories: programming
tags:
- windows
- command-line
- tools
- installation
---

![Get you DVD image on USB]({{site.url}}/img/posts/usbboot/usb.jpg)

Today I reinstalled Linux and Windows again on my home machine, because my Windows was getting slow and I couldn't really program on it comfortably. 

To not waste any CDs and DVDs or other cumbersome storing devices here is a quick way to format your USB stick to just copy the data over from an installation image.

First open the **command line** on Windows. 
(Press Windows button -> type `cmd` -> ENTER
OR windows button -> `run` -> ENTER -> `cmd` -> ENTER):

In the command line do the following things:

```bat
:: opens disk partition tool
diskpart

:: lists all connected storage devices, look for yours (a good indication is the size)
list disk

:: select your disk
select disc <your USB disk num>

:: WARNING! this will erase your data on the USB stick
clean

:: creates a partition, select it and set it to active
create partition primary
select partition=1
active

:: format as Fat32 (same format as DVDs for example)
format fs=fat32

:: mounts it to windows
assign
```

Now you can mount an image and copy the files from the image to the USB device. When you now boot your PC and set it to boot from USB, it should launch the OS installation program on the image. Yeah!

I will probably never memorize this, because I'm doing it like once a year, max. 