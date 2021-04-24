/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

PROJECT ON HOLD, MORE INFO IN IDEAS

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let vowels = ["A", "A", "E", "E", "E", "I", "I", "O", "O", "U"];
let consonants = ["B", "B", "C", "C", "D", "D","F", "G", "H", "H", "J", "K", "L", "L", "L", "M", "M", "N", "N", "N", "P", "Q", "R", "R", "R", "S", "S", "S", "T", "T", "V", "W", "X", "Y", "Z"];
let choice = [];

module.exports = function spelldown(msg, vows = 3, cons, client) {
    choice = [];
    //Change vows to be inputted here
    for (;vows > 0; vows--) {
        choice.push(vowels[Math.floor(Math.random()*9)])
    }
    while (choice.length < 9) {
        choice.push(consonants[Math.floor(Math.random()*34)])
    }
    shuffle(choice)
    msg.channel.send("This is the letter choice:\n```" + choice.join("  ") + "```\nYou now have 35 seconds to send your longest word");

    setTimeout(function() {
        msg.channel.send("Time is up");
    }, 3500); // changed to 3.5 seconds for testing
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

*/