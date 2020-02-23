var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-31088961-1"]);
_gaq.push(["_trackPageview"]);

(function() {
  var ga = document.createElement("script");
  ga.type = "text/javascript";
  ga.async = true;
  ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(ga, s);
})();

//theme  - darkest,dark,light
//let navBarClass = "w3-theme-d3";
let navBarClass = "w3-theme-l1";
let contentClass = "w3-theme-d1";
let bodyClass = "w3-theme-l1";

document.addEventListener(
  "DOMContentLoaded",
  function() {
    let unformatted_content = document.getElementById("content");

    let newDiv = document.createElement("div");
    newDiv.innerHTML = header;

    document.body.appendChild(newDiv);

    //insert navigation bar and new formatted content div.
    //document.getElementById("navbar-with-formatted-content").innerHTML = header;

    //move unformatted content to the new formatted content div.
    document.getElementById("formatted-content").appendChild(unformatted_content);

    //set theme colors.
    document.getElementById("navBar").className += " " + navBarClass;
    document.getElementById("formatted-content").className += " " + contentClass;
    document.body.className += bodyClass;
    unformatted_content.style.visibility = "visible";
  },
  false
);

let header =
  "<div id='navBar' class='w3-top'>" +
  "<div class='w3-card'>" +
  "			<div class='w3-bar'>" +
  "						<a href='/index.html' target='_top' class='w3-bar-item w3-button'>Home</a>" +
  "						<div class='w3-dropdown-hover '>" +
  "                 <button class='w3-button'>Unity3d &#9660;</button>" +
  "                 <div class='w3-dropdown-content w3-bar-block w3-card-4'>" +
  "									  <a class='w3-bar-item w3-button' target='_top' href='../Unity3D_AngryBots/angrybots.html'>AngryBots</a>" +
  "									  <a class='w3-bar-item w3-button' target='_top' href='../yofrankie/yofrankie.html'>Yo Frankie!</a>" +
  "									  <a class='w3-bar-item w3-button' target='_top' href='../Unity3D/main.html' >Island</a>" +
  "  							</div>" +
  "						</div>" +
  "						<a href='../gwt/SpiroGraph.html' target='_top' class='w3-bar-item w3-button'>GWT fun</a>" +
  "						<a href='../Misc/main.html' target='_top' class='w3-bar-item w3-button'>Java Midi</a>" +
  "						<div class='w3-dropdown-hover'>" +
  "  							<button class='w3-button'>BabylonJS &#9660;</button>" +
  "  							<div class='w3-dropdown-content w3-bar-block w3-card-4'>" +
  "									<a class='w3-bar-item w3-button' target='_top' href='../BabylonJS-Vishva/intro.html' >Vishva</a>" +
  "									<a class='w3-bar-item w3-button' target='link' href='https://ssatguru.github.io/BabylonJS-EditControl-Samples/demo/Demo.html'>EditControl</a>" +
  "									<a class='w3-bar-item w3-button' target='link' href='https://ssatguru.github.io/BabylonJS-CharacterController-Samples/demo/'>Character Controller</a>" +
  "  							</div>" +
  "						</div>" +
  "						<a href='../LeapMotion/main.html' target='_top' class='w3-bar-item w3-button'>LeapMotion</a>" +
  "						<div class='w3-dropdown-hover'>" +
  "  							<button class='w3-button'>Archive &#9660;</button>" +
  "  							<div class='w3-dropdown-content w3-bar-block w3-card-4'>" +
  "									<a class='w3-bar-item w3-button' target='_top' href='../NetRexx/main.html' target='_top' >NetRexx</a>" +
  "									<a class='w3-bar-item w3-button' target='_top' href='../SQR/main.html'>Sqr</a>" +
  "									<a class='w3-bar-item w3-button' target='_top' href='../SharpDevelop/main.html'>SharpDevelop</a>" +
  "									<a class='w3-bar-item w3-button' target='_top' href='../CloudParty/cp_games.html'>CloudParty Games</a>" +
  "									<a class='w3-bar-item w3-button' target='_blank' href='../CloudParty/b2c.html'>CloudParty Converter</a>" +
  "  							</div>" +
  "						</div>" +
  "			</div>" +
  "</div>" +
  "</div>" +
  "<br>" +
  "<br>" +
  "<div class='w3-container'>" +
  "     <div id='formatted-content' class='w3-container w3-card w3-round w3-margin-top'>" +
  "     </div>" +
  "</div>";
