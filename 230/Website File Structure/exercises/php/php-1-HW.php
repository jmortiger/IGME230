<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<?PHP
	    $pageTitle = "PHP 1 HW"; // here we are declaring a variable
	?>
	<title>
	<?PHP
	    echo $pageTitle; 	// and we use that variable here
	?>
	</title>
</head>
<body>
<?PHP
	echo "<h1>$pageTitle</h1>"; // and we use that variable a second time here
	echo "<div>Content goes here!</div>";
	echo "<hr>";
	echo "Page accessed on: ";
	echo date("Y-m-d H:i:s");  // date() is a built-in PHP function
?>
</body>
</html>