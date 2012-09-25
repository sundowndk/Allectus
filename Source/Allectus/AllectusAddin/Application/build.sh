#!/bin/bash
#
# Usage: build.sh [outputdirectory]

####################################################
# INIT                                             #
####################################################
BASEDIR=$(dirname "$1")
OUTPUTDIR="$1"

####################################################
# CLEAN                                            #
####################################################
echo "Cleaning previous build..."
rm "$OUTPUTDIR/app/" -r

####################################################
# RESOURCES                                        #
####################################################
echo "Copying 'xul''..."
mkdir "$OUTPUTDIR/app"
mkdir "$OUTPUTDIR/app/Allectus"

echo "Copying 'xul''..."
for file in Application/xul/*; do
    cp -rv $file "$OUTPUTDIR/app/Allectus/"
done

####################################################
# INCLUDES                                         #
####################################################
echo "Copying 'xul''..."
mkdir "$OUTPUTDIR/app/Allectus/chrome/content/js/sndk"
for file in ../../Lib/sndk/*; do
    cp -rv $file "$OUTPUTDIR/app/Allectus/chrome/content/js/sndk/"
done

####################################################
# INCLUDES                                         #
####################################################
echo "Copying 'xul''..."
for file in Application/js/app/*; do
    cp -rv $file "$OUTPUTDIR/app/Allectus/chrome/content/js/"
done


####################################################
# JAVASCRIPT                                       #
####################################################
echo "Building 'js'..."
jsbuilder Application/allectusLib.jsb "$OUTPUTDIR/app/Allectus/chrome/content/js/"
#jsbuilder Application/build-app.jsb "$OUTPUTDIR/app/Allectus/chrome/content/js/"

