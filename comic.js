var COMIC = {

/*  
 *   COMIC.constants:
 *   Values to be set by the website administrator
 */

constants: {

    defaultPreviewScaleFactor: 0.7,
    defaultScaleFactor: 1.2,
    maxPanels: 8,
    panelWidth: 400,
    panelHeight: 270,
    spaceBetweenPanels: 20,
    comicVerticalSpace: 10,
    comicHorizontalSpace: 10,
    comicBackgroundColor: 'fff',    
    creditsMaxLineLength: 60,
    metadataHeight: 80,

    // Characters
    character1X: 45,
    character2X: 235,
    characterY: 146,
    face1X: 52,
    face2X: 242,
    faceY: 143,

    // Text
    text1X: 110,
    text2X: 305,
    textY: 24,
    maxLineLength: 22,
    maxNumLines: 7,
    lineHeight: 17,
    textStyle: "font-family: 'Arial Black', sans-serif ; font-size: 14px; text-anchor:middle; ",
    creditsTextStyle: "font-family: 'Arial Black', sans-serif ; font-size: 12px; text-anchor:middle; ",
    bubbleStyle: "fill='#fff' stroke='#888' stroke-width='1' stroke-linejoin='round' stroke-linecap='round'",
    stemHeight: 66,

},      // End of COMIC.constants


/*  
 *    COMIC.model
 *    Values to be edited by the user (thru the website/HTML/CSS user interface)
 */

model: {

    backgroundColor: "#AAE3E3",
    character1Index: 7,
    character2Index: 12,
    panels: [ 
         {
            bubble1: "word",
            bubble2: "word",
            leftFaceIndex: 1,
            rightFaceIndex: 0,
            text1:"Hi! You can use this website to create your own comic!",
            text2: "Use the controls to create more panels and write your own dialog. Have fun!"
        },
        {
            bubble1: "word",
            bubble2: "word",
            leftFaceIndex: 0,
            rightFaceIndex: 0,
            text1:"Here we are on another panel!", 
            text2: "Yes indeed, here we are."
        }
    ],
    credits: function() {
        var out = "Made at http://foofurple.com/comic/ using the artworks '";
        out += COMIC_CHARACTERS[COMIC.model.character1Index].title;
        out += "' by ";
        out += COMIC_CHARACTERS[COMIC.model.character1Index].by;
        out += " and '";
        out += COMIC_CHARACTERS[COMIC.model.character2Index].title;
        out += "' by ";
        out += COMIC_CHARACTERS[COMIC.model.character2Index].by;
        out += ".";
        return out;
    },
    description: function() {
        var out = "<br><strong>Image description:</strong> A comic with two characters: ";
        out += COMIC_CHARACTERS[COMIC.model.character1Index].description;
        out += ", and ";
        out += COMIC_CHARACTERS[COMIC.model.character2Index].description;
        out += ". ";
        for (var i=0; i<COMIC.model.panels.length; i++) {
            if (COMIC.model.panels[i].text1 != '') {
                if (COMIC.model.panels[i].bubble1 == "word") {
                    out += " Character 1 says: '";
                }
                else if (COMIC.model.panels[i].bubble1 == "thought") {
                    out += " Character 1 thinks: '";
                }
                else {
                    out += " Character 1: '";
                }
                out += COMIC.model.panels[i].text1;
                out += "'";
            }
            if (COMIC.model.panels[i].text2 != '') {
                if (COMIC.model.panels[i].bubble2 == "word") {
                    out += " Character 2 says: '";
                }
                else if (COMIC.model.panels[i].bubble2 == "thought") {
                    out += " Character 2 says: '";
                }
                else {
                    out += "Character 2: '";
                }
                out += COMIC.model.panels[i].text2;
                out += "'";
            }
        }
        //  FIXME put me somewhere else
        out += "<br><br><em>Once the image appears, right-click and 'Save Image As' to save.</em>";

        return out;
    }
},      // End of COMIC.model


/*
 *  COMIC.controllers
 *  The HTML page user interface (most of it, anyway)
*/

controllers: {

    refreshPreview: function() {

        // Get rid of any previous greyed-out-ness
        document.getElementById("decreasePanelNum").removeAttribute("class");
        document.getElementById("increasePanelNum").removeAttribute("class");
        document.getElementById("deletePanel").removeAttribute("class");

        var maxPanelNum = COMIC.model.panels.length;
        var panelNum = parseInt( document.getElementById("panelNum").value );

        if (isNaN(panelNum)) {
            panelNum = 1;
        }
        else if (panelNum > maxPanelNum) {
            panelNum = maxPanelNum;
        }
        else if (panelNum < 1) {
            panelNum =1;
        }

        if (panelNum == maxPanelNum) {
            document.getElementById("increasePanelNum").setAttribute("class", "greyedOut");
        }
        else {
            document.getElementById("increasePanelNum").setAttribute("class", "notGreyedOut");
        }


        if (panelNum == 1) {
            document.getElementById("decreasePanelNum").setAttribute("class", "greyedOut");
        }
        else {
            document.getElementById("decreasePanelNum").setAttribute("class", "notGreyedOut");
        }

        if (COMIC.model.panels.length == 1) {
            document.getElementById("deletePanel").setAttribute("class", "greyedOut");
        }
        else {
            document.getElementById("deletePanel").setAttribute("class", "notGreyedOut");
        }

        var panelIndex = panelNum - 1;
        var svg = COMIC.svg.panelPreview(panelIndex);
        document.getElementById("svgGoesHere").innerHTML = svg;
    },


    refreshTextDisplay: function() {
        var panelNum = parseInt( document.getElementById("panelNum").value );
        var panelIndex = panelNum - 1;
        document.getElementById("character1Text").value = COMIC.model.panels[panelIndex].text1;
        document.getElementById("character2Text").value = COMIC.model.panels[panelIndex].text2;
        document.getElementById("totalPanelCount").innerHTML = COMIC.model.panels.length;
    },

    addListeners: function() {

        document.getElementById("jscolor").addEventListener("change", function() {
            COMIC.model.backgroundColor = "#" + this.value;
            COMIC.controllers.refreshPreview();
        }, false);

        document.getElementById("increasePanelNum").addEventListener("click", function() {
            var panelNum = parseInt( document.getElementById("panelNum").value );
            var panelIndex = panelNum - 1;
            var requestedPanelIndex = panelIndex + 1;

            // Check that the requested panel exists
            if ( 0 <= requestedPanelIndex && requestedPanelIndex < COMIC.model.panels.length ) { 
                var newPanelNum = requestedPanelIndex + 1;
                document.getElementById("panelNum").value = newPanelNum;
                COMIC.controllers.refreshTextDisplay();
                COMIC.controllers.refreshPreview();
            }
        }, false);

        document.getElementById("decreasePanelNum").addEventListener("click", function() {
            var panelNum = parseInt( document.getElementById("panelNum").value );
            var panelIndex = panelNum - 1;
            var requestedPanelIndex = panelIndex - 1;

            // Check that the requested panel exists
            if ( 0 <= requestedPanelIndex && requestedPanelIndex < COMIC.model.panels.length ) { 
                var newPanelNum = requestedPanelIndex + 1;
                document.getElementById("panelNum").value = newPanelNum;
                COMIC.controllers.refreshTextDisplay();
                COMIC.controllers.refreshPreview();
            }
        }, false);

        document.getElementById("panelNum").addEventListener("change", function() {
            var panelNum = parseInt(this.value);
            var panelIndex = panelNum - 1;
            if ( ! ( 0 <= panelIndex && panelIndex < COMIC.model.panels.length ) ) { 
                this.value = 1;
            }
            COMIC.controllers.refreshTextDisplay();
            COMIC.controllers.refreshPreview();
        }, false);

        document.getElementById("bubble1").addEventListener("click", function() {
            var panelNum = parseInt(document.getElementById("panelNum").value);
            var panelIndex = panelNum - 1;
            var currentStyle = COMIC.model.panels[panelIndex].bubble1;
            if (currentStyle == "thought") {
                COMIC.model.panels[panelIndex].bubble1 = "none";
            }
            else if (currentStyle == "none") {
                COMIC.model.panels[panelIndex].bubble1 = "word";
            }
            else {
                COMIC.model.panels[panelIndex].bubble1 = "thought";
            }
            COMIC.controllers.refreshPreview();
        }, false);

        document.getElementById("bubble2").addEventListener("click", function() {
            var panelNum = parseInt(document.getElementById("panelNum").value);
            var panelIndex = panelNum - 1;
            var currentStyle = COMIC.model.panels[panelIndex].bubble2;
            if (currentStyle == "thought") {
                COMIC.model.panels[panelIndex].bubble2 = "none";
            }
            else if (currentStyle == "none") {
                COMIC.model.panels[panelIndex].bubble2 = "word";
            }
            else {
                COMIC.model.panels[panelIndex].bubble2 = "thought";
            }
            COMIC.controllers.refreshPreview();
        }, false);

        document.getElementById("character1Text").addEventListener("change", function() {
            var panelNum = parseInt(document.getElementById("panelNum").value);
            var panelIndex = panelNum - 1;
            COMIC.model.panels[panelIndex].text1 = this.value;
            COMIC.controllers.refreshPreview();
        }, false);

        document.getElementById("character2Text").addEventListener("change", function() {
            var panelNum = parseInt(document.getElementById("panelNum").value);
            var panelIndex = panelNum - 1;
            COMIC.model.panels[panelIndex].text2 = this.value;
            COMIC.controllers.refreshPreview();
        }, false);

        document.getElementById("newPanel").addEventListener("click", function() {
            if (COMIC.model.panels.length < COMIC.constants.maxPanels) {
                var panelNum = parseInt(document.getElementById("panelNum").value);
                var panelIndex = panelNum - 1;
                var spliceBeforeIndex = panelIndex + 1;
                var newPanel = { bubble1: "word", bubble2: "word", text1:"Hey look, it's a new panel! Better delete this text and write something else.", text2: "", leftFaceIndex: 0, rightFaceIndex: 0 };

                // Update the model
                COMIC.model.panels.splice( spliceBeforeIndex, 0, newPanel );

                // Update the user interface thingie
                var newPanelNum = panelNum + 1;
                document.getElementById("panelNum").value = newPanelNum;
                COMIC.controllers.refreshTextDisplay();
                COMIC.controllers.refreshPreview();
            }
        }, false);

        document.getElementById("deletePanel").addEventListener("click", function() {

            // Check there are at least 2 panels, otherwise do nothing
            if (COMIC.model.panels.length > 1) {

                var panelNum = parseInt(document.getElementById("panelNum").value);
                var panelIndex = panelNum - 1;

                // Update the model
                COMIC.model.panels.splice(panelIndex, 1);

                // Get the new panelIndex
                var newPanelIndex = 0;
                if (panelIndex > 0) {
                    newPanelIndex = panelIndex - 1;
                }

                // Update the text panel interface
                var newPanelNum = newPanelIndex + 1;
                document.getElementById("panelNum").value = newPanelNum;
                COMIC.controllers.refreshTextDisplay();
                COMIC.controllers.refreshPreview();
            }
            }, false);

        document.getElementById("saveImage").addEventListener("click", function() {

            if (this.childNodes[0].nodeValue == 'Generate image') {
                document.getElementById('imageGenerationFoo').style.opacity = 1;
                this.childNodes[0].nodeValue = 'Clear image';
                COMIC.saveImage();
            }
            else {
                var parent = document.getElementById("imageGoesHere");
                parent.removeChild(parent.childNodes[0]);
                document.getElementById("description").innerHTML = "";
                document.getElementById("credits").innerHTML = "";
                document.getElementById("imageContainer").style.height = "20px";

                document.getElementById('imageGenerationFoo').style.opacity = 0;
                this.childNodes[0].nodeValue = 'Generate image';
            }

        }, false);

        document.getElementById("showFaces1").addEventListener("click", function() {
            var panelNum = parseInt(document.getElementById("panelNum").value);
            var panelIndex = panelNum - 1;
            COMIC.model.panels[panelIndex].leftFaceIndex += 1;
            if (COMIC.model.panels[panelIndex].leftFaceIndex >= COMIC_FACES.length) {
                COMIC.model.panels[panelIndex].leftFaceIndex = 0;
            }
            COMIC.controllers.refreshPreview();
        }, false);

        document.getElementById("showFaces2").addEventListener("click", function() {
            var panelNum = parseInt(document.getElementById("panelNum").value);
            var panelIndex = panelNum - 1;
            COMIC.model.panels[panelIndex].rightFaceIndex += 1;
            if (COMIC.model.panels[panelIndex].rightFaceIndex >= COMIC_FACES.length) {
                COMIC.model.panels[panelIndex].rightFaceIndex = 0;
            }
            COMIC.controllers.refreshPreview();
        }, false);
    }
},      // End of COMIC.controllers


/*
 * COMIC.imageSelectors
 *  Another part of the user interface
*/

imageSelectors: {

    selectCharacter1: function(myID) {
        var myIndex = parseInt( myID.slice(13) );

        // Deselect all other thumbnails
        var myArray = COMIC.utils.getElementsByClassName(document, "character1Selected");
        for (var i=0; i<myArray.length; i++) {
            myArray[i].setAttribute("class", "character1NotSelected");
        }
        // Select this one
        document.getElementById(myID).setAttribute("class", "character1Selected");

        // Update the model
        COMIC.model.character1Index = myIndex;

        // Refresh the preview
        COMIC.controllers.refreshPreview();
    },
    selectCharacter2: function(myID) {
        var myIndex = parseInt( myID.slice(14) );

        // Deselect all other thumbnails
        var myArray = COMIC.utils.getElementsByClassName(document, "character2Selected");
        for (var i=0; i<myArray.length; i++) {
            myArray[i].setAttribute("class", "character2NotSelected");
        }
        // Select this one
        document.getElementById(myID).setAttribute("class", "character2Selected");

        // Update the model
        COMIC.model.character2Index = myIndex;

        // Refresh the preview
        COMIC.controllers.refreshPreview();
    },

    selectScenery: function(myID) {
        var myIndex = parseInt( myID.slice(7) );

        // Deselect all other thumbnails
        var myArray = COMIC.utils.getElementsByClassName(document, "scenerySelected");
        for (var i=0; i<myArray.length; i++) {
            myArray[i].setAttribute("class", "sceneryNotSelected");
        }
        document.getElementById(myID).setAttribute("class", "scenerySelected");

        // Update the model
        COMIC.model.sceneryIndex = myIndex;

        // Refresh the preview
        COMIC.controllers.refreshPreview();
    },

    // Thumbs are loaded after page load so they don't slow it down. Asynchronous!
    loadLeftThumbs: function() {
        var parentID = "leftCharactersGoHere";
        var num = COMIC_CHARACTERS.length;
        var div = document.createElement('div');
        var parent = document.getElementById(parentID);

        for (var i=0; i<num; i++) {
            var img = new Image();
            img.id = "leftCharacter" + i;
            img.setAttribute('class','character1NotSelected');
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90">';
            svg += COMIC_CHARACTERS[i].svg;

            if (COMIC_CHARACTERS[i].hasFaces) {
                svg += "<circle cx='42' cy='41' fill='#222' stroke='none' r='3' />";
                svg += "<circle cx='72' cy='41' fill='#222' stroke='none' r='3' />";
                svg += "<path fill='none' stroke='#888' stroke-width='2' d='M 52 52 L 62 52' />";
            }
            svg += '</svg>';
            var src =  'data:image/svg+xml;utf8, ';
            src += encodeURIComponent(svg);
            img.src = src;
            img.onload = function() {
                this.addEventListener('click', function() {
                    COMIC.imageSelectors.selectCharacter1(this.id);
                }, false);
            }
            div.appendChild(img);
        }
        parent.appendChild(div);
    },

    loadRightThumbs: function() {
        var parentID = "rightCharactersGoHere";
        var num = COMIC_CHARACTERS.length;
        var div = document.createElement('div');
        var parent = document.getElementById(parentID);

        for (var i=0; i<num; i++) {
            var img = new Image();
            img.id = "rightCharacter" + i;
            img.setAttribute('class','character2NotSelected');
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90">';
            svg += COMIC_CHARACTERS[i].svg;

            if (COMIC_CHARACTERS[i].hasFaces) {
                svg += "<circle cx='42' cy='41' fill='#222' stroke='none' r='3' />";
                svg += "<circle cx='72' cy='41' fill='#222' stroke='none' r='3' />";
                svg += "<path fill='none' stroke='#888' stroke-width='2' d='M 52 52 L 62 52' />";
            }
            svg += '</svg>';
            var src =  'data:image/svg+xml;utf8, ';
            src += encodeURIComponent(svg);
            img.src = src;
            img.onload = function() {
                this.addEventListener('click', function() {
                    COMIC.imageSelectors.selectCharacter2(this.id);
                }, false);
            }
            div.appendChild(img);
        }
        parent.appendChild(div);
    }
},      // END of COMIC.imageSelectors


/*
 *  COMIC.svg
 *
*/

svg: {

    svgWidth: function(scaleFactor) {
        return scaleFactor * (COMIC.constants.panelWidth + 2 * COMIC.constants.comicHorizontalSpace);
    },

    // FIXME 
    svgHeight: function(scaleFactor, isPreview) {
        var numPanels = COMIC.model.panels.length;
        if (isPreview) {
            numPanels = 1;
        }
        return scaleFactor * (2 * COMIC.constants.comicVerticalSpace + numPanels * COMIC.constants.panelHeight + (numPanels - 1) * COMIC.constants.spaceBetweenPanels + COMIC.constants.metadataHeight);
    },

    panelY: function(panelIndex) {
        var y = COMIC.constants.comicVerticalSpace;
        y += panelIndex * (COMIC.constants.panelHeight + COMIC.constants.spaceBetweenPanels);
        return y;
    },

    creditsY: function() {
        var numPanels = COMIC.model.panels.length;
        return 2 * COMIC.constants.comicVerticalSpace + numPanels * COMIC.constants.panelHeight + (numPanels - 1) * COMIC.constants.spaceBetweenPanels + COMIC.constants.lineHeight; 
    },

    leftFace: function(panelY, panelIndex) {
        var y = panelY + COMIC.constants.faceY;     
        var svg = "<g transform='translate(";
        svg += COMIC.constants.face1X;
        svg += ", ";
        svg += y;
        svg += ")'>";
        svg += COMIC_FACES[COMIC.model.panels[panelIndex].leftFaceIndex].svg;
        svg += "</g>";
        return svg;
    },

    rightFace: function(panelY, panelIndex) {
        var y = panelY + COMIC.constants.faceY;     
        var svg = "<g transform='translate(";
        svg += COMIC.constants.face2X;
        svg += ", ";
        svg += y;
        svg += ")'>";
        svg += COMIC_FACES[COMIC.model.panels[panelIndex].rightFaceIndex].svg;
        svg += "</g>";
        return svg;
    },

    wordBubble: function(panelX, panelY, leftOrRight, numLines, style) {
        if (style == "none") {
            return "";
        }
        if (numLines == 0) {
            return "";
        }
        var bubbleWidth = 186;
        var bubbleHeight = 135;
        var bubbleX = panelX + 9;
        var bubbleY = panelY + 5;
        var rx = 10;
        var ry = 10;
        if (numLines == 1) {
            bubbleHeight = 40;
        }
        else if (numLines == 2) {
            bubbleHeight = 55;
        }
        else if (numLines == 3) {
            bubbleHeight = 70;
        }
        else if (numLines == 4) {
            bubbleHeight = 90;
        }
        else if (numLines == 5) {
            bubbleHeight = 110;
        }
        else if (numLines == 6) {
            bubbleHeight = 122;
        }
        else if (numLines == 7) {
            bubbleHeight = 133;
        }
        var stemY1 = bubbleY + bubbleHeight - 2;
        var stemY2 = bubbleY + bubbleHeight + COMIC.constants.stemHeight;

        var fooX1 = 10;
        var fooX2 = 32;
        var fooX3 = 27;
        var fooX4 = 26;
        var fooX5 = 29;

        var stemX1 = bubbleX + fooX1;
        var stemX2 = bubbleX + fooX2;
        var stemX3 = bubbleX + fooX3;
        var stemX4 = bubbleX + fooX4;
        var stemX5 = bubbleX + fooX5;

        if (leftOrRight == "right") {
            bubbleX = panelX + 205;
            stemX1 = bubbleX + bubbleWidth - fooX1;
            stemX2 = bubbleX + bubbleWidth - fooX2;
            stemX3 = bubbleX + bubbleWidth - fooX3;
            stemX4 = bubbleX + bubbleWidth - fooX4;
            stemX5 = bubbleX + bubbleWidth - fooX5;
        }

        // The main bit that contains the words
        var svg = "<rect ";
        svg += COMIC.constants.bubbleStyle;
        svg += " x='";
        svg += bubbleX;
        svg += "' y='";
        svg += bubbleY;
        svg += "' rx='";
        svg += rx;
        svg += "' ry='";
        svg += ry;
        svg += "' width='";
        svg += bubbleWidth;
        svg += "' height='";
        svg += bubbleHeight;
        svg += "' />";

    if (style == "word") {
            stemY2 -= 40;
            svg += "<path ";
            svg += COMIC.constants.bubbleStyle;
            svg += " d='M ";
            svg += stemX1;
            svg += " ";
            svg += stemY1;
            svg += " L ";
            svg += stemX2;
            svg += " ";
            svg += stemY2;
            svg += " L ";
            svg += stemX3;
            svg += " ";
            svg += stemY1;
            svg += "' />";
        }

        // Thought bubble stems
        else if (style == "thought") {

            if (numLines == 1) {

                var bubble1X = 40;
                var bubble1Y = panelY + 130;

                var bubble2X = 27;
                var bubble2Y = panelY + 100;

                var bubble3X = 20;
                var bubble3Y = panelY + 70;

                var bubble4X = 20;
                var bubble4Y = panelY + 40;

                if (leftOrRight == "right") {
                    var farX = COMIC.constants.panelWidth;
                    bubble1X = farX - bubble1X;
                    bubble2X = farX - bubble2X;
                    bubble3X = farX - bubble3X;
                    bubble4X = farX - bubble4X;
                }

                svg += "<rect width='10' height='7' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble1X;
                svg += "' y='";
                svg += bubble1Y;
                svg += "' />";

                svg += "<rect width='13' height='10' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble2X;
                svg += "' y='";
                svg += bubble2Y;
                svg += "' />";

                svg += "<rect width='18' height='14' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble3X;
                svg += "' y='";
                svg += bubble3Y;
                svg += "' />";

                svg += "<rect width='20' height='16' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble4X;
                svg += "' y='";
                svg += bubble4Y;
                svg += "' />";
            }

            else if (numLines == 2) {

                var bubble1X = 40;
                var bubble1Y = panelY + 120;

                var bubble2X = 27;
                var bubble2Y = panelY + 90;

                var bubble4X = 20;
                var bubble4Y = panelY + 55;

                if (leftOrRight == "right") {
                    var farX = COMIC.constants.panelWidth;
                    bubble1X = farX - bubble1X;
                    bubble2X = farX - bubble2X;
                    bubble4X = farX - bubble4X;
                }

                svg += "<rect width='10' height='7' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble1X;
                svg += "' y='";
                svg += bubble1Y;
                svg += "' />";

                svg += "<rect width='13' height='10' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble2X;
                svg += "' y='";
                svg += bubble2Y;
                svg += "' />";

                svg += "<rect width='20' height='16' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble4X;
                svg += "' y='";
                svg += bubble4Y;
                svg += "' />";
            }

            else if (numLines == 3) {
                var bubble1X = 40;
                var bubble1Y = panelY + 130;
                var bubble2X = 27;
                var bubble2Y = panelY + 100;
                var bubble3X = 20;
                var bubble3Y = panelY + 70;

                if (leftOrRight == "right") {
                    var farX = COMIC.constants.panelWidth;
                    bubble1X = farX - bubble1X;
                    bubble2X = farX - bubble2X;
                    bubble3X = farX - bubble3X;
                }
                svg += "<rect width='10' height='7' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble1X;
                svg += "' y='";
                svg += bubble1Y;
                svg += "' />";

                svg += "<rect width='13' height='10' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble2X;
                svg += "' y='";
                svg += bubble2Y;
                svg += "' />";

                svg += "<rect width='20' height='16' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble3X;
                svg += "' y='";
                svg += bubble3Y;
                svg += "' />";
            }

            else if (numLines == 4) {
                var bubble1X = 40;
                var bubble1Y = panelY + 120;
                var bubble2X = 27;
                var bubble2Y = panelY + 90;

                if (leftOrRight == "right") {
                    var farX = COMIC.constants.panelWidth;
                    bubble1X = farX - bubble1X;
                    bubble2X = farX - bubble2X;
                }

                svg += "<rect width='10' height='7' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble1X;
                svg += "' y='";
                svg += bubble1Y;
                svg += "' />";

                svg += "<rect width='20' height='16' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble2X;
                svg += "' y='";
                svg += bubble2Y;
                svg += "' />";
            }

            else if (numLines == 5) {
                var bubble1X = 40;
                var bubble1Y = panelY + 140;
                var bubble2X = 27;
                var bubble2Y = panelY + 110;

                if (leftOrRight == "right") {
                    var farX = COMIC.constants.panelWidth;
                    bubble1X = farX - bubble1X;
                    bubble2X = farX - bubble2X;
                }
                svg += "<rect width='10' height='7' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble1X;
                svg += "' y='";
                svg += bubble1Y;
                svg += "' />";

                svg += "<rect width='20' height='16' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble2X;
                svg += "' y='";
                svg += bubble2Y;
                svg += "' />";
            }

            else if (numLines == 6) {
                var bubble1X = 40;
                var bubble1Y = panelY + 150;
                var bubble2X = 27;
                var bubble2Y = panelY + 120;

                if (leftOrRight == "right") {
                    var farX = COMIC.constants.panelWidth;
                    bubble1X = farX - bubble1X;
                    bubble2X = farX - bubble2X;
                }

                svg += "<rect width='10' height='7' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble1X;
                svg += "' y='";
                svg += bubble1Y;
                svg += "' />";

                svg += "<rect width='20' height='16' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble2X;
                svg += "' y='";
                svg += bubble2Y;
                svg += "' />";
            }

            else if (numLines == 7) {
                var bubble1X = 40;
                var bubble1Y = panelY + 150;
                var bubble2X = 27;
                var bubble2Y = panelY + 130;

                if (leftOrRight == "right") {
                    var farX = COMIC.constants.panelWidth;
                    bubble1X = farX - bubble1X;
                    bubble2X = farX - bubble2X;
                }
                svg += "<rect width='10' height='7' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble1X;
                svg += "' y='";
                svg += bubble1Y;
                svg += "' />";
                svg += "<rect width='20' height='15' ";
                svg += COMIC.constants.bubbleStyle;
                svg += " rx='10' ry='10' x='";
                svg += bubble2X;
                svg += "' y='";
                svg += bubble2Y;
                svg += "' />";
            }
        }       // End of thought bubbles

        return svg;
    },
    panelSVG: function(i, singlePanel) {
        var svg = "";
        var text1Array = COMIC.utils.textFoo( COMIC.model.panels[i].text1, COMIC.constants.maxLineLength, COMIC.constants.maxNumLines );
        var numLines1 = text1Array.length;

        var text2Array = COMIC.utils.textFoo( COMIC.model.panels[i].text2, COMIC.constants.maxLineLength, COMIC.constants.maxNumLines );
        var numLines2 = text2Array.length;
        var panelY = COMIC.svg.panelY(i);
        if (singlePanel == true) {
            panelY = COMIC.svg.panelY(0);
        }
        var text1Y0 = panelY + COMIC.constants.textY;
        var text2Y0 = panelY + COMIC.constants.textY;

        // The part that's the same for each panel that was defined above
        svg += "<use xlink:href='#panel' x='";
        svg += COMIC.constants.comicHorizontalSpace;
        svg += "' y='";
        svg += panelY;
        svg += "' />";

        // Faces - left
        if ( COMIC_CHARACTERS[COMIC.model.character1Index].hasFaces ) {
            svg += COMIC.svg.leftFace(panelY, i);
        }

        // Faces - right
        if ( COMIC_CHARACTERS[COMIC.model.character2Index].hasFaces ) {
            svg += COMIC.svg.rightFace(panelY, i);
        }

        // Text bubbles
        svg += COMIC.svg.wordBubble(COMIC.constants.comicHorizontalSpace, panelY, "left", numLines1, COMIC.model.panels[i].bubble1);
        svg += COMIC.svg.wordBubble(COMIC.constants.comicHorizontalSpace, panelY, "right", numLines2, COMIC.model.panels[i].bubble2);

        // Loop over the substrings
        for (var j=0; j<numLines1; j++) {
            var textY = text1Y0 + j * COMIC.constants.lineHeight;
            svg += "<text x='";
            svg += COMIC.constants.text1X;
            svg += "' y='";
            svg += textY;
            svg += "'>";
            svg += text1Array[j];
            svg += "</text>";
        }

        // Loop over the substrings
        for (var j=0; j<numLines2; j++) {
            var textY = text2Y0 + j * COMIC.constants.lineHeight;
            svg += "<text x='";
            svg += COMIC.constants.text2X;
            svg += "' y='";
            svg += textY;
            svg += "'>";
            svg += text2Array[j];
            svg += "</text>";
        }
        return svg;
    },

    creditsSVG: function() {
        var svg ="";
        var creditsY = COMIC.constants.creditsY();
        var credits = COMIC.model.credits();
        var creditsLinesArray = COMIC.utils.textFoo(credits, COMIC.constants.creditsMaxLineLength, 5);
        var numLines = creditsLinesArray.length;

        for (var k=0; k<numLines; k++) {
            var textY = creditsY + k * COMIC.constants.lineHeight;
            svg += "<text id='credits' "
            svg += " x='";
            svg += 200;       // FIXME
            svg += "' y='";
            svg += textY;
            svg += "'>";
            svg += creditsLinesArray[k];
            svg += "</text>";
        }
        return svg;
    },


    top: function(scaleFactor, isPreview) {
        console.log('scaleFactor: ' + scaleFactor);
        var svg = "";
        var svgWidth = COMIC.svg.svgWidth(scaleFactor);
        var svgHeight = COMIC.svg.svgHeight(scaleFactor, isPreview);

        var svg = "<svg xmlns='http://www.w3.org/2000/svg'  xmlns:xlink='http://www.w3.org/1999/xlink'  width='";
        svg += svgWidth;
        svg += "' height='";
        svg += svgHeight;
        svg += "'>";

        svg += "<rect x='0' y='0' width='";
        svg += svgWidth;
        svg += "' height='";
        svg += svgHeight;  
        svg += "' stroke='none' fill='#";
        svg += COMIC.constants.comicBackgroundColor;
        svg += "' />";

        svg += "<g transform='scale(";
        svg += scaleFactor;                         // FIXME !!!!!!!!!!!!!!!!!
        svg += ")'>";

        // CSS style
        svg += "<style type='text/css' > <![CDATA[ text { ";
        svg += COMIC.constants.textStyle;
        svg += " } #credits {";
        svg += COMIC.constants.creditsTextStyle;
        svg += "}   ]]>  </style>";

        // Define a reusable panel element
        svg += "<defs><g id='panel'>";
        svg += "<rect rx='4' ry='4' x='-2' y='-2' stroke='#888' stroke-width='0' width='";
        svg += COMIC.constants.panelWidth;
        svg += "' height='";
        svg += COMIC.constants.panelHeight;
        svg += "' fill='";
        svg += COMIC.model.backgroundColor;
        svg += "' />";

        // Character 1
        svg += "<g transform='translate(";
        svg += COMIC.constants.character1X;
        svg += ", ";
        svg += COMIC.constants.characterY;
        svg += ")'>";
        svg += COMIC_CHARACTERS[COMIC.model.character1Index].svg;
        svg += "</g>";

        // Character 2
        svg += "<g transform='translate(";
        svg += COMIC.constants.character2X;
        svg += ", ";
        svg += COMIC.constants.characterY;
        svg += ")'>";
        svg += COMIC_CHARACTERS[COMIC.model.character2Index].svg;
        svg += "</g>";

        // End of the reusable panel element definition
        svg += "</g></defs>";

//        console.log(svg);

        return svg;
    },

    panelPreview: function(panelIndex) {
        var svgWidth = COMIC.svg.svgWidth(scaleFactor=COMIC.model.previewScaleFactor);
        var svgHeight = COMIC.svg.svgHeight(scaleFactor=COMIC.model.previewScaleFactor, isPreview=true);
        var svg = COMIC.svg.top(scaleFactor=COMIC.model.previewScaleFactor, isPreview=true);
        svg += COMIC.svg.panelSVG(panelIndex, true);
        svg += "</g></svg>";
        return svg;
    },

    getSVG: function(scaleFactor) {
        var svg = COMIC.svg.top(scaleFactor);

        // Loop over the panels
        for (var i=0; i<COMIC.model.panels.length; i++) {
            svg += COMIC.svg.panelSVG(i);
        }
        svg += COMIC.svg.creditsSVG();
        svg += "</g></svg>";
        return svg;
    }
},      // End of COMIC.svg 








/*
 *  COMIC.saveImage
 *  Turns the comic into a .PNG or a .SVG image that the user can download
*/

saveImage: function() {

    // FIXME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11
    //COMIC.model.scaleFactor = 1.2;











    var width = COMIC.constants.svgWidth();
    var height = COMIC.constants.svgHeight();
    var rawSVG = COMIC.svg.getSVG(COMIC.model.scaleFactor);

    // Set the height of the div that will hold the image
    var divHeight = height + 20;
    var stringHeight = '' + divHeight + 'px';
    document.getElementById('imageContainer').style.height = stringHeight;

    // Put the SVG in the secret svg div
    var hiddenDiv = document.getElementById('hiddenSVG');
    hiddenDiv.style.height = stringHeight;
    hiddenDiv.innerHTML = rawSVG;

    // The hidden svg element
    var svg = hiddenDiv.childNodes[0];
    document.getElementById("description").innerHTML = COMIC.model.description();

  
    // Save PNG image
    if (document.getElementById("imageFormatPNG").checked) {

         //var svg = document.querySelector( "svg" );

        var svgData = new XMLSerializer().serializeToString( svg );                     
        var canvas = document.createElement( "canvas" );
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        var ctx = canvas.getContext( "2d" );                     
        var img = document.createElement( "img" );
        img.setAttribute("width", width);
        img.setAttribute("height", height);
        img.setAttribute( "src", "data:image/svg+xml;base64," + btoa( svgData ) );

        img.onload = function() {
            ctx.drawImage(img, 0, 0, width, height);
            var myImage = new Image();
            myImage.setAttribute("id", "myImage");
            myImage.setAttribute("width", width);
            myImage.setAttribute("height", height);
            document.getElementById("imageGoesHere").appendChild(myImage);
            myImage.src = canvas.toDataURL("image/png");
        };
    }

    // Save SVG image
    else {
        var svg = COMIC.svg.getSVG(COMIC.model.scaleFactor);
        var myImage = new Image();
        myImage.setAttribute("id", "myImage");
        myImage.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
        document.getElementById("imageGoesHere").appendChild(myImage);
    }

    // FIXME
    //COMIC.model.scaleFactor = 0.7;

},      // End of COMIC.saveImage

/*
 * COMIC.init
 *
*/
init: function() {
    document.getElementById("panelNum").value = "1";

    COMIC.model.previewScaleFactor = COMIC.constants.defaultPreviewScaleFactor;
    COMIC.model.ScaleFactor = COMIC.constants.defaultScaleFactor;





    COMIC.controllers.addListeners();
    COMIC.model.backgroundColor = "#" + document.getElementById("jscolor").value;
    COMIC.controllers.refreshPreview();
    COMIC.controllers.refreshTextDisplay();
    COMIC.imageSelectors.loadLeftThumbs();
    COMIC.imageSelectors.loadRightThumbs();

    // Select the characters
    var leftID = "leftCharacter" + COMIC.model.character1Index;
    document.getElementById(leftID).setAttribute("class", "character1Selected");

    var rightID = "rightCharacter" + COMIC.model.character2Index;
    document.getElementById(rightID).setAttribute("class", "character2Selected");

},      // End of COMIC.init



/*
 * COMIC.utils
 *
*/

utils: {

    // Returns an array of substrings, one per line
    textFoo: function(text, maxLineLength, maxNumLines) {

        if (text == "" || text == " ") {
            return [];
        }

        var stringArray = [];                               // stringArray will hold substrings, one per line
        var chunks = text.split(/\n\r?/g);        // Split input text by newline characters
        while (1===1) {

            if( (stringArray.length >= maxNumLines) || (chunks.length <= 0) ) { break; }

            var chunk = chunks.shift();
            if ( chunk.length <= maxLineLength ) {      // If it is short enuf, add it as a line - deal with chunk
                stringArray.push(chunk);
            }
            else {                                     // Deal with longer chunk
                var myNewArray = COMIC.utils.dealWithLongChunk(chunk, maxLineLength);
                for( var i=0; i<myNewArray.length; i++ ) {
                    stringArray.push(myNewArray[i]);
                    if (stringArray.length >= maxNumLines) { break; }
                }
            }
        }
        return stringArray;
    },

    // Takes a chunk, breaks into words and the reconnects them into 
    // line-sized segments, and returns an array
    dealWithLongChunk: function(chunk, BUBBLE_MAX_CHARS_PER_LINE) {
        var chunkyWordsInitial = chunk.split(" ");
        var chunkyWords = [];
        var lineArray = [];
        var c = 0;
        var newLine = "";
        var testLine =  "";

        // Make sure all words in chunkyWords have lenght less than BUBBLE_MAX_CHARS_PER_LINE
        for (var i=0; i<chunkyWordsInitial.length; i++) {
            if (chunkyWordsInitial[i].length <= BUBBLE_MAX_CHARS_PER_LINE) {
                chunkyWords.push(chunkyWordsInitial[i]);
            }
            else {
                var stopMe = 0;
                var longWord = chunkyWordsInitial[i];
                while (stopMe===0) {
                    if (longWord.length <= BUBBLE_MAX_CHARS_PER_LINE) {
                        chunkyWords.push(longWord);
                        stopMe = 1;
                    }
                    else {
                        var newWord = longWord.slice(0,BUBBLE_MAX_CHARS_PER_LINE);
                        longWord = longWord.slice(BUBBLE_MAX_CHARS_PER_LINE, longWord.length);
                        chunkyWords.push(newWord);
                    }
                }
            }
        }
        while (chunkyWords.length > 0) {
            if (testLine==="") {
                testLine += chunkyWords[0];
                testLine += " ";
            }
            // Test line not (yet) too long
            if (testLine.length <= (BUBBLE_MAX_CHARS_PER_LINE+1)) {
                newLine += chunkyWords.shift();

                if (chunkyWords.length===0) {
                    lineArray[c] = newLine;
                    c += 1;
                }
                else {
                newLine += " ";
                testLine += chunkyWords[0];
                testLine += " ";
                }
            }
            // Test line too long. 
            else {
                lineArray[c] = newLine;
                testLine = "";
                newLine = "";
                c += 1;
            }
        }
        return lineArray;
    },

    getElementsByClassName: function(node,classname) {
      if (node.getElementsByClassName) { // use native implementation if available
        return node.getElementsByClassName(classname);
      } else {
        return (function getElementsByClass(searchClass,node) {
            if ( node == null )
              node = document;
            var classElements = [],
                els = node.getElementsByTagName("*"),
                elsLen = els.length,
                pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"), i, j;

            for (i = 0, j = 0; i < elsLen; i++) {
              if ( pattern.test(els[i].className) ) {
                  classElements[j] = els[i];
                  j++;
              }
            }
            return classElements;
        })(classname, node);
      }
    }
}       // End of COMIC.utils

};      // End of var COMIC
