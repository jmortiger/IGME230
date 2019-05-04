<!DOCTYPE html>
<html>
<body>

<?php
$emailAddressErr = $emailTitleErr = $emailBodyErr = $emailSenderNameErr = "";
$emailAddress = $emailTitle = $emailBody = $emailSenderName = "";

if ($_SERVER[REQUEST_METHOD] == "POST") {
	if (empty($_POST["emailAddress"])) {
		$emailAddressErr = "Email Address is required.";
	}
	else {
		$emailAddress = test_input($_POST["emailAddress"]);
		// Check if the address is formatted correctly
		if (!filter_var($emailAddress, FILTER_VALIDATE_EMAIL)) {
		  $emailAddressErr = "Invalid Email Address format."; 
		}
	}
	if (empty($_POST["emailSenderName"])) {
		$emailSenderNameErr = "Your name is required.";
	}
	else {
		$emailSenderName = test_input($_POST["emailSenderName"]);
		// Check if the name has only letters and whitespace
		if (!preg_match("/^[a-zA-Z ]*$/",$emailSenderName)) {
		  $emailSenderNameErr = "Name must only contain letters and whitespace."; 
		}
	}
	if (empty($_POST["emailTitle"])) {
		$emailTitleErr = "Email Title is required.";
	}
	else {
		$emailTitle = test_input($_POST["emailTitle"]);
		if (strstr($emailTitle, PHP_EOL)) {
			$emailTitle = str_replace(PHP_EOL, " newline ", $emailTitle);
		}
	}
	if (empty($_POST["emailBody"])) {
		$emailBodyErr = "Email Body is required.";
	}
	else {
		$emailBody = test_input($_POST["emailBody"]);
	}
	if ($emailAddressErr == "" && $emailBodyErr == "" && $emailTitleErr == "" && $emailSenderNameErr == "") {
		$recipient = "jgm1844@g.rit.edu";
		$headers = "From: " . $emailAddress;

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

<div id="contactSec" class="container-fluid">
    <form id="contactForm" method="post" action="form.php">
        <div><input type="email" name="emailAddress" required value="<?php echo $emailAddress;?>"placeholder="Your Email Address" /><span class="formError"> * <?php echo $emailAddressErr;?><span> <!--<b style="color:red;">*</b>--></div>
        <div><input type="text" name="emailTitle" required value="<?php echo $emailTitle;?>"placeholder="Email Title" /><span class="formError"> * <?php echo $emailTitleErr;?></span></div>
        <div><input type="text" name="emailSenderName" value="<?php echo $emailSenderName;?>"placeholder="Your Name" /><span class="formError"><?php echo $emailSenderNameErr;?></span></div>
        <textarea name="emailBody" rows="10" cols="30" placeholder="Message Body"><?php echo$emailAddress;?></textarea>
        <input type="submit" value="Submit" />
        <input type="reset" value="Reset" />
    </form>
</div>
</body>
</html>