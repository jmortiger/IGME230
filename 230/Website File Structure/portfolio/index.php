﻿<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />

    <!--Main Stylesheet-->
    <link href="styles/main.css" type="text/css" rel="stylesheet" />

    <title>J Mor's Portfolio</title>
</head>
<body>
<?php
$emailAddressErr = $emailTitleErr = $emailBodyErr = $emailSenderNameErr = "";
$emailAddress = $emailTitle = $emailBody = $emailSenderName = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
	if (empty($_POST["emailAddress"])) $emailAddressErr = "Email Address is required.";
	else {
		$emailAddress = test_input($_POST["emailAddress"]);
		// Check if the address is formatted correctly
		if (!filter_var($emailAddress, FILTER_VALIDATE_EMAIL)) $emailAddressErr = "Invalid Email Address format.";
	}
	/*if (empty($_POST["emailSenderName"])) {
		$emailSenderNameErr = "Your name is required."; }
	else {*/
		$emailSenderName = test_input($_POST["emailSenderName"]);
		// Check if the name has only letters and whitespace
		if (!preg_match("/^[a-zA-Z ]*$/",$emailSenderName)) {
		  $emailSenderNameErr = "Name must only contain letters and whitespace."; }
	//}
	if (empty($_POST["emailTitle"])) $emailTitleErr = "Email Title is required.";
	else {
		$emailTitle = test_input($_POST["emailTitle"]);
		if (strstr($emailTitle, PHP_EOL)) $emailTitle = str_replace(PHP_EOL, " newline ", $emailTitle);
	}
	if (empty($_POST["emailBody"])) $emailBodyErr = "Email Body is required.";
	else $emailBody = test_input($_POST["emailBody"]);
	if ($emailAddressErr === "" && $emailBodyErr === "" && $emailTitleErr === "" && $emailSenderNameErr === "") {
		$recipient = "jgm1844@g.rit.edu";
		$headers = "From: " . $emailAddress;
        if ($emailSenderName !== "") $emailBody .= PHP_EOL . "From: " . $emailSenderName;
		mail($recipient, $emailTitle, $emailBody);
	}
}
function test_input($data) {
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}
?>
    <div id="wrapper">
        <header id="header" class="container-fluid w-100">
            <nav class="navbar navbar-expand-sm bg-dark">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="https://people.rit.edu/jgm1844/230/">My Homepage</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#aboutMe">About Me</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#portfolio">Portfolio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#contactSec">Contact Form</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="index.html">Without PHP</a>
                    </li>
                </ul>
            </nav>
        </header>
        <div id="content" class="container-fluid">
            <div id="carouselParent" class="carousel slide border border-light rounded-lg" data-ride="carousel" data-keyboard="true">
                <ul class="carousel-indicators">
                    <li data-target="#carouselParent" data-slide-to="0" class="active"></li>
                    <li data-target="#carouselParent" data-slide-to="1"></li>
                    <!--<li data-target="#carouselParent" data-slide-to="2"></li>-->
                </ul>
                <div class="carousel-inner">
                    <div id="carouselItem1" class="carousel-item active">
                        <div class="black-overlay">
                            <h1 id="carouselText" class="text-center">Hi, I&#39;m <b class="nameDrop">J Mor</b>.</h1>
                        </div>
                    </div>
                    <div id="carouselItem2" class="carousel-item">
                        <div class="black-overlay">
                            <h2>I&#39;m mainly a XNA/Unity Game Developer, but open to a variety of languages and engines.</h2>
                        </div>
                    </div>
                    <!--<div class="carousel-item">
                    I may not finish projects fast, but when I&#39;m done with them, it&#39;s worth the wait. If only I had the time to finish them. I mean, God forbid.
                            </div>-->
                </div>
                <a id="carouselLeft" class="carousel-control-prev fadeBlackBGInOnHover" href="#carouselParent" data-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                </a>
                <a id="carouselRight" class="carousel-control-next fadeBlackBGInOnHover" href="#carouselParent" data-slide="next">
                    <span class="carousel-control-next-icon"></span>
                </a>
            </div>
            <div id="aboutMe" class="container-fluid white-overlay rounded-lg">
                <h1 style="text-align: center;">Hi, I&#39;m <b class="nameDrop">J Mor</b>.</h1>
                <p>
                    I am a Game Designer from Long Island, New York, with a strong background in C# and MonoGame development. My more recent endevours have been the Unity engine and the PIXI.js library for WebGL and Canvas, along with refamiliarizing myself with C++.
                    My programming roots go back to my 10th grade intro classes to C++ and Java, and I&#39;ve been coding ever since. Unfortunately, that love was tragically cut short upon introduction to the evil demon Ecma, whose terrible curse has thrown me away from my love.
                </p>
            </div>
            <div id="portfolio" class="card-columns">
                <a href="https://people.rit.edu/jgm1844/230/project1/project.html" target="_blank">
                    <div class="card">
                        <img class="card-img-top" src="media/ShiftingHuesPortfolioScreencap1.PNG" alt="Shifting Hues Screencap" />
                        <div class="card-img-overlay fadeInOnHover myCardBody">
                            <div class="myCardBody card-title container-fluid">
                                <h3 class="myCardBodyItem myCardBodyItemTitle">Shifting Hues</h3>
                                <div class="myCardBodyItem myCardBodyItemText">
                                    Shifting Hues is the poster child for why games on a deadline are always of quality. Blah blah blah this card&#39;s the only one done, it feels great, no really, I&#39;ll just make Google in an hour, no sweat.
                                </div>
                            </div>
                        </div>
                        <!--<div class="card-body reveal-child-p-on-hover"> <p class="card-text">This is Shifting Hues.</p> </div>-->
                    </div>
                </a>
                <a href="https://people.rit.edu/jgm1844/230/project2/dog-finder.html" target="_blank">
                    <div class="card">
                        <img class="card-img-top" src="media/DogFinderPortfolioScreencap1.png" alt="Dog Finder Screencap" />
                        <div class="card-img-overlay fadeInOnHover myCardBody">
                            <div class="myCardBody card-title container-fluid">
                                <h3 class="myCardBodyItem myCardBodyItemTitle">Dog Finder</h3>
                                <div class="myCardBodyItem myCardBodyItemText">
                                    Shifting Hues is the poster child for why games on a deadline are always of quality. Blah blah blah this card&#39;s the only one done, it feels great, no really, I&#39;ll just make Google in an hour, no sweat.
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
                <a href="https://people.rit.edu/jgm1844/230/exercises/pixel-life/pixel-life.html" target="_blank">
                    <div class="card">
                        <img class="card-img-top" src="media/PixelLifePortfolioScreencap1.png" alt="Pixel Life Screencap" />
                        <div class="card-img-overlay fadeInOnHover myCardBody">
                            <div class="myCardBody card-title container-fluid">
                                <h3 class="myCardBodyItem myCardBodyItemTitle">Pixel Life</h3>
                                <div class="myCardBodyItem myCardBodyItemText">
                                    Shifting Hues is the poster child for why games on a deadline are always of quality. Blah blah blah this card&#39;s the only one done, it feels great, no really, I&#39;ll just make Google in an hour, no sweat.
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
                <div class="card">
                    <div class="card-body text-center">
                        <p class="card-text">This is another card.</p>
                    </div>
                </div>
                <div class="card bg-primary">
                    <div class="card-body text-center">
                        <p class="card-text">This is another card.</p>
                    </div>
                </div>
                <div class="card bg-primary">
                    <div class="card-body text-center">
                        <p class="card-text">This is another card.</p>
                    </div>
                </div>
                <div class="card bg-primary">
                    <div class="card-body text-center">
                        <p class="card-text">This is another card.</p>
                    </div>
                </div>
                <div class="card bg-primary">
                    <div class="card-body text-center">
                        <p class="card-text">This is another card.</p>
                    </div>
                </div>
                <div class="card bg-primary">
                    <div class="card-body text-center">
                        <p class="card-text">This is another card.</p>
                    </div>
                </div>
                <div class="card bg-primary">
                    <div class="card-body text-center">
                        <p class="card-text">This is another card.</p>
                    </div>
                </div>
                <div class="card bg-primary">
                    <div class="card-body text-center">
                        <p class="card-text">This is another card.</p>
                    </div>
                </div>
                <div class="card bg-primary">
                    <div class="card-body text-center">
                        <p class="card-text">This is another card.</p>
                    </div>
                </div>
                <div class="card bg-primary">
                    <div class="card-body text-center">
                        <p class="card-text">This is another card.</p>
                    </div>
                </div>
                <div class="card bg-primary">
                    <div class="card-body text-center">
                        <p class="card-text">This is another card.</p>
                    </div>
                </div>
            </div>
            <div id="contactSec" class="container-fluid">
                <form id="contactForm" method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
                    <div><input type="email" name="emailAddress" required value="<?php echo $emailAddress;?>" placeholder="Your Email Address" /><span class="formError"> * <?php echo $emailAddressErr;?></span></div>
                    <div><input type="text" name="emailTitle" required value="<?php echo $emailTitle;?>" placeholder="Email Title" /><span class="formError"> * <?php echo $emailTitleErr;?></span></div>
                    <div><input type="text" name="emailSenderName" value="<?php echo $emailSenderName;?>" placeholder="Your Name" /><span class="formError"><?php echo $emailSenderNameErr;?></span></div>
                    <textarea name="emailBody" rows="10" cols="30" placeholder="Message Body"><?php echo $emailBody;?></textarea>
                    <input type="submit" value="Submit" />
                    <input type="reset" value="Reset" />
                </form>
            </div>
        </div>
        <footer class="black-overlay">
            footer content here
        </footer>
    </div>
    <!-- Optional JavaScript  class="stretched-link"-->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>
</html>