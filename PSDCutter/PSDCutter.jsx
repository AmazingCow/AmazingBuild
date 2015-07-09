﻿//----------------------------------------------------------------------------////                   _   _ ____   ___  ____                                   ////                  | \ | |___ \ / _ \| __ )  ___  _   _ ____                 ////                  |  \| | __) | | | |  _ \ / _ \| | | |_  /                 ////                  | |\  |/ __/| |_| | |_) | (_) | |_| |/ /                  ////                  |_| \_|_____|\___/|____/ \___/ \__, /___|                 ////                                                 |___/                      ////                                                                            ////                                   N2OMatt                                  ////                             N2OMatt@N2OBoyz.com                            ////                           www.N2OBoyz.com/N2OMatt                          ////                                                                            ////                         Copyright (C) 2015 N2OBoyz.                        ////                                                                            ////      This software is provided 'as-is', without any express or implied     ////    warranty. In no event will the authors be held liable for any damages   ////                   arising from the use of this software.                   ////                                                                            ////    Permission is granted to anyone to use this software for any purpose,   ////   including commercial applications, and to alter it and redistribute it   ////               freely, subject to the following restrictions:               ////                                                                            ////     1. The origin of this software must not be misrepresented;             ////        you must not claim that you wrote the original software.            ////     2. If you use this software in a product, an acknowledgment in the     ////        product IS HIGHLY APPRECIATED, both in source and binary forms.     ////        (See opensource.N2OBoyz.com/acknowledgment.html for details).       ////        If you will not acknowledge, just send us a email. We'll be         ////        *VERY* happy to see our work being used by other people. :)         ////        The email is: acknowledgment.opensource@N2OBoyz.com                 ////     3. Altered source versions must be plainly marked as such,             ////        and must notbe misrepresented as being the original software.       ////     4. This notice may not be removed or altered from any source           ////        distribution.                                                       ////     5. Most important, you must have fun. ;)                               ////                                                                            ////         Visit OpenSource.N2OBoyz.com for more open-source projects.        ////                                                                            ////                                  Enjoy :)                                  ////----------------------------------------------------------------------------////Import the needed helper functions.#include "PSDHelpers.jsx"// Variables //var sourceDoc;var savePath;// Functions /////@brief Iterate for all objects of a PSDFile///and process it based in object type.///@returns 0function main(){    //Set the units to pixels, needed to correct functionality of the script.    preferences.rulerUnits = Units.PIXELS;    //Set the reference to current document.    sourceDoc = app.activeDocument;    //Create the Output folder at same location of    //source document. If the folder exists delete all its content.    var folder = makeFolder(sourceDoc.path, "Output");    //Define the save path of the output images to be a path    //of output folder.    savePath = folder.fullName + "/";    //Open the log file.    openLog(sourceDoc.name, savePath, false);    //Iterate for each top object and process it.    var objectsCount = activeDocument.layers.length;    for(var i  = 0; i < objectsCount; ++i)    {        //Get the Type of the object.        //Here are 3 acceptable types.        // - ObjectType.Prefab        // - ObjectType.Scene        // - ObjectType.Ignoreable        //        //Since we're at top level, we're going        //actually ignore the ObjectType.Ignorable.        var obj = sourceDoc.layers[i];        //Check which type the object is.             if(findObjectType(obj) == ObjectType.Prefabs) processPrefabs(obj);        else if(findObjectType(obj) == ObjectType.Scene  ) processScene  (obj);    }    //Close the log file.    closeLog();    return 0;};///@brief Iterate for all objects of a Scene///and process it based in object type.///@param scene A "layerset" with ObjectType.Scene///@returns None///@seealso ObjectTypefunction processScene(scene){    //Check if this scene should be processed.    if(findObjectType(scene) == ObjectType.Ignorable)        return;    log(scene.name);    //Iterate for each ui object and process it.    var objectsCount = scene.layers.length;    for(var i = 0; i < objectsCount; ++i)        processObject(scene.layers[i]);};///@brief Iterate of all objects in Prefabs///and process them (All prefabs are "smartobjects").///@param prefabs A "layerset" with ObjectType.Prefabs///@returns None///@seealso ObjectTypefunction processPrefabs(prefabs){    //Save a reference for the current document.    var originalDoc = app.activeDocument;    for(var i = 0; i < prefabs.layers.length; ++i)    {        var smartObject = prefabs.layers[i];        //Check if we're dealing with a group to ignore.        if(findObjectType(smartObject) == ObjectType.Ignorable)            continue;        //Open a smartobject.        sourceDoc.activeLayer = prefabs.layers[i];        var idAction = stringIDToTypeID("placedLayerEditContents");        var idDesc   = new ActionDescriptor();        executeAction(idAction, idDesc, DialogModes.NO);        var currDoc = app.activeDocument;        sourceDoc = currDoc;        //Process the objects inside the smartobject.        for(var j = 0; j < currDoc.layers.length; ++j)            processObject(currDoc.layers[j]);        currDoc.close(SaveOptions.DONOTSAVECHANGES);        sourceDoc = originalDoc    }    sourceDoc = originalDoc;}///@brief Process (Save its contents) an object.///@param prefabs A "layerset" with ObjectType.Sprite,///ObjectType.Sprite, ObjectType.Button.///@returns None///@seealso ObjectTypefunction processObject(obj){    //Check if this scene should be processed.    if(findObjectType(obj) == ObjectType.Ignorable)        return;    if(findObjectType(obj) == ObjectType.Sprite)        processSprite(obj);    else if(findObjectType(obj) == ObjectType.Button)        processButton(obj);    else        log("Object not recognized: " + name);};///@brief Process (Save its contents) a Sprite.///@param prefabs A "layerset" with ObjectType.Sprite///@returns None///@seealso ObjectTypefunction processSprite(sprite){    //Get the name of sprite and insert the underscores at right locations.    //This will transform the name of SpriteEazz to Sprite_Eazz    var name     = sprite.name;    var index    = name.indexOf("Sprite");    var realName = name.substr(index + "Sprite".length, name.length);    saveLayer(sprite, savePath + "Sprite_" + realName, app.activeDocument);    //Just to keep the PSD organized we rename the first group of the    //sprite group to contents. :)    sprite.layers[0].name = "contents";};///@brief Process (Save its contents) a Button.///The button state images will be saved with the same///size, i.e. the greater size will be used as reference///to the other state images.///The smaller ones will be centralized.///@param prefabs A "layerset" with ObjectType.Button///@returns None///@seealso ObjectTypefunction processButton(button){    //Get the name of button and insert the underscores at right locations.    //This will transform the name of ButtonEazz to Button_Eazz    var name     = button.name;    var index    = name.indexOf("Button");    var realName = name.substr(index + "Button".length, name.length);    var normalLayer   = null;    var pressedLayer  = null;    var disabledLayer = null;    //Button save paths.    var normalSavePath   = savePath +  "Button_" + realName + "_Normal";    var pressedSavePath  = savePath +  "Button_" + realName + "_Pressed";    var disabledSavePath = savePath +  "Button_" + realName + "_Disabled";\    //For each button state on the button, correct the name in the same    //way did for for the button name, and call the cut for the state.    for(var i = 0; i < button.layers.length; ++i)    {        var layer = button.layers[i];        //Check the type of button             if(layer.name.indexOf("Normal"  ) != -1) normalLayer   = layer;        else if(layer.name.indexOf("Pressed" ) != -1) pressedLayer  = layer;        else if(layer.name.indexOf("Disabled") != -1) disabledLayer = layer;    }    //Get the max Width and max Height of the layers.    var maxW = Math.max(getLayerSize(normalLayer)[0], getLayerSize(pressedLayer)[0]);    var maxH = Math.max(getLayerSize(normalLayer)[1], getLayerSize(pressedLayer)[1]);    //Is uncommon but disable layer can occurs so we must get the size of it too.    if(disabledLayer != null)    {        var maxW = Math.max(maxW, getLayerSize(disabledLayer)[0]);        var maxH = Math.max(maxH, getLayerSize(disabledLayer)[1]);        //Yep, just save the disabled layer already.        saveLayerWithSize(disabledLayer, disabledSavePath, sourceDoc, maxW, maxH);    }    //Save the normal and pressed layers.    saveLayerWithSize(pressedLayer, pressedSavePath, sourceDoc, maxW, maxH);    saveLayerWithSize(normalLayer,  normalSavePath,  sourceDoc, maxW, maxH);};//Call the script.main();