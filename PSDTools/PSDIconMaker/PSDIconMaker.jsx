﻿//----------------------------------------------------------------------------////               █      █                                                     ////               ████████                                                     ////             ██        ██                                                   ////            ███  █  █  ███                                                  ////            █ █        █ █                                                  ////             ████████████         PSDIconMaker.jsx - AmazingBuild           ////           █              █       Copyright (c) 2015 AmazingCow             ////          █     █    █     █      www.AmazingCow.com                        ////          █     █    █     █                                                ////           █              █       N2OMatt - n2omatt@amazingcow.com          ////             ████████████         www.amazingcow.com/n2omatt                ////                                                                            ////                                                                            ////                  This software is licensed as GPL-v3                       ////                 CHECK THE COPYING FILE TO MORE DETAILS                     ////                                                                            ////    Permission is granted to anyone to use this software for any purpose,   ////   including commercial applications, and to alter it and redistribute it   ////               freely, subject to the following restrictions:               ////                                                                            ////     0. You **CANNOT** change the type of the license.                      ////     1. The origin of this software must not be misrepresented;             ////        you must not claim that you wrote the original software.            ////     2. If you use this software in a product, an acknowledgment in the     ////        product IS HIGHLY APPRECIATED, both in source and binary forms.     ////        (See opensource.AmazingCow.com/acknowledgment.html for details).    ////        If you will not acknowledge, just send us a email. We'll be         ////        *VERY* happy to see our work being used by other people. :)         ////        The email is: acknowledgmentopensource@AmazingCow.com               ////     3. Altered source versions must be plainly marked as such,             ////        and must notbe misrepresented as being the original software.       ////     4. This notice may not be removed or altered from any source           ////        distribution.                                                       ////     5. Most important, you must have fun. ;)                               ////                                                                            ////      Visit opensource.amazingcow.com for more open-source projects.        ////                                                                            ////                                  Enjoy :)                                  ////----------------------------------------------------------------------------////Import the needed helper functions.#include "../Lib/PSDHelpers.jsx"// Variables //var sourceDoc;var savePath;var iconSizeList = [    1024,     512,     128,      80,      58,      57,      29];// Functions //function generateIcon(iconSize){    var fullpath = pathJoin(savePath, "Icon-" + iconSize + ".png");    log("Generation icon of size: " + iconSize + " Saving at: " + fullpath);    var currLayer   = sourceDoc.layers[0];    var layerSize   = getLayerSize(currLayer);    var newDocument = createDocument("Teste.png",  //Name of the document.                                     layerSize[0], //Width                                     layerSize[1], //Height                                     sourceDoc);   //Document that will be active after creation.    duplicateLayer(currLayer,    //Layer to duplicate.                   newDocument,  //Document that layer will be placed.                   true,         //Merge the layer.                   newDocument); //Document that will be active after duplication.    newDocument.resizeImage(iconSize, iconSize,                  //Width x Height                            72, ResampleMethod.BICUBICSMOOTHER); //Resolution, ResampleMethod    exportDocument(newDocument, fullpath);    closeDocument(newDocument);}function main(){    //Set the units to pixels, needed to correct functionality of the script.    preferences.rulerUnits = Units.PIXELS;    //Set the reference to current document.    sourceDoc = app.activeDocument;    //Create the Output folder at same location of    //source document. If the folder exists delete all its content.    var folder = makeFolder(sourceDoc.path, "Icons");    //Define the save path of the output images to be a path    //of output folder.    savePath = folder.fullName + "/";    //Open the log file.    openLog(sourceDoc.name, savePath, false);    for(var i = 0; i < iconSizeList.length; ++i)    {        generateIcon(iconSizeList[i]);    }    //Close the log file.    closeLog();    return 0;}main();