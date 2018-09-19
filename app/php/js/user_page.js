function onSearch()
{
	console.log("call onSearch");
    document.getElementById("searchForm").submit();
}

function onCheat()
{
	console.log("call onCheat");
    document.getElementById("cheatForm").submit();
}

function onCheatCoin()
{
	console.log("call onCheatCoin");
    document.getElementById("cheatCoinForm").submit();
}

function openForm(evt, formName)
{
	var i;
	var tabcontent;
	var tablinks;
	
    tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++)
        tabcontent[i].style.display = "none";

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++)
        tablinks[i].className = tablinks[i].className.replace(" active", "");

    document.getElementById(formName).style.display = "block";
    document.getElementById("result").innerText = "";
    evt.currentTarget.className += " active";

}