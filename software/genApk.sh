#!/bin/bash

yarn build
cd android
./gradlew assembleDebug
