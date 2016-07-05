// Stores and retrieves the form
var FormManager = {
  _form          : null,
  _formInProgress: null,

  hasForm: function() {
    return this._form !== null;
  },

  isFormInProgress: function() {
    return this._formInProgress !== null;
  },

  // Call to get the form template from the server
  getFormTemplate: function(callback) {
    var self = this;
    try {
      $.ajax({
        url: app.formTemplateUrl
      })
      .done(function(formJSON) {
        self._form = JSON.parse(formJSON);
        window.localStorage.setItem("navalForm", formJSON);
        if (typeof callback !== 'undefined') {
          callback();
        }
      })
      .fail(function(jqxhr, settings, exception) {
        console.warn( "Fail: " + exception );
        Helper.loadView('Error');
      });
    } catch (e) {
      // try-catch to handle ERR_CONNECTION_REFUSED
      console.warn("Catch: " + exception );
      Helper.loadView('Error');
    }
  },

  generatePdf: function() {
    Helper.includeScript('lib/jspdf.min');

    //FIRST GENERATE THE PDF DOCUMENT
    console.log("generating pdf...");
    var doc = new jsPDF();
     
    doc.text(20, 20, 'HELLO!');
     
    doc.setFont("courier");
    doc.setFontType("normal");
    doc.text(20, 30, 'This is a PDF document generated using JSPDF.');
    doc.text(20, 50, 'YES, Inside of PhoneGap!');
    
    var pdfOutput = doc.output();
    console.log(pdfOutput);
    
    window.requestFileSystem(
      LocalFileSystem.PERSISTENT,
      0,
      function onFileSystemSuccess(fileSystem) {
        console.log(fileSystem);
        fileSystem.root.getFile(
          "dummy.html",
          {create: true, exclusive: false},
          function gotFileEntry(fileEntry) {
            var sPath = fileEntry.fullPath.replace("dummy.html","");
            console.log(sPath);
            var fileTransfer = new FileTransfer();
            fileEntry.remove(function(){});

            fileTransfer.download(
              "http://www.w3.org/2011/web-apps-ws/papers/Nitobi.pdf",
              sPath + "theFile.pdf",
              function(theFile) {
                console.log("download complete: " + theFile.toURI());
                showLink(theFile.toURI());
              },
              function(error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code: " + error.code);
              }
            );
          }
        );
      }
    );



    //NEXT SAVE IT TO THE DEVICE'S LOCAL FILE SYSTEM
    /*console.log("file system...");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
     
      console.log('name: ' + fileSystem.name);
      console.log('root name: ' + fileSystem.root.name);
      console.log('root path: ' + fileSystem.root.fullPath);
      
      fileSystem.root.getFile("test.pdf", {create: true}, function(entry) {
        console.log(entry);
     
        entry.createWriter(function(writer) {
          writer.onwrite = function(evt) {
            console.log("write success");
            var directory = new DirectoryEntry({fullPath: '/home/aaron/Downloads/'});
            console.log(directory);
            entry.moveTo(directory, 'name.pdf', function(){}, function(error){
              console.log('error: ' + error);
            });
          };

          console.log("writing to file");
          writer.write(pdfOutput);
        },
        function(error) {
          console.log(error);
        });
      },
      function(error){
        console.log(error);
      });
    },
    function(event){
     console.log( evt.target.error.code );
    });*/
  },

  initialize: function() {
    var formTemplate = window.localStorage.getItem("navalForm");
    if (formTemplate !== null) {
      this._form = JSON.parse(formTemplate);
    }
  }
};

FormManager.initialize();