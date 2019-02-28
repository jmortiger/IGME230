<?PHP
	$colors = ["red","green","blue"];
	echo "<ol>";
	foreach($colors as $val){
		echo "<li>$val</li>";
	}
	echo "</ol><br />";
	$links = ["RIT"=>"http://www.rit.edu",
   	"RPI"=>"http://www.rpi.edu",
   	"MCC"=>"http://www.monroecc.edu"];
	echo "<ul>";
	foreach($links as $key => $value){
		echo "<li><a href=\"$value\">$key</a></li>";
	}
	echo "</ul>";
?>