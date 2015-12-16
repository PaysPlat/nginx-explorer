window.onload = function() {
  fileApp();
};

window.onhashchange = function() {
  fileApp();
}

function createDropDown(that) {
  var par = that.parentNode;
  return par;
}

function pageHash() { 
  return location.pathname;
}

function currentDir() {
  var config = document.getElementById("filesapp");
  var total_path = config.dataset.api + pageHash();
  return total_path;
}

function parentDir() {
  return location.pathname.slice(0, location.pathname.slice(0, location.pathname.lastIndexOf("/")).lastIndexOf("/")+1);
}

function getTargetDiv() {
  return document.getElementById("filesapp");
}

function fileApp() {
  loadJSON(currentDir(), makeFileTable, function(err) { console.error(err); });
}

function makeFileTable(data) {
  if (data.length == 0) {
    console.log("empty dir!");
  }

  var api_dir = currentDir()

  formatData(api_dir, data);
  var dataTable = ConvertJsonToTable(data, null, null, null);

  var humanDir = currentDir().slice(getTargetDiv().dataset.api.length)
  document.getElementById("indexof").innerHTML = "Index of " + humanDir
  document.title = "Index of " + humanDir
  getTargetDiv().innerHTML = dataTable;
  // Find the "Parent Directory" link then set it's parent tr to no-sort, so
  // tablesort will skip it when sorting the rest of the table. It's the first
  // row so it is stuck at the top.
  document.getElementById("parentdirlink").parentElement.parentElement.className = "no-sort";
  var headers = getTargetDiv().getElementsByTagName('th');
  addSortInfo(headers);
  var sortedTable = new Tablesort(getTargetDiv().getElementsByTagName('table')[0]);
}

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
};

function addSortInfo(div) {
  // Add the data attributes to the generated table's header row so that
  // tablesort knows how to sort each column
  div[0].setAttribute('data-sort-method', 'default');
  div[1].setAttribute('data-sort-method', 'filesize');
  div[2].setAttribute('data-sort-method', 'date');

  // set the filename as the default sort
  div[0].className += 'sort-default';
}

function formatData(baseUrl, data) {
  // Format each row in the returned JSON for humans
  
  data.forEach(function(e) {
   var name = "";

   // Make the name a clickable link
   if (e.type == "directory") {
     name = directoryfy(baseUrl, e.name);
   } else {
     name = linkify(baseUrl, e.name);
   }

   var size = "-";
   if (e.size) {
      size = humanFileSize(e.size, false);
   }

   e.Filename = name;
   e.Size = size;
   e["Last Modified"] = moment(e.mtime, "ddd, DD MMM YYYY HH:mm:ss GMT").format('D MMM YYYY HH:mm');

   delete e.size;
   delete e.name;
   delete e.type;
   delete e.mtime;
  });

  data.unshift({"Filename": parentDirLink(), "Size": "-", "Last Modified": "-"})

}

function directoryfy(base, data) {
  return '<a class="filelink typedir" href="'+ data + '/">' + iconFor(data, true) + data + '</a>';
}

function linkify(base, data) {
   return '<a class="filelink typefile" href="' + base + data + '">' + iconFor(data, false) + data + '</a>';
}

function parentDirLink() {
  return '<a class="filelink typeparent" id="parentdirlink" href="'+parentDir()+'">' + iconFor("", true) + '.. (Parent)</a>';
}

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

