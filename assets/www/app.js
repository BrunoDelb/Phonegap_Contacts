var contact = null; // current contact selected

// Une fois la fenêtre du navigateur chargée, initialise PhoneGap
window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
}, false);

function onFindSuccess (contacts) {
	if (contacts.length == 0) {
		navigator.notification.alert ('Aucun contact trouvé');
	}
	var contact_lu = contacts[0];
	if (contact_lu.name.givenName) {
		$('#givenName').val (contact.name.givenName);
	}
	if (contact_lu.name.familyName) {
		$('#familyName').val (contact.name.familyName);
	}
	if (contact_lu.phoneNumbers) {
		$('#phone').val (contact.phoneNumbers[0].value);
	}
	$('#delete').show();
	$.mobile.changePage ($('#pageDetailsContact'));
	contact = contact_lu;
}

function onFindError (erreor) {
	navigator.notification.alert ('Erreur: ' + error.code);
}

// Cette méthode est appelée une fois que PhoneGap est chargé
function onDeviceReady(){
	findAllContacts();

	$('#pageListeContacts li a').live('click',function(){
		var options = new ContactFindOptions();
		options.filter = $.trim ($(this).text());
		navigator.contacts.find (["name", "phoneNumbers"], onFindSuccess, onFindError, options);
	});
	
	$('#btnEnregistre').click(function(){
		if( $('#delete').is(':visible') ){
			if (contact) {
				if (givenName) {
					contact.name.givenName = $('#givenName').val();
				}
				if (familyName) {
					contact.name.familyName = $('#familyName').val();
				}
				if (phone) {
					contact.phoneNumbers = new Array();
					contact.phoneNumbers.push (new ContactField ('mobile', $('#phone').val(), true));
				}
			}
			contact.save (onSaveSuccess, onSaveError);
		} else {
			var nouveauContact = navigator.contacts.create();
			nouveauContact.name = new ContactName();
			if (givenName) {
				nouveauContact.name.givenName = $('#givenName').val();
			}
			if (familyName) {
				nouveauContact.name.familyName = $('#familyName').val();
			}
			if (phone) {
				nouveauContact.phoneNumbers = new Array();
				nouveauContact.phoneNumbers.push (new ContactField ('mobile', $('#phone').val(), true));
			}
			contact = nouveauContact;
			contact.save (onSaveSuccess, onSaveError);
		}
	});
	
	$('#btnSupprime').click(function(){
		if (contact) {
			contact.remove (onRemoveSuccess, onRemoveError);
		}
	});
}

function onSaveSuccess (contact) {
	findAllContacts();
	$.mobile.changePage ($('#pageListeContacts'));
	$('#formContact')[0].reset();
	$('#delete').hide();
	contact = null;
}

function onSaveError (erreor) {
	navigator.notification.alert ('Erreur: ' + error.code);
}

function onRemoveSuccess (contact) {
	findAllContacts();
	$.mobile.changePage ($('#pageListeContacts'));
	$('#formContact')[0].reset();
	$('#delete').hide();
	contact = null;
}

function onRemoveError (error) {
	navigator.notification.alert ('Erreur: ' + error.code);
}

function findAllContacts(){
	var optFilter = new ContactFindOptions();
	optFilter.filter = "";
	optFilter.multiple = true;
	navigator.contacts.find (["name"], onFindAllSuccess, onFindAllError, optFilter);
}

function onFindAllSuccess(contacts){
	if (contacts.length == 0) {
		$('#listeContacts').html ('Aucun contact');
	}
	var names = new Array();
	for(var i=0; i<contacts.length; ++i){
		if(contacts[i].name){
			if(contacts[i].name.formatted) names.push(contacts[i].name.formatted);
		}
	}
	names.sort();
	var html = "";
	for(var i=0; i<names.length; ++i){
		html = html + '<li>' + names[i] + '</li>';
	}
	$('#listeContacts').html (html);
	$('#listeContacts').listview('refresh');
}

function onFindAllError (error){
	navigator.notification.alert ('Erreur: ' + error.code);
}
