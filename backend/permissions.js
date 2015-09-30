var domain = require("wires-domain");
var Promise = require("promise");
var _ = require('lodash');

domain.service("$isRoot", function($permission) {
	return $permission("root") === true;
});

domain.service("$permission", function($session, $assert) {
	var group = $session.session.get("user").get("group");
	var permissions = group.get("permissions");

	return function(key) {
		return permissions[key] === true;
	};
});

domain.service("$allowed", function($permission, $isRoot) {

	return function(key) {

		if ($isRoot)
			return true;
		return $permission(key) === true;
	};
});
