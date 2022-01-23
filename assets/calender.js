/*!
 * Copyright (C) 2017 ProgrammersNG.  All rights reserved.
 * This file is an original work developed by ProgrammersNG
 */

//Calender start

//Date method

export function dates(tags) {
  if (tags == "") {
    //If the dates('') paramenter is empty, add no tags
    var dates = "";
    var i;
    for (i = 1; i < 32; i++) {
      dates += i;
    }
  }
  //If the dates('option') has paramenter, add the tags to it
  else {
    var dates = "";
    var i;
    for (i = 1; i < 32; i++) {
      dates += "<" + tags + ">" + i + "</" + tags + ">";
    }
  }

  //You can call the class multiple times
  var multiple_list = document.getElementsByClassName("bear-dates");
  for (i = 0; i < multiple_list.length; i++) {
    multiple_list[i].innerHTML = dates;
  }
}

//Days method
export function days(tags) {
  //List all the Days with array
  var list_days = ["週一", "週二", "週三", "週四", "週五", "週六", "週日"];

  if (tags == "") {
    //If the days('') paramenter is empty, add no tags
    var i;
    for (i = 0, days = ""; i < list_days.length; i++) {
      days += list_days[i];
    }
  }
  //If the days('option') has paramenter, add the tags to it
  else {
    for (i = 0, days = ""; i < list_days.length; i++) {
      days += "<" + tags + ">" + list_days[i] + "</" + tags + ">";
    }
  }

  //You can call the class multiple times
  var multiple_list = document.getElementsByClassName("bear-days");
  for (i = 0; i < multiple_list.length; i++) {
    multiple_list[i].innerHTML = days;
  }
}

//Short Days method
export function short_days(tags) {
  //List all the Days with array
  var list_days = ["一", "二", "三", "四", "五", "六", "日"];

  if (tags == "") {
    //If the short_days('') paramenter is empty, add no tags
    var i;
    for (i = 0, days = ""; i < list_days.length; i++) {
      days += list_days[i];
    }
  }
  //If the days('option') has paramenter, add the tags to it
  else {
    for (i = 0, days = ""; i < list_days.length; i++) {
      days += "<" + tags + ">" + list_days[i] + "</" + tags + ">";
    }
  }

  //You can call the class multiple times
  var multiple_list = document.getElementsByClassName("bear-short-days");
  for (i = 0; i < multiple_list.length; i++) {
    multiple_list[i].innerHTML = days;
  }
}

//Months method
export function months(tags) {
  //List all the Days with array
  var list_months = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];

  if (tags == "") {
    //If the months('') paramenter is empty, add no tags
    var i;
    for (i = 0, months = ""; i < list_months.length; i++) {
      months += list_months[i];
    }
  }
  //If the months('option') has paramenter, add the tags to it
  else {
    for (i = 0, months = ""; i < list_months.length; i++) {
      months += "<" + tags + ">" + list_months[i] + "</" + tags + ">";
    }
  }

  //You can call the class multiple times
  var multiple_list = document.getElementsByClassName("bear-months");
  for (i = 0; i < multiple_list.length; i++) {
    multiple_list[i].innerHTML = months;
  }
}

//Short Months method
export function short_months(tags) {
  //List all the Months with array
  var list_months = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];

  if (tags == "") {
    //If the short_months('') paramenter is empty, add no tags
    var i;
    for (i = 0, months = ""; i < list_months.length; i++) {
      months += list_months[i];
    }
  }
  //If the months('option') has paramenter, add the tags to it
  else {
    for (i = 0, months = ""; i < list_months.length; i++) {
      months += "<" + tags + ">" + list_months[i] + "</" + tags + ">";
    }
  }

  //You can call the class multiple times
  var multiple_list = document.getElementsByClassName("bear-short-months");
  for (i = 0; i < multiple_list.length; i++) {
    multiple_list[i].innerHTML = months;
  }
}

//Year method
export function years(tags, startY, endY) {
  if (tags == "") {
    //If the years('') paramenter is empty, add no tags
    var years = "";
    for (var i = startY; i < endY + 1; i++) {
      years += i;
    }
  }
  //If the years('option') has paramenter, add the tags to it
  else {
    var years = "";
    for (var i = startY; i < endY + 1; i++) {
      years += "<" + tags + ">" + i + "</" + tags + ">";
    }
  }

  //You can call the class multiple times
  var multiple_list = document.getElementsByClassName("bear-years");
  for (i = 0; i < multiple_list.length; i++) {
    multiple_list[i].innerHTML = years;
  }
}
//Calender end
