function loadJSON(path, success, error)
{
    var request = new XMLHttpRequest();
	request.overrideMimeType("text/html; charset=ISO-8859-1");
    request.onreadystatechange = function()
    {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status >= 200 && request.status < 400) {
                if (success)
				{
					if (request.responseText.length==0)
					{
						success(JSON.parse("[]"));
					}
					else
					{
						success(JSON.parse(request.responseText));
					}
				}
            } else {
                if (error)
				{
					error(request);
					success(JSON.parse("[]"));
				}

            }
        }
    };
    request.open("GET", path, true);
    request.send();
}
