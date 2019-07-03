$(document).ready(function() {
    // state = almost done (needs to be fixed for decimal numbers that start with zero - other than that it seems to work just fine from what I've seen)
    var total = 0, smallArray, newBig, newSmall, thisText, bigText, smallText, j, last, final, curr, operations = [], $big = $('#big'), $small = $('#small'), $span = $('span');
    // handles number buttons
    $('.num').click(function () {
        thisText = $(this).text(); // gets text from big text, small text, and the value of button just clicked
        bigText = $big.text();
        smallText = $small.text();
        if (smallText === "Digit Limit Met") {
            $small.text("0");
            smallText = "0";
        }
        if (!(bigText === "0" && thisText === "0")) { // will only run if the value in calculator is not already zero and the button pressed is not zero
            if ((smallText === "0" && thisText !== ".") || /=+/.test(smallText)) { // handles first instance of entering a value and case in which the '=' has already been pressed (both small and big text will get set to the value entered)
                if (/=+/.test(smallText)) operations = [];
                newSmall = newBig = thisText;
            } else if (bigText === "*" || bigText === "+" || bigText === "-" || bigText === "/") { // handles scenarion in which big text contains an operation symbol (happens after operation button is pressed) / this will set the big text to the new value pressed and will add the value pressed to small text
                if (thisText === ".") {
                    thisText = "0" + thisText;
                }
                newBig = thisText;
                if ((thisText === "." && bigText.indexOf(".") === -1) || thisText !== ".") {
                    newSmall = smallText + thisText;
                }
            } else { //de faault case (same thing happens to small as previous case, if big text is 0 it get sets equal to small, other wise it simply has newest value added on to it (there was some special case that made me realize I needed this, but I do not quite remember what it was)
                if ((thisText === "." && bigText.indexOf(".") === -1) || thisText !== ".") {
                    newSmall = smallText + thisText;
                }
                if (bigText === "0" && smallText === "0") {
                    newBig = newSmall;
                } else if (bigText === "0" && smallText !== "0") {
                    newBig = smallText.slice(smallText.lastIndexOf(operations[operations.length - 1]) + 1) + thisText;
                } else {
                    if ((thisText === "." && bigText.indexOf(".") === -1) || thisText !== ".") {
                        newBig = bigText + thisText;
                    }
                }
            }
            checkLength(newBig, newSmall);
        } else {
            if ($small.text() !== "0") $small.text("0"); // handles case in which small text might not be 0 but big text might be (sets small to 0 as well)
        }
    });
    // handles operation buttons
    $('.operation').click(function () {
        smallText = $small.text();
        bigText = $big.text();
        if ((bigText !== "0" || smallText !== "0") && smallText !== "Digit Limit Met" && bigText.charAt(bigText.length - 1) !== ".") {
            thisText = $(this).text();
            if (/=+/.test(smallText)) {
                $small.text(smallText.slice(smallText.indexOf("=") + 1) + thisText);
                $big.text(thisText);
                operations.push(thisText);
            } else if (bigText !== "+" && bigText !== "-" && bigText !== "*" && bigText !== "/") {
                $small.text(smallText + thisText);
                $big.text(thisText);
                operations.push(thisText);
            }
        }
    });
    // handles AC button
    $('#clear').click(function () {
        $span.text("0");
        operations = [];
    });

    // handles '=' button
    /* old way I used - obsolete but worth keeping for learning purposes
    $('#equals').click(function() {
      smallText = $small.text();
      if (smallText !== "0" && !/=+/.test(smallText)) {
      bigText = $big.text();
      if (bigText !== "*" && bigText !== "+" && bigText !== "-" && bigText !== "/") {
      smallArray = smallText.split(/[\+\/\x\-]/);  
      if (smallText.charAt(0) !== "-") {
        final = Number.parseFloat(smallArray[0]);
      } else {
        smallArray.splice(0, 1);
        final = Number.parseFloat("-" + smallArray[0]);
      }
      j = 0;
      for (var i = 1; i < smallArray.length; i++) {
        curr = Number.parseFloat(smallArray[i]);
        switch (operations[j]) {
          case "+":
            final += curr;
            break;
          case "-":
            final -= curr;
            break;
          case "*":
            final *= curr;
            break;
          default:
            final /= curr;
            break;
        }
        j++;
      }
      newSmall = smallText + "=" + final;
      checkLength("" + final, newSmall);
      operations = [];
      }
      }
    });
    */

    $('#equals').click(function () {
        smallText = $small.text();
        if (smallText.charAt(smallText.length - 1) !== ".") {
            final = eval(smallText);
            checkLength(final, smallText + "=" + final);
        }
    });

    // checks length of small/big text in order to see if it is outside limits (13 for big text and 43 for tiny text) - this method does the actual changing of the text
    function checkLength(big, small) {
        if (big.length > 13 || small.length > 43) {
            $big.text("0");
            $small.text("Digit Limit Met");
        } else {
            $big.text(big);
            $small.text(small);
        }
    }

    // handles CE button
    $('#erase').click(function () {
        smallText = $small.text();
        if (!/[\-\*\/\+]+/.test(smallText)) {
            $('#clear').trigger('click');
        } else if (/[=]+/.test(smallText)) {
            smallText = smallText.slice(0, smallText.indexOf("="));
            $small.text(smallText);
            $big.text(smallText.slice(smallText.lastIndexOf(operations[operations.length - 1]) + 1));
        } else {
            last = smallText.charAt(smallText.length - 1);
            if (last === "*" || last === "+" || last === "-" || last === "/") {
                $small.text(smallText.slice(0, smallText.lastIndexOf(last)));
                $big.text("0");
                operations.pop();
            } else {
                $small.text(smallText.slice(0, smallText.lastIndexOf(operations[operations.length - 1]) + 1));
                $big.text(operations[operations.length - 1]);
            }
        }
    });
});