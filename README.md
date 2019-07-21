[//]: # (Readme partial used by an default readme page)

# Xargv

Node package runner with ability to pass foreign args.

[//]: # (Readme partial used by an default readme page)

[![Code quality](https://api.codacy.com/project/badge/Grade/98129b37bd4c4b7f9ed29571c55084b5)](https://www.codacy.com/app/fifofil/xargv?utm_source=github.com&utm_medium=referral&utm_content=thefill/xargv&utm_campaign=Badge_Grade)
[![Coverage](https://api.codacy.com/project/badge/Coverage/98129b37bd4c4b7f9ed29571c55084b5)](https://www.codacy.com/app/fifofil/xargv?utm_source=github.com&utm_medium=referral&utm_content=thefill/xargv&utm_campaign=Badge_Coverage)
[![Greenkeeper badge](https://badges.greenkeeper.io/thefill/xargv.svg)](https://greenkeeper.io/)
[![CricleCi badge](https://circleci.com/gh/thefill/xargv/tree/master.svg?style=shield)](https://circleci.com/gh/thefill/xargv)

![npm version](https://img.shields.io/npm/v/xargv.svg)
[![Open issues](https://img.shields.io/github/issues-raw/thefill/xargv.svg)](https://github.com/thefill/xargv/issues)
![Types: TypeScript](https://img.shields.io/npm/types/xargv.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[//]: # (Readme partial used by an default readme page)

## Main features

*   run any node cli tool with additional args
*   passes unknown args as env variable to the e.g. underlying config scripts
*   Typescript types included
*   exposes esm/cjs modules
*   always 100% test coverage

## Guide

*   [Installation](#installation "Installation")
*   [Basic usage](#basicusage "Basic usage")
*   [API documentation](#documentation "Documentation")

## Installation

<pre>npm install --save xargv</pre>

or

<pre>yarn add xargv</pre>

or

<pre>pnpm --save xargv</pre>

## Basic usage

Imagine a situation: you want to dynamically generate webpack config (webpack.config.js)
based on provided args but webpack cli blocks you from passing any foreign values.

Below you will find way to deal with it.

### Set argv config in the config file

In the root of the project provide .xargvrc file:
<pre>{
      // command name matches first ath passed to xargv
      "webpack": {
        // this is the path to cli yo uwant to execute
        "binPath": "webpack/bin",
        // this is the env variable name all your extra args will be placed in
        "containerName": "ARGVX",
        // want to pass to xargv command args without --name? Thats the map of keys
        // for this values
        "unnamedArgKeys": [
            "unnamedA",
            "unnamedB"
        ],
        // thats the list of all args passed that should be passed as foreign vars
        "foreignKeys": [
            "unnamedA",
            "defaultA",
            "flagA",
            "inlineA"
        ],
        // thats some args you dont want to define all over the package.json
        // did you noticed one of this values will endup as foreign var? Neat!
        "defaultArgs": {
            "defaultA": "defaultValueA",
            "defaultB": "defaultValueB"
        }
    }
}</pre>

Keep in mind you can define same config in the package.json file:
<pre>{
    [...]
    "xargv": {
        [...]
    }
}</pre>

As soon as you have config defined use it in one of the npm script's:
<pre>{
    [...]
    "scripts": {
        "start": "xargv webpack foreignValue nativeValue --nativeFlag --nativeInline nativeInlineValue nativeUnmatchedValue"
    }
}</pre>

Or via cli if you have installed package globally:
<pre>
xargv webpack foreignValue nativeValue --nativeFlag --nativeInline nativeInlineValue nativeUnmatchedValue
</pre>

For working examples please take a look at the repos example dir.

[//]: # (Readme partial used by an markdown readme page)

## Documentation

Full API documentation for this package can be found [here](https://thefill.github.io/jetli "API documentations for the package")
