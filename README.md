# nginx-explorer
A file explorer for nginx autoindex in javascript

the files must be on a folder _explorer at the root of the server.
You can choose another path, but you need to replace all the links to "_explorer" files to keep them absolute.

In the nginx.conf sample, you can set the visible name (aka 'FOLDER') of the folder (webfiles for me)
and you create the corresponding real folder (dir/webfiles for me).
the "real" folder root(aka 'PREFIX') (dir for me) shall be the same than in index.html.

ie:
nginx.conf
	location /FOLDER
		{
			try_files /_explorer/index.html /index.html;
		}
			location /PREFIX/FOLDER
		{
			alias PathOnYourHardDrive;
			autoindex on;
			autoindex_format json;
	    autoindex_exact_size off;
    	autoindex_localtime on;
		}
		
	index.html
		  <div class="grid__col grid__col--11-of-12 grid__col--centered" id="filesapp" data-api="/PREFIX">
