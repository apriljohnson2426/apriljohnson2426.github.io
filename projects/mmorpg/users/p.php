<?php
if(isset($_POST["pData"])) {
	$obj = json_decode($_POST["pData"]);
	$out = json_encode($obj);
	//file_put_contents("newdata.json", $out);
	file_put_contents("".$obj->{"id"}.".json", $out);
	print $obj->{"id"};
}
?>