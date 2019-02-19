<?php
	$data = file_get_contents("http://www.cia.gov");
	echo "<h1>Here's your data!!</h1>";
	echo $data;
?>