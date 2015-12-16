// Basic dates in dd/mm/yy or dd-mm-yy format.
// Years can be 4 digits. Days and Months can be 1 or 2 digits.
(function(){
  var parseDate = function(date) {
    //date = date.replace(/\-/g, '/');
   // date = date.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/, '$1/$2/$3'); // format before getTime
return Date.parse(date);
   // var tmp = date.split(' ');
    //var hours = tmp[1].split(':');
    //var parts = tmp[0].split('/');
    //return new Date(parts[2], parts[1]-1, parts[0], hours[0], hours[1], hours[2]).getTime() || -1;
  };

  Tablesort.extend('date', function(item) {
    return (
      item.search(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\.?\,?\s*/i) !== -1 ||
      item.search(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/) !== -1 ||
      item.search(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i) !== -1
    ) && !isNaN(parseDate(item));
  }, function(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();

    return parseDate(b) - parseDate(a);
  });
}());

// Filesizes. e.g. '5.35 K', '10 MB', '12.45 GB', or '4.67 TiB'
(function(){
  var compareNumber = function(a, b) {
    a = parseFloat(a);
    b = parseFloat(b);

    a = isNaN(a) ? 0 : a;
    b = isNaN(b) ? 0 : b;

    return a - b;
  },

  cleanNumber = function(i) {
    return i.replace(/[^\-?0-9.]/g, '');
  },

  // Converts filesize to bytes
  // Ex. filesize2num('123 KB') -> 123000
  // Ex. filesize2num('123 KiB') -> 125952
  filesize2num = function(filesize) {
    var matches = filesize.match(/^(\d+(\.\d+)?) ?((K|M|G|T|P|E|Z|Y|B$)i?B?)$/i);
if (matches)
{    var num    = parseFloat(cleanNumber(matches[1])),
      suffix = matches[3];

    return num * suffix2num(suffix);
} else
{
	return 0;
}
  },

  // Returns suffix multiplier
  // Ex. suffix2num('KB') -> 1000
  // Ex. suffix2num('KiB') -> 1024
  suffix2num = function(suffix) {
    suffix = suffix.toLowerCase();
    var base = suffix[1] === 'i' ? 1024 : 1000;

    switch(suffix[0]) {
      case 'b':
        return Math.pow(base, 1);
      case 'k':
        return Math.pow(base, 2);
      case 'm':
        return Math.pow(base, 3);
      case 'g':
        return Math.pow(base, 4);
      case 't':
        return Math.pow(base, 5);
      case 'p':
        return Math.pow(base, 6);
      case 'e':
        return Math.pow(base, 7);
      case 'z':
        return Math.pow(base, 8);
      case 'y':
        return Math.pow(base, 9);
      default:
        return base;
    }
  };

  Tablesort.extend('filesize', function(item) {
    return /^\d+(\.\d+)? ?(K|M|G|T|P|E|Z|Y|B$)i?B?$/i.test(item);
  }, function(a, b) {
    a = a == '' ? '0 B' : a;
    b = b == '' ? '0 B' : b;
    a = filesize2num(a);
    b = filesize2num(b);

    return compareNumber(b, a);
  });
}());