IconMap = {
  '7z': 'application-x-7z-compressed',
  'aac': 'audio-x-generic',
  'apk': 'android-package-archive',
  'apng': 'image-png',
  'atom': 'application-atom+xml',
  'avi': 'audio-x-generic',
  'bash': 'application-x-executable-script',
  'bmp': 'image-bmp',
  'c': 'text-x-csrc',
  'cfg': 'text-x-generic',
  'coffee': 'application-x-javascript',
  'conf': 'text-x-generic',
  'cpp': 'text-x-c++src',
  'csh': 'application-x-executable-script',
  'css': 'text-css',
  'csv': 'text-csv',
  'db': 'application-vnd.oasis.opendocument.database',
  'deb': 'application-x-deb',
  'desktop': 'application-x-desktop',
  'doc': 'x-office-document',
  'docx': 'x-office-document',
  'eml': 'message-rfc822',
  'epub': 'application-epub+zip',
  'erb': 'application-x-ruby',
  'ex': 'text-x-generic',
  'exe': 'application-x-executable',
  'fla': 'video-x-generic',
  'flac': 'audio-x-flac',
  'flv': 'video-x-generic',
  'gif': 'image-gif',
  'gml': 'text-xml',
  'go': 'text-x-generic',
  'gpx': 'text-xml',
  'gz': 'application-x-gzip',
  'h': 'text-x-chdr',
  'hxx': 'text-x-c++hdr',
  'hs': 'text-x-haskell',
  'htm': 'text-html',
  'html': 'text-html',
  'ico': 'image-x-ico',
  'ini': 'text-x-generic',
  'iso': 'application-x-cd-image',
  'jar': 'application-x-java-archive',
  'java': 'application-x-java',
  'jpeg': 'image-jpeg',
  'jpg': 'image-jpeg',
  'js': 'application-x-javascript',
  'log': 'text-x-generic',
  'lua': 'text-x-generic',
  'm3u': 'audio-x-generic',
  'markdown': 'text-x-generic',
  'md': 'text-x-generic',
  'mkv': 'video-x-matroska',
  'mp3': 'audio-x-mpeg',
  'mp4': 'video-mp4',
  'odp': 'x-office-presentation',
  'ods': 'x-office-spreadsheet',
  'odt': 'x-office-document',
  'ogg': 'audio-x-generic',
  'otf': 'application-x-font-otf',
  'pdf': 'application-pdf',
  'pgp': 'application-pgp',
  'php': 'application-x-php',
  'pkg': 'package-x-generic',
  'pl': 'application-x-perl',
  'png': 'image-png',
  'ppt': 'x-office-presentation',
  'pptx': 'x-office-presentation',
  'psd': 'image-x-psd',
  'py': 'text-x-generic',
  'pyc': 'application-x-python-bytecode',
  'rar': 'application-x-rar',
  'rb': 'application-x-ruby',
  'rpm': 'application-x-rpm',
  'rtf': 'text-rtf',
  'sh': 'application-x-executable-script',
  'svg': 'image-svg+xml-compressed',
  'svgz': 'image-svg+xml-compressed',
  'swf': 'application-x-shockwave-flash',
  'tar': 'application-x-tar',
  'text': 'text-x-generic',
  'tiff': 'image-tiff',
  'ttf': 'application-x-font-ttf',
  'txt': 'text-x-generic',
  'wav': 'audio-x-wav',
  'webm': 'video-webm',
  'wmv': 'video-x-wmv',
  'xcf': 'image-x-xcf',
  'xhtml': 'text-html',
  'xls': 'x-office-spreadsheet',
  'xlsx': 'x-office-spreadsheet',
  'xml': 'text-xml',
  'xpi': 'package-x-generic',
  'xz': 'application-x-lzma-compressed-tar',
  'zip': 'application-zip',
  'zsh': 'application-x-executable-script',
  'opml': 'text-xml',
}

function iconFor(path, isDir) {
  console.log("finding icon for", path, isDir)
  var iconImage = "<img src='/_explorer/icons/{0}.svg' width=24 class='fileicon'>"
  if (isDir) {
	  if (path =="")
	  {
		  return iconImage.format('parent');
	  }
	  else
	  {
    return iconImage.format('folder');
	  }
  }

  var extension = path.slice(path.lastIndexOf('.')+1)
  var image = "application-octet-stream"
  if (typeof IconMap[extension] != 'undefined') {
    image = IconMap[extension];
  }
  console.log("file extension", extension, image)
  return iconImage.format(image)
}
