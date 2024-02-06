// Service Worker
// Source from https://leanwebclub.com/tools/boilerplates/service-worker/ by Chris Ferdinandi

//
// Settings & Variables
//

// Version number
let version = '1.0.0';

// Cache IDs
let coreID = `${version}_core`;
let pageID = `${version}_pages`;
let imgID = `${version}_img`;
let apiID = `${version}_api`;
let cacheIDs = [coreID, pageID, imgID, apiID];

// Max number of files in cache
let limits = {
	pages: 35,
	imgs: 20
};

// Core assets
let coreAssets = [];


//
// Helper Methods
//

/**
 * Remove cached items over a certain number
 * @param  {String}  key The cache key
 * @param  {Integer} max The max number of items allowed
 */
function trimCache (key, max) {
	caches.open(key).then(function (cache) {
		cache.keys().then(function (keys) {
			if (keys.length <= max) return;
			cache.delete(keys[0]).then(function () {
				trimCache(key, max);
			});
		});
	});
}

/**
 * Check if cached API data is still valid
 * @param  {Object}  response The response object
 * @param  {Number}  goodFor  How long the response is good for, in milliseconds
 * @return {Boolean}          If true, cached data is valid
 */
function isValid (response, goodFor) {
	if (!response) return false;
	let fetched = response.headers.get('sw-fetched-on');
	if (fetched && (parseFloat(fetched) + goodFor) > new Date().getTime()) return true;
	return false;
}


//
// Event Listeners
//

// On install, activate immediately
self.addEventListener('install', function (event) {

	// Activate immediately
	self.skipWaiting();

	// Cache core assets
	event.waitUntil(caches.open(coreID).then(function (cache) {
		for (let asset of coreAssets) {
			cache.add(new Request(asset));
		}
		return cache;
	}));
});